import type { AgentIdentity, Offer, StrategyPrivatePolicy, SignedOffer, OfferSigner } from "../domain/types.js";

export type StrategyConcessionSchedule = {
  round: number;
  duration: number;
  yieldBps: number;
}[];

export type StrategyAgentConfig = {
  identity: AgentIdentity;
  capital: bigint;
  privatePolicy: StrategyPrivatePolicy;
  targetTerms: {
    duration: number;
    yieldBps: number;
  };
  concessionSchedule: StrategyConcessionSchedule;
  signer: OfferSigner;
};

export class StrategyAgent {
  public readonly identity: AgentIdentity;
  public readonly capital: bigint;
  
  // Private fields - explicitly kept out of public serialization
  readonly #privatePolicy: StrategyPrivatePolicy;
  readonly #targetTerms: { duration: number; yieldBps: number };
  readonly #concessionSchedule: StrategyConcessionSchedule;
  readonly #signer: OfferSigner;

  // Track the current nonce for this agent's offers
  private currentNonce: bigint = 1n;

  constructor(config: StrategyAgentConfig) {
    this.identity = config.identity;
    this.capital = config.capital;
    this.#privatePolicy = config.privatePolicy;
    this.#targetTerms = config.targetTerms;
    this.#concessionSchedule = config.concessionSchedule;
    this.#signer = config.signer;
  }

  /**
   * Evaluates a counter-offer from the Treasury Agent.
   * Returns "ACCEPT" if it meets the private policy, "REJECT" if it egregiously violates,
   * or "COUNTER" if we should continue negotiating.
   */
  public evaluateCounterOffer(counterOffer: Offer): "ACCEPT" | "COUNTER" | "REJECT" {
    // Basic validation
    if (counterOffer.proposer !== "TREASURY") {
      throw new Error("Invalid proposer for counter-offer. Expected TREASURY.");
    }
    if (counterOffer.capital !== this.capital) {
      return "REJECT"; // Capital mismatch
    }

    // Check if the counter-offer satisfies our absolute minimums (Private Policy)
    // Strategy wants low yield and high duration.
    // If Treasury demands MORE yield than we can pay, or LESS duration than we can accept:
    if (
      counterOffer.yieldBps > this.#privatePolicy.maxYieldBps ||
      counterOffer.duration < this.#privatePolicy.minDuration
    ) {
      // Check if we have any concessions left that can bridge the gap.
      const nextConcession = this.#concessionSchedule.find(c => c.round === counterOffer.round + 1);
      if (!nextConcession) {
        return "REJECT";
      }
      return "COUNTER";
    }

    // If the counter offer is BETTER or EQUAL to our target terms, accept immediately.
    // Better for Strategy means: yield is LOWER or equal, duration is HIGHER or equal.
    if (
      counterOffer.yieldBps <= this.#targetTerms.yieldBps &&
      counterOffer.duration >= this.#targetTerms.duration
    ) {
      return "ACCEPT";
    }

    // If it's acceptable by private policy but not our ideal target, 
    // check if we want to accept it or counter again.
    const nextConcession = this.#concessionSchedule.find(c => c.round === counterOffer.round + 1);
    if (!nextConcession) {
      return "ACCEPT";
    }

    // If the counter-offer is already better than what we would offer in our next concession, accept it.
    if (
      counterOffer.yieldBps <= nextConcession.yieldBps &&
      counterOffer.duration >= nextConcession.duration
    ) {
      return "ACCEPT";
    }

    return "COUNTER";
  }

  /**
   * Generates a deterministic counter-offer based on the concession schedule.
   */
  public async createCounterOffer(runId: string, currentRound: number): Promise<SignedOffer> {
    const nextRound = currentRound + 1;
    const concession = this.#concessionSchedule.find(c => c.round === nextRound);

    if (!concession) {
      throw new Error("No concession available for this round");
    }

    const offer: Offer = {
      runId,
      round: nextRound,
      proposer: "STRATEGY",
      capital: this.capital,
      duration: concession.duration,
      yieldBps: concession.yieldBps,
      expiresAt: Date.now() + 86400000,
      nonce: this.currentNonce++,
    };

    return this.#signer.signOffer(offer);
  }

  /**
   * Called to explicitly accept an offer (primarily just returns a signature of the accepted terms 
   * if needed, or simply acts as a lifecycle hook).
   */
  public async acceptOffer(offer: Offer): Promise<SignedOffer> {
    // Sign the exact terms provided to signal acceptance
    const acceptedOffer: Offer = {
      ...offer,
      proposer: "STRATEGY", // We sign it as our acceptance
      nonce: this.currentNonce++,
    };
    return this.#signer.signOffer(acceptedOffer);
  }

  /**
   * Serializes the public-facing state of the agent.
   * MUST NOT INCLUDE PRIVATE POLICY OR SALT.
   */
  public toJSON() {
    return {
      identity: this.identity,
      capital: this.capital.toString(),
    };
  }
}

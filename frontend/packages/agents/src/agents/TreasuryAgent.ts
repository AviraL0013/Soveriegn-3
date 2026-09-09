import type { AgentIdentity, Offer, PrivatePolicy, SignedOffer, OfferSigner } from "../domain/types.js";

export type ConcessionSchedule = {
  round: number;
  duration: number;
  yieldBps: number;
}[];

export type TreasuryAgentConfig = {
  identity: AgentIdentity;
  capital: bigint;
  privatePolicy: PrivatePolicy;
  targetTerms: {
    duration: number;
    yieldBps: number;
  };
  concessionSchedule: ConcessionSchedule;
  signer: OfferSigner;
};

export class TreasuryAgent {
  public readonly identity: AgentIdentity;
  public readonly capital: bigint;
  
  // Private fields - explicitly kept out of public serialization
  readonly #privatePolicy: PrivatePolicy;
  readonly #targetTerms: { duration: number; yieldBps: number };
  readonly #concessionSchedule: ConcessionSchedule;
  readonly #signer: OfferSigner;

  // Track the current nonce for this agent's offers
  private currentNonce: bigint = 1n;

  constructor(config: TreasuryAgentConfig) {
    this.identity = config.identity;
    this.capital = config.capital;
    this.#privatePolicy = config.privatePolicy;
    this.#targetTerms = config.targetTerms;
    this.#concessionSchedule = config.concessionSchedule;
    this.#signer = config.signer;
  }

  /**
   * Generates the initial offer based on the target terms.
   */
  public async createInitialOffer(runId: string): Promise<SignedOffer> {
    const offer: Offer = {
      runId,
      round: 1,
      proposer: "TREASURY",
      capital: this.capital,
      duration: this.#targetTerms.duration,
      yieldBps: this.#targetTerms.yieldBps,
      expiresAt: Date.now() + 86400000, // 24 hours from now
      nonce: this.currentNonce++,
    };

    return this.#signer.signOffer(offer);
  }

  /**
   * Evaluates a counter-offer from the Strategy Agent.
   * Returns "ACCEPT" if it meets the private policy, "REJECT" if it egregiously violates,
   * or "COUNTER" if we should continue negotiating.
   */
  public evaluateCounterOffer(counterOffer: Offer): "ACCEPT" | "COUNTER" | "REJECT" {
    // Basic validation
    if (counterOffer.proposer !== "STRATEGY") {
      throw new Error("Invalid proposer for counter-offer. Expected STRATEGY.");
    }
    if (counterOffer.capital !== this.capital) {
      return "REJECT"; // Capital mismatch
    }

    // Check if the counter-offer satisfies our absolute minimums (Private Policy)
    // If it violates the absolute minimums, we reject entirely.
    if (
      counterOffer.yieldBps < this.#privatePolicy.minYieldBps ||
      counterOffer.duration > this.#privatePolicy.maxDuration
    ) {
      // Actually, standard negotiation might just counter-offer instead of hard reject, 
      // but if it's beyond our hard limits and we have no more concessions, we might reject.
      // We will check if we have any concessions left that can bridge the gap.
      // For simplicity, if we have a valid concession left, we counter. Otherwise reject.
      const nextConcession = this.#concessionSchedule.find(c => c.round === counterOffer.round + 1);
      if (!nextConcession) {
        return "REJECT";
      }
      return "COUNTER";
    }

    // If the counter offer is BETTER or EQUAL to our target terms, accept immediately.
    if (
      counterOffer.yieldBps >= this.#targetTerms.yieldBps &&
      counterOffer.duration <= this.#targetTerms.duration
    ) {
      return "ACCEPT";
    }

    // If it's acceptable by private policy but not our ideal target, 
    // check if we want to accept it or counter again.
    // If we have concessions scheduled for the next round, we counter. 
    // If no concessions left but it meets our policy, we accept it.
    const nextConcession = this.#concessionSchedule.find(c => c.round === counterOffer.round + 1);
    if (!nextConcession) {
      return "ACCEPT";
    }

    // If the counter-offer is already better than what we would offer in our next concession, accept it.
    if (
      counterOffer.yieldBps >= nextConcession.yieldBps &&
      counterOffer.duration <= nextConcession.duration
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
      proposer: "TREASURY",
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
      proposer: "TREASURY", // We sign it as our acceptance
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

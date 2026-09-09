import type { TreasuryAgent } from "../agents/TreasuryAgent.js";
import type { StrategyAgent } from "../agents/StrategyAgent.js";
import type { NegotiationRun, ProtocolEvent, FinalTerms, Offer, SignedOffer } from "../domain/types.js";

export type EngineConfig = {
  runId: string;
  treasuryAgent: TreasuryAgent;
  strategyAgent: StrategyAgent;
  maxRounds: number;
};

export type EventListener = (event: ProtocolEvent) => void;

export class NegotiationEngine {
  private config: EngineConfig;
  private listeners: EventListener[] = [];
  private eventSequence = 1;
  private state: NegotiationRun;

  constructor(config: EngineConfig) {
    this.config = config;
    this.state = {
      runId: config.runId,
      status: "OPEN",
      rounds: [],
    };
  }

  public subscribe(listener: EventListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private emit(type: ProtocolEvent["type"], payload: any) {
    const event: ProtocolEvent = {
      eventId: `${this.config.runId}-${this.eventSequence}`,
      sequence: this.eventSequence++,
      timestamp: Date.now(),
      runId: this.config.runId,
      type,
      payload,
    };
    for (const listener of this.listeners) {
      listener(event);
    }
  }

  public async startNegotiation(): Promise<NegotiationRun> {
    if (this.state.status !== "OPEN") {
      throw new Error("Negotiation already started or completed");
    }

    this.state.status = "NEGOTIATING";
    this.emit("NEGOTIATION_STARTED", {
      treasury: this.config.treasuryAgent.toJSON(),
      strategy: this.config.strategyAgent.toJSON(),
    });

    let currentRound = 1;
    let currentOffer: SignedOffer | undefined;
    let lastProposer: "TREASURY" | "STRATEGY" = "TREASURY";

    try {
      // Round 1: Treasury creates initial offer
      currentOffer = await this.config.treasuryAgent.createInitialOffer(this.config.runId);
      
      this.recordRound(currentRound, "TREASURY", "OFFER", currentOffer);
      this.emit("OFFER_CREATED", { round: currentRound, offer: currentOffer });
      
      currentRound++;
      lastProposer = "TREASURY";

      while (this.state.status === "NEGOTIATING") {
        if (currentRound > this.config.maxRounds) {
          return this.failNegotiation("Max rounds exceeded");
        }

        if (lastProposer === "TREASURY") {
          // Strategy evaluates
          const decision = this.config.strategyAgent.evaluateCounterOffer(currentOffer!);
          if (decision === "ACCEPT") {
            const acceptedOffer = await this.config.strategyAgent.acceptOffer(currentOffer!);
            this.recordRound(currentRound, "STRATEGY", "ACCEPT");
            this.emit("OFFER_ACCEPTED", { round: currentRound, by: "STRATEGY", offer: acceptedOffer });
            return this.completeNegotiation(currentOffer!, acceptedOffer);
          } else if (decision === "REJECT") {
            this.recordRound(currentRound, "STRATEGY", "REJECT");
            this.emit("OFFER_REJECTED", { round: currentRound, by: "STRATEGY" });
            return this.failNegotiation("Rejected by strategy constraints");
          } else {
            // COUNTER
            const counterOffer = await this.config.strategyAgent.createCounterOffer(this.config.runId, currentOffer!.round);
            this.recordRound(currentRound, "STRATEGY", "COUNTER_OFFER", counterOffer);
            this.emit("COUNTER_OFFER_CREATED", { round: currentRound, offer: counterOffer });
            currentOffer = counterOffer;
            lastProposer = "STRATEGY";
          }
        } else {
          // Treasury evaluates
          const decision = this.config.treasuryAgent.evaluateCounterOffer(currentOffer!);
          if (decision === "ACCEPT") {
            const acceptedOffer = await this.config.treasuryAgent.acceptOffer(currentOffer!);
            this.recordRound(currentRound, "TREASURY", "ACCEPT");
            this.emit("OFFER_ACCEPTED", { round: currentRound, by: "TREASURY", offer: acceptedOffer });
            return this.completeNegotiation(currentOffer!, acceptedOffer);
          } else if (decision === "REJECT") {
            this.recordRound(currentRound, "TREASURY", "REJECT");
            this.emit("OFFER_REJECTED", { round: currentRound, by: "TREASURY" });
            return this.failNegotiation("Rejected by treasury constraints");
          } else {
            // COUNTER
            const counterOffer = await this.config.treasuryAgent.createCounterOffer(this.config.runId, currentOffer!.round);
            this.recordRound(currentRound, "TREASURY", "COUNTER_OFFER", counterOffer);
            this.emit("COUNTER_OFFER_CREATED", { round: currentRound, offer: counterOffer });
            currentOffer = counterOffer;
            lastProposer = "TREASURY";
          }
        }
        currentRound++;
      }
    } catch (err: any) {
      return this.failNegotiation(`Internal error: ${err.message}`);
    }

    return this.state;
  }

  private recordRound(round: number, actor: "TREASURY" | "STRATEGY", action: "OFFER" | "COUNTER_OFFER" | "ACCEPT" | "REJECT", offer?: SignedOffer) {
    this.state.rounds.push({
      runId: this.config.runId,
      round,
      timestamp: Date.now(),
      actor,
      action,
      offer
    });
  }

  private completeNegotiation(agreedTerms: SignedOffer, acceptanceSign: SignedOffer) {
    this.state.status = "CONVERGED";
    const finalTerms: FinalTerms = {
      runId: this.config.runId,
      capital: agreedTerms.capital,
      duration: agreedTerms.duration,
      yieldBps: agreedTerms.yieldBps,
      acceptedAt: Date.now(),
      treasurySignature: agreedTerms.proposer === "TREASURY" ? agreedTerms.signature : acceptanceSign.signature,
      strategySignature: agreedTerms.proposer === "STRATEGY" ? agreedTerms.signature : acceptanceSign.signature,
    };
    this.state.finalTerms = finalTerms;
    this.emit("NEGOTIATION_COMPLETED", finalTerms);
    return this.state;
  }

  private failNegotiation(reason: string) {
    this.state.status = "FAILED";
    this.emit("NEGOTIATION_FAILED", { reason });
    return this.state;
  }
}

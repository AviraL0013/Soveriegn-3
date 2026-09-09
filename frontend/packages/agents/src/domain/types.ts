// ============================================================
// W3 DOMAIN TYPES
// Independent of Solidity / viem
// ============================================================

// ─── PRIVACY MODEL ────────────────────────────────────────────
//
// BREACH-ONLY PUBLICATION
//
// The CRE/TEE evaluates risk privately on every tick.
// While the position is SAFE, nothing is submitted to DecisionSink.
// Only when the threshold is crossed does the CRE submit:
//   CHECK_BREACH, result = false (BREACHED)
//
// This prevents the binary-search oracle attack:
//   Observer watching 280→SAFE, 290→SAFE, 310→BREACHED
//   learns that 280 < maxLossBps <= 310 and can narrow the interval.
//
// With breach-only publication the observer learns only:
//   310→BREACHED
// They know the threshold was breached at that observation, but
// cannot narrow it using a history of public SAFE results.
//
// RESIDUAL LEAKAGE (documented, not a bug):
//   When the contract transitions ACTIVE→BREACHED, observers learn
//   the private condition became true at that moment. ZK proofs
//   hide the threshold and inputs but the boolean result and the
//   resulting on-chain transition remain visible. This is inherent
//   to public-chain enforcement and cannot be eliminated without
//   confidential chain state.
//
// See PRIVACY_LIMITATIONS.md for the full analysis.
// ──────────────────────────────────────────────────────────────

export type AgentIdentity = {
  name: string;
  address: string;
  role: "PROPOSER" | "COUNTERPARTY";
};

export type PrivatePolicy = {
  minYieldBps: number;
  maxLossBps: number;
  maxDuration: number;
  salt: string;
};

export type StrategyPrivatePolicy = {
  maxYieldBps: number;
  minDuration: number;
  maxLossBps: number;
  salt: string;
};

export type Agent = {
  identity: AgentIdentity;
  capital: bigint;
  // Note: The private policy is typically held in memory
  // and NOT exposed in serialized state or public events.
  _privatePolicy?: PrivatePolicy | StrategyPrivatePolicy; 
};

export type Offer = {
  runId: string;
  round: number;
  proposer: "TREASURY" | "STRATEGY";
  capital: bigint;
  duration: number; // in days typically, or seconds
  yieldBps: number;
  expiresAt: number; // unix timestamp
  nonce: bigint;
};

export type SignedOffer = Offer & {
  signature: string;
  signerAddress: string;
};

// Canonical agreement terms signed under EIP-712 (excluding W3 negotiation session metadata)
export type CanonicalOfferTerms = {
  capital: bigint;
  duration: number; // in days typically, or seconds
  yieldBps: number;
  expiresAt: number; // unix timestamp
  nonce: bigint;
};

// Shared signer interface used by both TreasuryAgent and StrategyAgent
export interface OfferSigner {
  signOffer(offer: Offer): Promise<SignedOffer>;
}

export type NegotiationRound = {
  runId: string;
  round: number;
  timestamp: number;
  actor: "TREASURY" | "STRATEGY";
  action: "OFFER" | "COUNTER_OFFER" | "ACCEPT" | "REJECT";
  offer?: SignedOffer;
};

export type FinalTerms = {
  runId: string;
  capital: bigint;
  duration: number;
  yieldBps: number;
  acceptedAt: number;
  treasurySignature: string;
  strategySignature: string;
};

export type NegotiationRun = {
  runId: string;
  status: "OPEN" | "NEGOTIATING" | "CONVERGED" | "FAILED";
  rounds: NegotiationRound[];
  finalTerms?: FinalTerms;
};

// RiskUpdate is produced PRIVATELY by the CRE/TEE on every monitoring tick.
// It is NEVER submitted to a public event log or on-chain sink while the
// position is safe. The observed risk value is not included because publishing
// it would let observers correlate subsequent SAFE results with the threshold.
export type RiskUpdate = {
  runId: string;
  timestamp: number;
  // NOTE: isBreached is the ONLY field relevant for the on-chain submission.
  // Do not emit currentRiskScore in any public event — it enables threshold inference.
  isBreached: boolean;
};

// Decision describes an on-chain submission to DecisionSink.
//
// IMPORTANT — Breach-only invariant:
//   checkKind=2 (Breach) decisions MUST only be submitted when result=false
//   (i.e., the threshold was crossed). Submitting a SAFE breach check
//   (result=true) reveals that the current observed value was below the
//   threshold, forming one data point in a binary-search oracle.
//
//   Use NonActionableDecisionError to reject SAFE breach submissions at
//   the application layer before they reach the chain.
export type Decision = {
  runId: string;
  timestamp: number;
  checkKind: 1 | 2; // 1 = Validation, 2 = Breach
  // Validation (checkKind=1): true=ACCEPT, false=REJECT
  // Breach    (checkKind=2): ONLY false=BREACHED is ever submitted on-chain.
  //                          true (SAFE) is evaluated privately and DISCARDED.
  result: boolean;
};

/**
 * Thrown when a caller attempts to submit a non-actionable breach decision
 * (i.e., checkKind=BREACH with result=SAFE) to a public sink.
 *
 * Enforcement pattern:
 *   if (decision.checkKind === 2 && decision.result === true) {
 *     throw new NonActionableDecisionError(decision.runId);
 *   }
 */
export class NonActionableDecisionError extends Error {
  constructor(runId: string) {
    super(
      `NonActionableDecision: Breach check with result=SAFE for run "${runId}" ` +
      `must not be submitted publicly. Evaluate privately and discard.`
    );
    this.name = "NonActionableDecisionError";
  }
}

/**
 * Guards against submitting a SAFE breach check to a public sink.
 * Call this before any DecisionSink submission.
 */
export function assertActionableDecision(decision: Decision): void {
  if (decision.checkKind === 2 && decision.result === true) {
    throw new NonActionableDecisionError(decision.runId);
  }
}

export type ProtocolEventType =
  | "NEGOTIATION_STARTED"
  | "OFFER_CREATED"
  | "COUNTER_OFFER_CREATED"
  | "OFFER_ACCEPTED"
  | "OFFER_REJECTED"
  | "NEGOTIATION_COMPLETED"
  | "NEGOTIATION_FAILED"
  // RISK_EVALUATED is a LOCAL/PRIVATE event — never emitted to a public sink.
  // It represents a single CRE/TEE monitoring tick. The observed value MUST
  // NOT be included in the event payload (threshold inference risk).
  | "RISK_EVALUATED"
  // BREACH_DETECTED is the ONLY breach-related event that may be submitted
  // on-chain. It represents the first actionable breach: a crossing of the
  // private threshold confirmed by the TEE and backed by a ZK proof.
  | "BREACH_DETECTED"
  // DECISION_RECEIVED covers Validation decisions (checkKind=1).
  // For Breach decisions (checkKind=2), only BREACH_DETECTED is emitted.
  | "DECISION_RECEIVED";

export type ProtocolEvent<T = any> = {
  eventId: string;
  sequence: number;
  timestamp: number;
  runId: string;
  type: ProtocolEventType;
  payload: T;
};

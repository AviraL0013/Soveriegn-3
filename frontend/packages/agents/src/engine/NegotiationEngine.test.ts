import { describe, it, expect, vi } from "vitest";
import { NegotiationEngine } from "./NegotiationEngine.js";
import { TreasuryAgent } from "../agents/TreasuryAgent.js";
import { StrategyAgent } from "../agents/StrategyAgent.js";
import type { Offer, ProtocolEvent } from "../domain/types.js";

// ─── Shared mock signer ────────────────────────────────────────────────────
const makeTreasurySigner = () => ({
  signOffer: async (offer: Offer) => ({
    ...offer,
    signature: `0xtreasury_sig_r${offer.round}_n${offer.nonce}`,
    signerAddress: "0xtreasury",
  }),
});

const makeStrategySigner = () => ({
  signOffer: async (offer: Offer) => ({
    ...offer,
    signature: `0xstrategy_sig_r${offer.round}_n${offer.nonce}`,
    signerAddress: "0xstrategy",
  }),
});

// ─── Standard configs that WILL converge ──────────────────────────────────
const makeConvergingAgents = () => {
  const treasury = new TreasuryAgent({
    identity: { name: "Treasury", address: "0xtreasury", role: "PROPOSER" },
    capital: 100_000n,
    privatePolicy: { minYieldBps: 800, maxLossBps: 300, maxDuration: 30, salt: "0xsecret1" },
    targetTerms: { duration: 30, yieldBps: 900 },
    // Treasury concedes: round 3 → 850bps/27days, round 5 → 820bps/25days
    concessionSchedule: [
      { round: 3, duration: 27, yieldBps: 850 },
      { round: 5, duration: 25, yieldBps: 820 },
    ],
    signer: makeTreasurySigner(),
  });

  const strategy = new StrategyAgent({
    identity: { name: "Strategy", address: "0xstrategy", role: "COUNTERPARTY" },
    capital: 100_000n,
    privatePolicy: { maxYieldBps: 900, minDuration: 20, maxLossBps: 300, salt: "0xsecret2" },
    targetTerms: { duration: 60, yieldBps: 700 },
    // Strategy concedes: round 2 → 880bps/28days (better than treasury's round-1 offer)
    concessionSchedule: [
      { round: 2, duration: 28, yieldBps: 880 },
    ],
    signer: makeStrategySigner(),
  });

  return { treasury, strategy };
};

// ─── Configs that WILL fail (strategy can never accept treasury's minimums) ─
const makeFailingAgents = () => {
  const treasury = new TreasuryAgent({
    identity: { name: "Treasury", address: "0xtreasury", role: "PROPOSER" },
    capital: 100_000n,
    privatePolicy: { minYieldBps: 950, maxLossBps: 300, maxDuration: 10, salt: "0xsecretA" },
    targetTerms: { duration: 10, yieldBps: 1000 },
    concessionSchedule: [], // no concessions
    signer: makeTreasurySigner(),
  });

  const strategy = new StrategyAgent({
    identity: { name: "Strategy", address: "0xstrategy", role: "COUNTERPARTY" },
    capital: 100_000n,
    privatePolicy: { maxYieldBps: 800, minDuration: 30, maxLossBps: 300, salt: "0xsecretB" },
    targetTerms: { duration: 60, yieldBps: 500 },
    concessionSchedule: [], // no concessions
    signer: makeStrategySigner(),
  });

  return { treasury, strategy };
};

// ──────────────────────────────────────────────────────────────────────────
// TEST 1 — Successful negotiation: final state = CONVERGED
// ──────────────────────────────────────────────────────────────────────────
describe("NegotiationEngine - Test 1: Successful negotiation", () => {
  it("produces final state CONVERGED", async () => {
    const { treasury, strategy } = makeConvergingAgents();
    const engine = new NegotiationEngine({ runId: "run-1", treasuryAgent: treasury, strategyAgent: strategy, maxRounds: 20 });
    const run = await engine.startNegotiation();
    expect(run.status).toBe("CONVERGED");
  });
});

// ──────────────────────────────────────────────────────────────────────────
// TEST 2 — Final terms: assert exact capital, duration, yieldBps
// ──────────────────────────────────────────────────────────────────────────
describe("NegotiationEngine - Test 2: Final terms accuracy", () => {
  it("produces exact expected final terms", async () => {
    const { treasury, strategy } = makeConvergingAgents();
    const engine = new NegotiationEngine({ runId: "run-2", treasuryAgent: treasury, strategyAgent: strategy, maxRounds: 20 });
    const run = await engine.startNegotiation();
    expect(run.finalTerms).toBeDefined();
    // Treasury's round-1 offer: 900bps, 30days
    // Strategy counters round-2: 880bps, 28days
    // Treasury evaluates: 880bps >= 850bps (next concession) AND 28days <= 27days? No, 28 > 27
    // So Treasury counters round-3: 850bps, 27days
    // Strategy evaluates: 850bps <= 880bps (own last counter), duration 27 < 28 (not better)
    // Strategy has no round-4 concession → ACCEPT
    expect(run.finalTerms!.capital).toBe(100_000n);
    expect(run.finalTerms!.yieldBps).toBe(850);
    expect(run.finalTerms!.duration).toBe(27);
  });
});

// ──────────────────────────────────────────────────────────────────────────
// TEST 3 — Determinism: run 100 times, all results identical
// ──────────────────────────────────────────────────────────────────────────
describe("NegotiationEngine - Test 3: Determinism", () => {
  it("produces identical results on 100 consecutive runs", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(1_000_000);

    const runOnce = async () => {
      const { treasury, strategy } = makeConvergingAgents();
      const engine = new NegotiationEngine({ runId: "run-det", treasuryAgent: treasury, strategyAgent: strategy, maxRounds: 20 });
      const events: ProtocolEvent[] = [];
      engine.subscribe((e) => events.push(e));
      const run = await engine.startNegotiation();
      return {
        status: run.status,
        roundCount: run.rounds.length,
        finalTerms: run.finalTerms
          ? { capital: run.finalTerms.capital, duration: run.finalTerms.duration, yieldBps: run.finalTerms.yieldBps }
          : null,
        eventTypes: events.map((e) => e.type),
      };
    };

    const first = await runOnce();
    for (let i = 0; i < 99; i++) {
      const result = await runOnce();
      expect(result.status).toBe(first.status);
      expect(result.roundCount).toBe(first.roundCount);
      expect(result.finalTerms).toStrictEqual(first.finalTerms);
      expect(result.eventTypes).toStrictEqual(first.eventTypes);
    }

    vi.useRealTimers();
  });
});

// ──────────────────────────────────────────────────────────────────────────
// TEST 4 — Negotiation history: all expected rounds in correct order
// ──────────────────────────────────────────────────────────────────────────
describe("NegotiationEngine - Test 4: Negotiation history", () => {
  it("records all rounds in monotonically increasing order", async () => {
    const { treasury, strategy } = makeConvergingAgents();
    const engine = new NegotiationEngine({ runId: "run-4", treasuryAgent: treasury, strategyAgent: strategy, maxRounds: 20 });
    const run = await engine.startNegotiation();

    expect(run.rounds.length).toBeGreaterThan(0);

    // Round numbers must increase
    for (let i = 1; i < run.rounds.length; i++) {
      expect(run.rounds[i].round).toBeGreaterThan(run.rounds[i - 1].round);
    }

    // First entry should be TREASURY OFFER
    expect(run.rounds[0].actor).toBe("TREASURY");
    expect(run.rounds[0].action).toBe("OFFER");

    // Last entry should be ACCEPT
    const last = run.rounds[run.rounds.length - 1];
    expect(last.action).toBe("ACCEPT");
  });
});

// ──────────────────────────────────────────────────────────────────────────
// TEST 5 — Event sequence: monotonically increasing, no gaps or duplicates
// ──────────────────────────────────────────────────────────────────────────
describe("NegotiationEngine - Test 5: Event sequence", () => {
  it("emits events with strictly increasing sequence numbers starting at 1", async () => {
    const { treasury, strategy } = makeConvergingAgents();
    const engine = new NegotiationEngine({ runId: "run-5", treasuryAgent: treasury, strategyAgent: strategy, maxRounds: 20 });
    const events: ProtocolEvent[] = [];
    engine.subscribe((e) => events.push(e));
    await engine.startNegotiation();

    expect(events.length).toBeGreaterThan(0);
    for (let i = 0; i < events.length; i++) {
      expect(events[i].sequence).toBe(i + 1);
    }
  });
});

// ──────────────────────────────────────────────────────────────────────────
// TEST 6 — Event ordering: NEGOTIATION_STARTED is first, NEGOTIATION_COMPLETED is last
// ──────────────────────────────────────────────────────────────────────────
describe("NegotiationEngine - Test 6: Event ordering", () => {
  it("emits NEGOTIATION_STARTED first and NEGOTIATION_COMPLETED last", async () => {
    const { treasury, strategy } = makeConvergingAgents();
    const engine = new NegotiationEngine({ runId: "run-6", treasuryAgent: treasury, strategyAgent: strategy, maxRounds: 20 });
    const events: ProtocolEvent[] = [];
    engine.subscribe((e) => events.push(e));
    await engine.startNegotiation();

    expect(events[0].type).toBe("NEGOTIATION_STARTED");
    expect(events[events.length - 1].type).toBe("NEGOTIATION_COMPLETED");

    // All offer events must come after STARTED
    const startedIdx = events.findIndex((e) => e.type === "NEGOTIATION_STARTED");
    const completedIdx = events.findIndex((e) => e.type === "NEGOTIATION_COMPLETED");
    for (const e of events.filter((e) => e.type === "OFFER_CREATED" || e.type === "COUNTER_OFFER_CREATED")) {
      const idx = events.indexOf(e);
      expect(idx).toBeGreaterThan(startedIdx);
      expect(idx).toBeLessThan(completedIdx);
    }
  });
});

// ──────────────────────────────────────────────────────────────────────────
// TEST 7 — Failure: configured agents that cannot converge → FAILED
// ──────────────────────────────────────────────────────────────────────────
describe("NegotiationEngine - Test 7: Failure path", () => {
  it("emits NEGOTIATION_FAILED and sets status FAILED when agents cannot agree", async () => {
    const { treasury, strategy } = makeFailingAgents();
    const engine = new NegotiationEngine({ runId: "run-7", treasuryAgent: treasury, strategyAgent: strategy, maxRounds: 20 });
    const events: ProtocolEvent[] = [];
    engine.subscribe((e) => events.push(e));
    const run = await engine.startNegotiation();

    expect(run.status).toBe("FAILED");
    expect(events.some((e) => e.type === "NEGOTIATION_FAILED")).toBe(true);
    expect(events.some((e) => e.type === "NEGOTIATION_COMPLETED")).toBe(false);
  });
});

// ──────────────────────────────────────────────────────────────────────────
// TEST 8 — Round limit: maxRounds prevents infinite loop
// ──────────────────────────────────────────────────────────────────────────
describe("NegotiationEngine - Test 8: Round limit enforcement", () => {
  it("terminates with FAILED when maxRounds is exceeded", async () => {
    // Give agents concession schedules long enough to never naturally converge
    // but set maxRounds=3 so the engine cuts it off
    const treasury = new TreasuryAgent({
      identity: { name: "Treasury", address: "0xtreasury", role: "PROPOSER" },
      capital: 100_000n,
      privatePolicy: { minYieldBps: 850, maxLossBps: 300, maxDuration: 30, salt: "0xsecretX" },
      targetTerms: { duration: 30, yieldBps: 900 },
      concessionSchedule: [
        { round: 3, duration: 28, yieldBps: 860 },
        { round: 5, duration: 26, yieldBps: 855 },
        { round: 7, duration: 24, yieldBps: 852 },
      ],
      signer: makeTreasurySigner(),
    });

    const strategy = new StrategyAgent({
      identity: { name: "Strategy", address: "0xstrategy", role: "COUNTERPARTY" },
      capital: 100_000n,
      privatePolicy: { maxYieldBps: 900, minDuration: 20, maxLossBps: 300, salt: "0xsecretY" },
      targetTerms: { duration: 60, yieldBps: 700 },
      concessionSchedule: [
        { round: 2, duration: 50, yieldBps: 830 },
        { round: 4, duration: 40, yieldBps: 845 },
        { round: 6, duration: 30, yieldBps: 858 },
      ],
      signer: makeStrategySigner(),
    });

    const engine = new NegotiationEngine({ runId: "run-8", treasuryAgent: treasury, strategyAgent: strategy, maxRounds: 3 });
    const run = await engine.startNegotiation();

    expect(run.status).toBe("FAILED");
    expect(run.rounds.length).toBeLessThanOrEqual(4); // sanity: didn't run forever
  });
});

// ──────────────────────────────────────────────────────────────────────────
// TEST 9 — Private policy leakage: NO private fields in any emitted event
// ──────────────────────────────────────────────────────────────────────────
describe("NegotiationEngine - Test 9: No private policy leakage", () => {
  it("never includes private policy fields in any emitted event payload", async () => {
    const FORBIDDEN = ["minYieldBps", "maxLossBps", "maxDuration", "maxYieldBps", "minDuration", "salt", "privatePolicy", "0xsecret"];

    const { treasury, strategy } = makeConvergingAgents();
    const engine = new NegotiationEngine({ runId: "run-9", treasuryAgent: treasury, strategyAgent: strategy, maxRounds: 20 });
    const events: ProtocolEvent[] = [];
    engine.subscribe((e) => events.push(e));
    await engine.startNegotiation();

    const bigintReplacer = (_: string, v: unknown) => (typeof v === "bigint" ? v.toString() : v);
    const serialized = JSON.stringify(events, bigintReplacer);
    for (const forbidden of FORBIDDEN) {
      expect(serialized, `Event payloads must not contain "${forbidden}"`).not.toContain(forbidden);
    }
  });
});

// ──────────────────────────────────────────────────────────────────────────
// TEST 10 — Subscriber isolation: two listeners both receive all events
// ──────────────────────────────────────────────────────────────────────────
describe("NegotiationEngine - Test 10: Subscriber isolation", () => {
  it("delivers all events to both subscribers independently", async () => {
    const { treasury, strategy } = makeConvergingAgents();
    const engine = new NegotiationEngine({ runId: "run-10", treasuryAgent: treasury, strategyAgent: strategy, maxRounds: 20 });

    const eventsA: ProtocolEvent[] = [];
    const eventsB: ProtocolEvent[] = [];

    engine.subscribe((e) => eventsA.push(e));
    engine.subscribe((e) => eventsB.push(e));

    await engine.startNegotiation();

    // Both should have received every event
    expect(eventsA.length).toBeGreaterThan(0);
    expect(eventsB.length).toBe(eventsA.length);
    expect(eventsA.map((e) => e.sequence)).toStrictEqual(eventsB.map((e) => e.sequence));
    expect(eventsA.map((e) => e.type)).toStrictEqual(eventsB.map((e) => e.type));
  });

  it("removing one subscriber does not affect the other", async () => {
    const { treasury, strategy } = makeConvergingAgents();
    const engine = new NegotiationEngine({ runId: "run-10b", treasuryAgent: treasury, strategyAgent: strategy, maxRounds: 20 });

    const eventsA: ProtocolEvent[] = [];
    const eventsB: ProtocolEvent[] = [];

    const unsubscribeA = engine.subscribe((e) => eventsA.push(e));
    engine.subscribe((e) => eventsB.push(e));

    // Remove subscriber A before negotiation starts
    unsubscribeA();

    await engine.startNegotiation();

    expect(eventsA.length).toBe(0);        // A received nothing
    expect(eventsB.length).toBeGreaterThan(0); // B still received all events
  });
});

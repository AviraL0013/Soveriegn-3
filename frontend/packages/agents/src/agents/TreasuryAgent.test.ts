import { describe, it, expect, vi } from "vitest";
import { TreasuryAgent } from "./TreasuryAgent.js";
import type { Offer, PrivatePolicy, AgentIdentity, OfferSigner } from "../domain/types.js";

const mockSigner: OfferSigner = {
  signOffer: async (offer: Offer) => ({
    ...offer,
    signature: "0xmock_signature",
    signerAddress: "0xalice",
  }),
};

const identity: AgentIdentity = {
  name: "TreasuryAgent",
  address: "0xalice",
  role: "PROPOSER",
};

const privatePolicy: PrivatePolicy = {
  minYieldBps: 800,
  maxLossBps: 300,
  maxDuration: 30, // 30 days
  salt: "0xsecret_salt",
};

const targetTerms = {
  duration: 30,
  yieldBps: 900,
};

const concessionSchedule = [
  { round: 3, duration: 27, yieldBps: 850 },
  { round: 5, duration: 25, yieldBps: 820 },
];

describe("TreasuryAgent", () => {
  it("generates deterministic initial offer", async () => {
    // Freeze time to ensure deterministic test runs if using Date.now()
    const now = Date.now();
    vi.useFakeTimers();
    vi.setSystemTime(now);

    const agent = new TreasuryAgent({
      identity,
      capital: 100000n,
      privatePolicy,
      targetTerms,
      concessionSchedule,
      signer: mockSigner,
    });

    const offer = await agent.createInitialOffer("run-1");
    expect(offer.round).toBe(1);
    expect(offer.proposer).toBe("TREASURY");
    expect(offer.capital).toBe(100000n);
    expect(offer.duration).toBe(30);
    expect(offer.yieldBps).toBe(900);
    expect(offer.signature).toBe("0xmock_signature");
    expect(offer.nonce).toBe(1n);

    // Calling it again on a fresh agent with same input should yield identical logical terms
    const agent2 = new TreasuryAgent({
      identity,
      capital: 100000n,
      privatePolicy,
      targetTerms,
      concessionSchedule,
      signer: mockSigner,
    });
    const offer2 = await agent2.createInitialOffer("run-1");
    expect(offer).toStrictEqual(offer2);

    vi.useRealTimers();
  });

  it("evaluates counter-offer correctly and yields expected deterministic response", () => {
    const agent = new TreasuryAgent({
      identity,
      capital: 100000n,
      privatePolicy,
      targetTerms,
      concessionSchedule,
      signer: mockSigner,
    });

    // Strategy offers exactly our target terms
    const targetMatchOffer: Offer = {
      runId: "run-1",
      round: 2,
      proposer: "STRATEGY",
      capital: 100000n,
      duration: 30,
      yieldBps: 900,
      expiresAt: Date.now() + 10000,
      nonce: 1n,
    };
    expect(agent.evaluateCounterOffer(targetMatchOffer)).toBe("ACCEPT");

    // Strategy offers terrible terms that violate policy, and we have concessions for round 3
    const terribleOffer: Offer = {
      ...targetMatchOffer,
      duration: 60, // way over 30 days
      yieldBps: 700, // way under 800
    };
    expect(agent.evaluateCounterOffer(terribleOffer)).toBe("COUNTER"); // Since we have round 3 concession

    // Strategy offers something we can accept because it's better than our next concession
    const okayOffer: Offer = {
      ...targetMatchOffer,
      duration: 26, // better than our 27 concession
      yieldBps: 880, // better than our 850 concession
    };
    expect(agent.evaluateCounterOffer(okayOffer)).toBe("ACCEPT");

    // Strategy offers something worse than our next concession, so we counter
    const worseOffer: Offer = {
      ...targetMatchOffer,
      duration: 28, // worse than 27
      yieldBps: 830, // worse than 850
    };
    expect(agent.evaluateCounterOffer(worseOffer)).toBe("COUNTER");
  });

  it("generates deterministic concession offer", async () => {
    const agent = new TreasuryAgent({
      identity,
      capital: 100000n,
      privatePolicy,
      targetTerms,
      concessionSchedule,
      signer: mockSigner,
    });

    // Assuming strategy replied in round 2, we concede in round 3
    const offer = await agent.createCounterOffer("run-1", 2);
    expect(offer.round).toBe(3);
    expect(offer.duration).toBe(27);
    expect(offer.yieldBps).toBe(850);
  });

  it("rejects invalid counter-offers", () => {
    const agent = new TreasuryAgent({
      identity,
      capital: 100000n,
      privatePolicy,
      targetTerms,
      concessionSchedule,
      signer: mockSigner,
    });

    const malformedOffer: Offer = {
      runId: "run-1",
      round: 2,
      proposer: "TREASURY", // Invalid, should be STRATEGY
      capital: 100000n,
      duration: 30,
      yieldBps: 900,
      expiresAt: Date.now() + 10000,
      nonce: 1n,
    };

    expect(() => agent.evaluateCounterOffer(malformedOffer)).toThrow();

    const capitalMismatchOffer: Offer = {
      ...malformedOffer,
      proposer: "STRATEGY",
      capital: 50000n,
    };
    expect(agent.evaluateCounterOffer(capitalMismatchOffer)).toBe("REJECT");
  });

  it("does NOT leak private policy when serialized", () => {
    const agent = new TreasuryAgent({
      identity,
      capital: 100000n,
      privatePolicy,
      targetTerms,
      concessionSchedule,
      signer: mockSigner,
    });

    const serialized = JSON.stringify(agent);
    
    // Ensure the private policy values are NOT in the JSON string
    expect(serialized).not.toContain("secret_salt");
    expect(serialized).not.toContain("minYieldBps");
    expect(serialized).not.toContain("maxLossBps");
  });
});

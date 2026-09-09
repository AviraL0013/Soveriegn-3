import { describe, it, expect, vi } from "vitest";
import { StrategyAgent } from "./StrategyAgent.js";
import type { Offer, StrategyPrivatePolicy, AgentIdentity, OfferSigner } from "../domain/types.js";

const mockSigner: OfferSigner = {
  signOffer: async (offer: Offer) => ({
    ...offer,
    signature: "0xmock_signature",
    signerAddress: "0xbob",
  }),
};

const identity: AgentIdentity = {
  name: "StrategyAgent",
  address: "0xbob",
  role: "COUNTERPARTY",
};

const privatePolicy: StrategyPrivatePolicy = {
  maxYieldBps: 900,
  minDuration: 30, // 30 days
  maxLossBps: 300,
  salt: "0xsecret_salt",
};

const targetTerms = {
  duration: 90,
  yieldBps: 700,
};

const concessionSchedule = [
  { round: 2, duration: 60, yieldBps: 750 },
  { round: 4, duration: 45, yieldBps: 800 },
];

describe("StrategyAgent", () => {
  it("evaluates counter-offer correctly and yields expected deterministic response", () => {
    const agent = new StrategyAgent({
      identity,
      capital: 100000n,
      privatePolicy,
      targetTerms,
      concessionSchedule,
      signer: mockSigner,
    });

    // Treasury offers exactly our target terms (very rare, but possible)
    const targetMatchOffer: Offer = {
      runId: "run-1",
      round: 1,
      proposer: "TREASURY",
      capital: 100000n,
      duration: 90,
      yieldBps: 700,
      expiresAt: Date.now() + 10000,
      nonce: 1n,
    };
    expect(agent.evaluateCounterOffer(targetMatchOffer)).toBe("ACCEPT");

    // Treasury offers terrible terms that violate policy (e.g., 20 days, 1000 bps)
    const terribleOffer: Offer = {
      ...targetMatchOffer,
      duration: 20, // under 30 days
      yieldBps: 1000, // over 900
    };
    // We have concessions for round 2, so we counter
    expect(agent.evaluateCounterOffer(terribleOffer)).toBe("COUNTER");

    // Let's exhaust concessions by sending a round 5 offer
    const lateOffer: Offer = {
      ...terribleOffer,
      round: 5,
    };
    // No concession available for round 6, so we reject
    expect(agent.evaluateCounterOffer(lateOffer)).toBe("REJECT");

    // Treasury offers something we can accept because it's better than our next concession
    // Next concession (round 2) is 60 duration, 750 yield
    const okayOffer: Offer = {
      ...targetMatchOffer,
      duration: 70, // better than our 60 concession
      yieldBps: 720, // better than our 750 concession
    };
    expect(agent.evaluateCounterOffer(okayOffer)).toBe("ACCEPT");

    // Treasury offers something worse than our next concession, so we counter
    const worseOffer: Offer = {
      ...targetMatchOffer,
      duration: 50, // worse than 60
      yieldBps: 780, // worse than 750
    };
    expect(agent.evaluateCounterOffer(worseOffer)).toBe("COUNTER");
  });

  it("generates deterministic concession offer", async () => {
    const agent = new StrategyAgent({
      identity,
      capital: 100000n,
      privatePolicy,
      targetTerms,
      concessionSchedule,
      signer: mockSigner,
    });

    // Treasury proposed in round 1, we concede in round 2
    const offer = await agent.createCounterOffer("run-1", 1);
    expect(offer.round).toBe(2);
    expect(offer.proposer).toBe("STRATEGY");
    expect(offer.duration).toBe(60);
    expect(offer.yieldBps).toBe(750);
  });

  it("rejects invalid counter-offers", () => {
    const agent = new StrategyAgent({
      identity,
      capital: 100000n,
      privatePolicy,
      targetTerms,
      concessionSchedule,
      signer: mockSigner,
    });

    const malformedOffer: Offer = {
      runId: "run-1",
      round: 1,
      proposer: "STRATEGY", // Invalid, should be TREASURY
      capital: 100000n,
      duration: 30,
      yieldBps: 900,
      expiresAt: Date.now() + 10000,
      nonce: 1n,
    };

    expect(() => agent.evaluateCounterOffer(malformedOffer)).toThrow();

    const capitalMismatchOffer: Offer = {
      ...malformedOffer,
      proposer: "TREASURY",
      capital: 50000n,
    };
    expect(agent.evaluateCounterOffer(capitalMismatchOffer)).toBe("REJECT");
  });

  it("does NOT leak private policy when serialized", () => {
    const agent = new StrategyAgent({
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
    expect(serialized).not.toContain("maxYieldBps");
    expect(serialized).not.toContain("maxLossBps");
  });
});

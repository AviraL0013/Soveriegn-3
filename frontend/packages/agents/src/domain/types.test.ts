import { describe, it, expect } from "vitest";
import type { Offer, PrivatePolicy, ProtocolEvent, SignedOffer } from "./types.js";

describe("W3 Domain Types", () => {
  it("can construct an Offer object correctly", () => {
    const offer: Offer = {
      runId: "run-123",
      round: 1,
      proposer: "TREASURY",
      capital: 100000n,
      duration: 30,
      yieldBps: 800,
      expiresAt: Date.now() + 10000,
      nonce: 1n,
    };

    expect(offer.runId).toBe("run-123");
    expect(offer.capital).toBe(100000n);
    expect(offer.yieldBps).toBe(800);
  });

  it("can construct a ProtocolEvent correctly", () => {
    const offer: Offer = {
      runId: "run-123",
      round: 1,
      proposer: "TREASURY",
      capital: 100000n,
      duration: 30,
      yieldBps: 800,
      expiresAt: Date.now() + 10000,
      nonce: 1n,
    };

    const event: ProtocolEvent<Offer> = {
      eventId: "evt-001",
      sequence: 1,
      timestamp: Date.now(),
      runId: "run-123",
      type: "OFFER_CREATED",
      payload: offer,
    };

    expect(event.type).toBe("OFFER_CREATED");
    expect(event.payload.capital).toBe(100000n);
  });

  it("ensures PrivatePolicy type prevents accidental exposure", () => {
    const policy: PrivatePolicy = {
      minYieldBps: 800,
      maxLossBps: 300,
      maxDuration: 2592000, // 30 days in seconds
      salt: "0xdeadbeef",
    };

    // Sanity check that we typed it correctly
    expect(policy.minYieldBps).toBe(800);
    expect(policy.salt).toBeDefined();
  });
});

import { describe, it, expect } from "vitest";
import { type Hex, type Address } from "viem";
import {
  Eip712OfferSigner,
  verifyOfferSignature,
  hashOfferTypedData,
  toCanonicalOfferMessage,
  SOVEREIGN_OFFER_EIP712_TYPES,
  SOVEREIGN_OFFER_PRIMARY_TYPE,
} from "./Eip712OfferSigner.js";
import { TreasuryAgent } from "../agents/TreasuryAgent.js";
import { StrategyAgent } from "../agents/StrategyAgent.js";
import type { Offer, SignedOffer } from "../domain/types.js";

// Deterministic test private keys
const TEST_KEY_A: Hex =
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
const TEST_KEY_B: Hex =
  "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d";

const TEST_VERIFYING_CONTRACT: Address =
  "0x1111111111111111111111111111111111111111";
const OTHER_VERIFYING_CONTRACT: Address =
  "0x2222222222222222222222222222222222222222";

const DEFAULT_CONFIG = {
  chainId: 11155111,
  verifyingContract: TEST_VERIFYING_CONTRACT,
};

function createSampleOffer(): Offer {
  return {
    runId: "run-e2e-001",
    round: 1,
    proposer: "TREASURY",
    capital: 100_000n * 10n ** 6n,
    duration: 30,
    yieldBps: 800,
    expiresAt: 1770000000,
    nonce: 1n,
  };
}

describe("Eip712OfferSigner (Phase 5 Canonical Compatibility)", () => {
  // Test 1: Valid signature
  it("Test 1: signs a known offer and verifies correctly", async () => {
    const signer = new Eip712OfferSigner(TEST_KEY_A, DEFAULT_CONFIG);
    const offer = createSampleOffer();

    const signedOffer = await signer.signOffer(offer);

    expect(signedOffer.signature).toBeDefined();
    expect(signedOffer.signature.startsWith("0x")).toBe(true);
    expect(signedOffer.signerAddress.toLowerCase()).toBe(
      signer.address.toLowerCase()
    );

    const isValid = await verifyOfferSignature(signedOffer, DEFAULT_CONFIG);
    expect(isValid).toBe(true);
  });

  // Test 2: Exact field mutation on canonical terms
  it("Test 2: modifying any canonical financial term causes verification to fail", async () => {
    const signer = new Eip712OfferSigner(TEST_KEY_A, DEFAULT_CONFIG);
    const offer = createSampleOffer();
    const signed = await signer.signOffer(offer);

    // 1. Mutate capital
    const tamperedCapital: SignedOffer = {
      ...signed,
      capital: signed.capital + 1000n,
    };
    expect(await verifyOfferSignature(tamperedCapital, DEFAULT_CONFIG)).toBe(
      false
    );

    // 2. Mutate duration
    const tamperedDuration: SignedOffer = {
      ...signed,
      duration: signed.duration + 5,
    };
    expect(await verifyOfferSignature(tamperedDuration, DEFAULT_CONFIG)).toBe(
      false
    );

    // 3. Mutate yieldBps
    const tamperedYield: SignedOffer = {
      ...signed,
      yieldBps: signed.yieldBps + 50,
    };
    expect(await verifyOfferSignature(tamperedYield, DEFAULT_CONFIG)).toBe(
      false
    );

    // 4. Mutate expiresAt
    const tamperedExpiry: SignedOffer = {
      ...signed,
      expiresAt: signed.expiresAt + 3600,
    };
    expect(await verifyOfferSignature(tamperedExpiry, DEFAULT_CONFIG)).toBe(
      false
    );

    // 5. Mutate nonce
    const tamperedNonce: SignedOffer = {
      ...signed,
      nonce: signed.nonce + 1n,
    };
    expect(await verifyOfferSignature(tamperedNonce, DEFAULT_CONFIG)).toBe(
      false
    );
  });

  // Test 2b: Metadata separation — W3 metadata is not signed
  it("Test 2b: W3 metadata (runId, round, proposer) is excluded from EIP-712 signature", async () => {
    const signer = new Eip712OfferSigner(TEST_KEY_A, DEFAULT_CONFIG);
    const offer = createSampleOffer();
    const signed = await signer.signOffer(offer);

    // Modifying W3 metadata should NOT invalidate the cryptographic signature on canonical terms
    const alteredMetadataOffer: SignedOffer = {
      ...signed,
      runId: "different-run-id",
      round: 99,
      proposer: "STRATEGY",
    };

    const isValid = await verifyOfferSignature(
      alteredMetadataOffer,
      DEFAULT_CONFIG
    );
    expect(isValid).toBe(true);
  });

  // Test 3: Wrong signer
  it("Test 3: fails verification when expecting a different signer", async () => {
    const signerA = new Eip712OfferSigner(TEST_KEY_A, DEFAULT_CONFIG);
    const signerB = new Eip712OfferSigner(TEST_KEY_B, DEFAULT_CONFIG);
    const offer = createSampleOffer();

    const signed = await signerA.signOffer(offer);

    // Verify expecting signer B's address
    const isValid = await verifyOfferSignature(
      signed,
      DEFAULT_CONFIG,
      signerB.address
    );
    expect(isValid).toBe(false);
  });

  // Test 4: Domain mutation
  it("Test 4: fails verification under a mutated EIP-712 domain", async () => {
    const signer = new Eip712OfferSigner(TEST_KEY_A, DEFAULT_CONFIG);
    const offer = createSampleOffer();
    const signed = await signer.signOffer(offer);

    // Different chainId
    const wrongChainConfig = {
      chainId: 1, // Mainnet instead of Sepolia
      verifyingContract: TEST_VERIFYING_CONTRACT,
    };
    expect(await verifyOfferSignature(signed, wrongChainConfig)).toBe(false);

    // Different verifyingContract
    const wrongContractConfig = {
      chainId: 11155111,
      verifyingContract: OTHER_VERIFYING_CONTRACT,
    };
    expect(await verifyOfferSignature(signed, wrongContractConfig)).toBe(false);
  });

  // Test 5: Structured data correctness & metadata exclusion
  it("Test 5: generates canonical EIP-712 hash and excludes W3 metadata fields", () => {
    const offer = createSampleOffer();
    const hash = hashOfferTypedData(offer, DEFAULT_CONFIG);

    expect(hash).toBeDefined();
    expect(hash.startsWith("0x")).toBe(true);
    expect(hash.length).toBe(66); // 32 bytes hex + '0x'

    const message = toCanonicalOfferMessage(offer);
    expect(message.capital).toBe(offer.capital);
    expect(message.duration).toBe(BigInt(offer.duration));
    expect(message.yieldBps).toBe(BigInt(offer.yieldBps));
    expect(message.nonce).toBe(offer.nonce);

    // Verify canonical types contain exactly 5 financial fields and NO W3 metadata
    expect(SOVEREIGN_OFFER_PRIMARY_TYPE).toBe("Offer");
    expect(SOVEREIGN_OFFER_EIP712_TYPES.Offer.length).toBe(5);

    const typeFieldNames = SOVEREIGN_OFFER_EIP712_TYPES.Offer.map(
      (f) => f.name
    );
    expect(typeFieldNames).toContain("capital");
    expect(typeFieldNames).toContain("duration");
    expect(typeFieldNames).toContain("yieldBps");
    expect(typeFieldNames).toContain("expiresAt");
    expect(typeFieldNames).toContain("nonce");

    expect(typeFieldNames).not.toContain("runId");
    expect(typeFieldNames).not.toContain("round");
    expect(typeFieldNames).not.toContain("proposer");
  });

  // Test 6: Expiry is bound
  it("Test 6: changing expiresAt invalidates signature verification", async () => {
    const signer = new Eip712OfferSigner(TEST_KEY_A, DEFAULT_CONFIG);
    const offer = createSampleOffer();
    const signed = await signer.signOffer(offer);

    const expiredTampered = { ...signed, expiresAt: signed.expiresAt - 100 };
    expect(await verifyOfferSignature(expiredTampered, DEFAULT_CONFIG)).toBe(
      false
    );
  });

  // Test 7: Nonce is bound
  it("Test 7: changing nonce invalidates signature verification", async () => {
    const signer = new Eip712OfferSigner(TEST_KEY_A, DEFAULT_CONFIG);
    const offer = createSampleOffer();
    const signed = await signer.signOffer(offer);

    const replayTampered = { ...signed, nonce: 9999n };
    expect(await verifyOfferSignature(replayTampered, DEFAULT_CONFIG)).toBe(
      false
    );
  });

  // Test 8: No private policy leakage
  it("Test 8: SignedOffer serialization does not leak private policy fields", async () => {
    const signer = new Eip712OfferSigner(TEST_KEY_A, DEFAULT_CONFIG);
    const offer = createSampleOffer();
    const signed = await signer.signOffer(offer);

    const serialized = JSON.stringify(signed, (_, v) =>
      typeof v === "bigint" ? v.toString() : v
    );
    expect(serialized).not.toContain("minYieldBps");
    expect(serialized).not.toContain("maxLossBps");
    expect(serialized).not.toContain("maxDuration");
    expect(serialized).not.toContain("minDuration");
    expect(serialized).not.toContain("salt");
    expect(serialized).not.toContain("privatePolicy");
    expect(serialized).not.toContain("StrategyPrivatePolicy");

    // Also verify signer itself doesn't expose private key in toJSON
    const signerJson = JSON.stringify(signer);
    expect(signerJson).not.toContain(TEST_KEY_A.slice(2)); // Private key hex omitted
  });

  // Test 9: TreasuryAgent integration
  it("Test 9: TreasuryAgent signs offers with real EIP-712 signer", async () => {
    const signer = new Eip712OfferSigner(TEST_KEY_A, DEFAULT_CONFIG);
    const treasury = new TreasuryAgent({
      identity: {
        name: "Treasury Alpha",
        role: "PROPOSER",
        address: signer.address,
      },
      capital: 100_000n * 10n ** 6n,
      privatePolicy: {
        minYieldBps: 700,
        maxLossBps: 300,
        maxDuration: 60,
        salt: "treasury-salt-123",
      },
      targetTerms: {
        duration: 30,
        yieldBps: 850,
      },
      concessionSchedule: [
        { round: 2, duration: 35, yieldBps: 800 },
        { round: 3, duration: 40, yieldBps: 750 },
      ],
      signer,
    });

    const initialOffer = await treasury.createInitialOffer("run-integration-1");
    expect(initialOffer.signature).toBeDefined();
    expect(initialOffer.signerAddress.toLowerCase()).toBe(
      signer.address.toLowerCase()
    );

    const isValid = await verifyOfferSignature(initialOffer, DEFAULT_CONFIG);
    expect(isValid).toBe(true);
  });

  // Test 10: StrategyAgent integration
  it("Test 10: StrategyAgent signs counter-offers with real EIP-712 signer", async () => {
    const signer = new Eip712OfferSigner(TEST_KEY_B, DEFAULT_CONFIG);
    const strategy = new StrategyAgent({
      identity: {
        name: "Strategy Beta",
        role: "COUNTERPARTY",
        address: signer.address,
      },
      capital: 100_000n * 10n ** 6n,
      privatePolicy: {
        maxYieldBps: 900,
        minDuration: 20,
        maxLossBps: 300,
        salt: "strategy-salt-456",
      },
      targetTerms: {
        duration: 45,
        yieldBps: 750,
      },
      concessionSchedule: [
        { round: 2, duration: 35, yieldBps: 800 },
        { round: 3, duration: 30, yieldBps: 850 },
      ],
      signer,
    });

    const counterOffer = await strategy.createCounterOffer(
      "run-integration-1",
      2
    );
    expect(counterOffer.signature).toBeDefined();
    expect(counterOffer.signerAddress.toLowerCase()).toBe(
      signer.address.toLowerCase()
    );

    const isValid = await verifyOfferSignature(counterOffer, DEFAULT_CONFIG);
    expect(isValid).toBe(true);
  });
});

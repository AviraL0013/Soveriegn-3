import {
  type Address,
  type Hex,
  hashTypedData,
  recoverTypedDataAddress,
} from "viem";
import { privateKeyToAccount, type PrivateKeyAccount } from "viem/accounts";
import type {
  Offer,
  SignedOffer,
  OfferSigner,
  CanonicalOfferTerms,
} from "../domain/types.js";

export const SOVEREIGN_OFFER_PRIMARY_TYPE = "Offer" as const;

/**
 * Canonical Sovereign Offer EIP-712 types.
 * Binds purely financial agreement terms (capital, duration, yieldBps, expiresAt, nonce).
 * Ephemeral W3 negotiation metadata (runId, round, proposer) are deliberately excluded
 * so that on-chain W1 verification remains decoupled from off-chain negotiation rounds.
 */
export const SOVEREIGN_OFFER_EIP712_TYPES = {
  Offer: [
    { name: "capital", type: "uint256" },
    { name: "duration", type: "uint256" },
    { name: "yieldBps", type: "uint256" },
    { name: "expiresAt", type: "uint256" },
    { name: "nonce", type: "uint256" },
  ],
} as const;

export interface Eip712DomainConfig {
  name?: string;
  version?: string;
  chainId?: number;
  verifyingContract: Address;
}

/**
 * Adapter: Extracts canonical financial terms from a negotiation offer or canonical terms object.
 * Strips W3 metadata (runId, round, proposer) before passing to EIP-712 signing/hashing.
 */
export function toCanonicalOfferMessage(offer: CanonicalOfferTerms) {
  return {
    capital: offer.capital,
    duration: BigInt(offer.duration),
    yieldBps: BigInt(offer.yieldBps),
    expiresAt: BigInt(offer.expiresAt),
    nonce: offer.nonce,
  };
}

// Backward compatibility alias for existing consumers
export const toEip712OfferMessage = toCanonicalOfferMessage;

/**
 * Concrete implementation of OfferSigner producing canonical EIP-712 signatures.
 * Keys are held strictly in private ECMAScript fields (#account) and never exposed or serialized.
 */
export class Eip712OfferSigner implements OfferSigner {
  readonly #account: PrivateKeyAccount;
  readonly #domain: {
    name: string;
    version: string;
    chainId: number;
    verifyingContract: Address;
  };

  constructor(
    signingKey: Hex | PrivateKeyAccount,
    domainConfig: Eip712DomainConfig
  ) {
    this.#account =
      typeof signingKey === "string"
        ? privateKeyToAccount(signingKey)
        : signingKey;

    this.#domain = {
      name: domainConfig.name ?? "Sovereign",
      version: domainConfig.version ?? "1",
      chainId: domainConfig.chainId ?? 11155111,
      verifyingContract: domainConfig.verifyingContract,
    };
  }

  get address(): Address {
    return this.#account.address;
  }

  get domain() {
    return { ...this.#domain };
  }

  async signOffer(offer: Offer): Promise<SignedOffer> {
    const message = toCanonicalOfferMessage(offer);

    const signature = await this.#account.signTypedData({
      domain: this.#domain,
      types: SOVEREIGN_OFFER_EIP712_TYPES,
      primaryType: SOVEREIGN_OFFER_PRIMARY_TYPE,
      message,
    });

    return {
      runId: offer.runId,
      round: offer.round,
      proposer: offer.proposer,
      capital: offer.capital,
      duration: offer.duration,
      yieldBps: offer.yieldBps,
      expiresAt: offer.expiresAt,
      nonce: offer.nonce,
      signature,
      signerAddress: this.#account.address,
    };
  }

  toJSON() {
    return {
      address: this.#account.address,
      domain: this.#domain,
    };
  }
}

/**
 * Recovers signer address and validates the signature against the canonical EIP-712 typed data envelope.
 */
export async function verifyOfferSignature(
  signedOffer: SignedOffer,
  domainConfig: Eip712DomainConfig,
  expectedSigner?: Address
): Promise<boolean> {
  try {
    const domain = {
      name: domainConfig.name ?? "Sovereign",
      version: domainConfig.version ?? "1",
      chainId: domainConfig.chainId ?? 11155111,
      verifyingContract: domainConfig.verifyingContract,
    };

    const message = toCanonicalOfferMessage(signedOffer);

    const recovered = await recoverTypedDataAddress({
      domain,
      types: SOVEREIGN_OFFER_EIP712_TYPES,
      primaryType: SOVEREIGN_OFFER_PRIMARY_TYPE,
      message,
      signature: signedOffer.signature as Hex,
    });

    const targetSigner = expectedSigner ?? (signedOffer.signerAddress as Address);
    if (!targetSigner) return false;

    return recovered.toLowerCase() === targetSigner.toLowerCase();
  } catch {
    return false;
  }
}

/**
 * Computes canonical EIP-712 struct hash for an Offer under the Sovereign domain.
 */
export function hashOfferTypedData(
  offer: CanonicalOfferTerms,
  domainConfig: Eip712DomainConfig
): Hex {
  const domain = {
    name: domainConfig.name ?? "Sovereign",
    version: domainConfig.version ?? "1",
    chainId: domainConfig.chainId ?? 11155111,
    verifyingContract: domainConfig.verifyingContract,
  };

  const message = toCanonicalOfferMessage(offer);

  return hashTypedData({
    domain,
    types: SOVEREIGN_OFFER_EIP712_TYPES,
    primaryType: SOVEREIGN_OFFER_PRIMARY_TYPE,
    message,
  });
}

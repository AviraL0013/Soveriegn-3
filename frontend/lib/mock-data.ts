// ============================================================
// SOVEREIGN PROTOCOL — ALL MOCK DATA
// ============================================================

export const MOCK_WALLET = "0x4F92...B9AC";
export const MOCK_BLOCK = "#19,482,104";

// ─── AGREEMENTS ─────────────────────────────────────────────
export const AGREEMENTS = [
  {
    id: "SOV-8F29",
    type: "COLLATERALIZED LOAN",
    status: "ACTIVE" as const,
    partyA: {
      name: "treasury.sovereign.eth",
      address: "0x82a9...91fd",
      role: "Lender & Vault",
      delegationCap: "$500,000 USDC",
      policyStatus: "SIGNER VERIFIED",
    },
    partyB: {
      name: "strategy.sovereign.eth",
      address: "0x51d2...87ab",
      role: "Strategy Execution",
      strategyHash: "#90FA",
      policyStatus: "SIGNER VERIFIED",
    },
    principal: 100000,
    principalAsset: "USDC",
    yield: 8.4,
    duration: 25,
    expiryDate: "12 Nov 2025",
    riskScore: 1.8,
    riskStatus: "SAFE" as const,
    ltv: 45.2,
    collateralRatio: 142.5,
    liquidationBarrier: 78400,
    escrowChannel: "sov-escrow-main-4",
    settlementContract: "0x981F...00DC",
    termsHash: "0x8f29ea100b9ca72cf017c6e00b84912903fe92",
    policyCommitment: "0x71c4801fbde9e11504936d8193aef49204bc99",
    arcEscrowStatus: "LOCKED",
    createdAt: "10 mins ago",
    updatedAt: "30s ago",
    maturityBlock: "#19,542,000",
    lifecyclePhase: 5, // 1=INTENT, 2=NEGOTIATION, 3=VALIDATION, 4=ESCROW, 5=ACTIVE, 6=BREACH, 7=UNWIND
    sigRoot: "0x6A19...9DF0",
    maxGas: "42.0 GWEI",
    blockExpiry: "#19,510,000",
    zkProofSystem: "SNARK PLONK",
  },
  {
    id: "SOV-7B14",
    type: "YIELD VAULT SYNDICATE",
    status: "SETTLED" as const,
    partyA: {
      name: "alice.sovereign.eth",
      address: "0x82a9...91fd",
      role: "Lender",
      delegationCap: "$500,000 USDC",
      policyStatus: "SIGNER VERIFIED",
    },
    partyB: {
      name: "yield-v2.sovereign.eth",
      address: "0x29b1...cc44",
      role: "Automated Pool Settler",
      strategyHash: "#44AB",
      policyStatus: "SIGNER VERIFIED",
    },
    principal: 250000,
    principalAsset: "USDC",
    yield: 7.2,
    duration: 60,
    expiryDate: "14 Oct 2025",
    riskScore: 0.0,
    riskStatus: "CLOSED" as const,
    ltv: 0,
    collateralRatio: 0,
    liquidationBarrier: 0,
    escrowChannel: "sov-escrow-v2-1",
    settlementContract: "0x7b14...22FA",
    termsHash: "0x7b14ea200c9da61cf117d7f00a84912903fe44",
    policyCommitment: "0x8ab1901caef49204bc77",
    arcEscrowStatus: "RELEASED",
    createdAt: "14d ago",
    updatedAt: "14d ago",
    maturityBlock: "#19,280,000",
    lifecyclePhase: 7,
    sigRoot: "0x9B22...4AB0",
    maxGas: "38.0 GWEI",
    blockExpiry: "#19,290,000",
    zkProofSystem: "PLONK",
  },
  {
    id: "SOV-6A02",
    type: "ARBITRAGE LIQUIDITY",
    status: "UNWOUND" as const,
    partyA: {
      name: "alice.sovereign.eth",
      address: "0x82a9...91fd",
      role: "Lender",
      delegationCap: "$500,000 USDC",
      policyStatus: "SIGNER VERIFIED",
    },
    partyB: {
      name: "delta-neutral.eth",
      address: "0x9a3c...11fe",
      role: "Strategy Execution",
      strategyHash: "#02BC",
      policyStatus: "SIGNER VERIFIED",
    },
    principal: 150000,
    principalAsset: "USDC",
    yield: 9.1,
    duration: 90,
    expiryDate: "Unwound (Day 12)",
    riskScore: 3.1,
    riskStatus: "BREACH" as const,
    ltv: 0,
    collateralRatio: 0,
    liquidationBarrier: 0,
    escrowChannel: "sov-escrow-main-1",
    settlementContract: "0x6a02...87CC",
    termsHash: "0x6a02ea300b9bb71cf117c6e00b84912903fe01",
    policyCommitment: "0x9cc1801fbde9e11504736d",
    arcEscrowStatus: "UNWOUND",
    createdAt: "42d ago",
    updatedAt: "42d ago",
    maturityBlock: "#18,900,000",
    lifecyclePhase: 7,
    sigRoot: "0x3F88...0AB1",
    maxGas: "55.0 GWEI",
    blockExpiry: "#18,920,000",
    zkProofSystem: "SNARK PLONK",
  },
];

// ─── NEGOTIATION ROUNDS ──────────────────────────────────────
export const NEGOTIATION_ROUNDS = [
  {
    round: 1,
    actor: "TREASURY AGENT",
    actorAddress: "alice.sovereign.eth",
    action: "OFFER",
    timestamp: "12:38:10 UTC",
    txHash: "0xaa91...38bc",
    capital: 100000,
    duration: 30,
    yield: 8.0,
    rationale:
      "Benchmark risk-free baseline allocation rate with 30-day liquidity horizon constraint.",
    sigStatus: "VERIFIED",
    signature: "0x4a12...88f1",
  },
  {
    round: 2,
    actor: "STRATEGY AGENT",
    actorAddress: "bob.sovereign.eth",
    action: "COUNTER-OFFER",
    timestamp: "12:38:42 UTC",
    txHash: "0x77c2...51da",
    capital: 100000,
    duration: 30,
    yield: 8.8,
    rationale:
      "Premium yield based on active Arbitrum-L1 settlement corridor efficiency.",
    sigStatus: "VERIFIED",
    signature: "0x992b...e041",
  },
  {
    round: 3,
    actor: "TREASURY AGENT",
    actorAddress: "alice.sovereign.eth",
    action: "COUNTER-OFFER",
    timestamp: "12:39:15 UTC",
    txHash: "0x62e4...119c",
    capital: 100000,
    duration: 25,
    yield: 8.4,
    rationale:
      "Duration compression required to meet quarterly portfolio liquidity requirement.",
    sigStatus: "VERIFIED",
    signature: "0x12c8...7710",
  },
  {
    round: 4,
    actor: "STRATEGY AGENT",
    actorAddress: "bob.sovereign.eth",
    action: "ACCEPTANCE",
    timestamp: "12:39:48 UTC",
    txHash: "0x992b...e041",
    capital: 100000,
    duration: 25,
    yield: 8.4,
    rationale: "Convergence reached. Mutual economic bounds satisfied.",
    sigStatus: "CONVERGED & SIGNED",
    signature: "0x77ae...991a",
  },
];

// RISK_STEPS represents the simulation walkthrough of private CRE/TEE evaluations.
// Steps 1-4 are PRIVATE evaluations: the TEE computes the risk, finds no breach,
// and DISCARDS the result. Nothing is submitted on-chain. Publishing these
// intermediate SAFE results would enable a binary-search oracle attack on the
// private threshold.
// Step 5 is the ONLY on-chain submission: the breach event (result=BREACHED).
export const RISK_STEPS = [
  {
    step: 1,
    score: "1.8%",
    label: "STEP 1 OF 5 (1.8% NORMAL)",
    level: 1,
    breach: false,
    // Private TEE evaluation — not submitted on-chain
    privateEval: true,
    onChain: false,
    status: "PRIVATE EVALUATION — NOT SUBMITTED",
    nextEvent: "Volatility Spike (+0.3%)",
  },
  {
    step: 2,
    score: "2.1%",
    label: "STEP 2 OF 5 (2.1% ELEVATED)",
    level: 2,
    breach: false,
    // Private TEE evaluation — not submitted on-chain
    privateEval: true,
    onChain: false,
    status: "PRIVATE EVALUATION — NOT SUBMITTED",
    nextEvent: "Collateral Pressure (+0.4%)",
  },
  {
    step: 3,
    score: "2.5%",
    label: "STEP 3 OF 5 (2.5% VOLATILE)",
    level: 3,
    breach: false,
    // Private TEE evaluation — not submitted on-chain
    privateEval: true,
    onChain: false,
    status: "PRIVATE EVALUATION — NOT SUBMITTED",
    nextEvent: "Market Cascade (+0.3%)",
  },
  {
    step: 4,
    score: "2.8%",
    label: "STEP 4 OF 5 (2.8% WARNING)",
    level: 4,
    breach: false,
    // Private TEE evaluation — not submitted on-chain
    privateEval: true,
    onChain: false,
    status: "PRIVATE EVALUATION — NOT SUBMITTED",
    nextEvent: "BREACH THRESHOLD APPROACH (+0.3%)",
  },
  {
    step: 5,
    score: "3.1%",
    label: "STEP 5 OF 5 (3.1% CONFIDENTIAL BREACH!)",
    level: 5,
    breach: true,
    // First actionable on-chain submission: CHECK_BREACH, result=BREACHED
    privateEval: false,
    onChain: true,
    status: "BREACH DETECTED — SUBMITTING ON-CHAIN",
    nextEvent: null,
  },
];


// ─── ACTIVITY EVENTS ─────────────────────────────────────────
export const ACTIVITY_EVENTS = [
  {
    id: 1,
    time: "12:44:18",
    event: "Escrow Unwound & Capital Returned",
    agreement: "#SOV-8F29",
    chain: "ARC",
    status: "SETTLED",
    txHash: "0x91a4...82fd",
  },
  {
    id: 2,
    time: "12:44:02",
    event: "Cross-Chain Relay Confirmed",
    agreement: "#SOV-8F29",
    chain: "ARC / SEPOLIA",
    status: "CONFIRMED",
    txHash: "0x7c12...44e1",
  },
  {
    id: 3,
    time: "12:43:51",
    event: "Breach Verified via ZK-Proof",
    agreement: "#SOV-8F29",
    chain: "SEPOLIA",
    status: "VERIFIED",
    txHash: "0x8f01...99bc",
    isBreach: true,
  },
  {
    id: 4,
    time: "12:41:20",
    event: "Capital Balance Locked ($100k USDC)",
    agreement: "#SOV-8F29",
    chain: "ARC",
    status: "LOCKED",
    txHash: "0x4a19...99ca",
  },
  {
    id: 5,
    time: "12:40:45",
    event: "Confidential Policy Verified",
    agreement: "#SOV-8F29",
    chain: "SEPOLIA",
    status: "VERIFIED",
    txHash: "0x81d2...a43b",
  },
  {
    id: 6,
    time: "12:39:48",
    event: "Agreement Terms Converged (Round 04)",
    agreement: "#SOV-8F29",
    chain: "SEPOLIA",
    status: "SIGNED",
    txHash: "0x992b...e041",
  },
  {
    id: 7,
    time: "12:38:10",
    event: "Intent Created & Policy Committed",
    agreement: "#SOV-8F29",
    chain: "SEPOLIA",
    status: "COMMITTED",
    txHash: "0x12c8...7710",
  },
  {
    id: 8,
    time: "2d ago",
    event: "Agreement Matured & Settled",
    agreement: "#SOV-7B14",
    chain: "ARC",
    status: "SETTLED",
    txHash: "0x33e8...11a9",
  },
];

// ─── AGENTS ──────────────────────────────────────────────────
export const AGENTS = [
  {
    id: "TA",
    name: "Treasury Agent",
    ens: "alice.sovereign.eth",
    address: "0x82a9482701bca72891fd",
    mandate: "PROPOSER & ALLOCATOR",
    role: "Proposer / Capital Allocator",
    managedCapital: "$1,420,000.00 USDC",
    delegationContract: "0x1942...88cc (Sepolia)",
    activeAgreement: "#SOV-8F29 ($100,000 USDC)",
    policySpec: "CONFIDENTIAL (ZK-SNARK BOUNDED)",
    hardwareKey: "Secp256k1 / Ledger Enterprise",
    sigScheme: "EIP-712 + ZK SNARK",
    status: "AUTHORIZED",
    executionCapacity: "$1,000,000 USDC",
  },
  {
    id: "SA",
    name: "Strategy Agent",
    ens: "bob.sovereign.eth",
    address: "0x51d2e1194ca00b987ab",
    mandate: "EXECUTION & SETTLEMENT",
    role: "Counterparty / Execution Engine",
    strategyType: "Delta-Neutral Yield Arbitrage",
    delegationContract: "Arc Protocol Channel #4",
    activeAgreement: "#SOV-8F29 ($100,000 USDC)",
    executionScriptHash: "0x39a1c...99fe",
    hardwareKey: "Hardware Enclave / TEE Verified",
    sigScheme: "SGX Enclave v2",
    status: "AUTHORIZED",
    executionCapacity: "$2,400,000 USDC (Unconstrained)",
  },
];

// ─── AUDIT LOG (for Overview / Protocol) ────────────────────
export const AUDIT_LOG = [
  {
    txHash: "0x4a19...99ca",
    time: "10 mins ago",
    action: "Arc Escrow Capital Locked ($100,000 USDC)",
    actor: "Arc Escrow Core",
    network: "ARC",
    status: "CONFIRMED",
  },
  {
    txHash: "0x81d2...a43b",
    time: "14 mins ago",
    action: "Agreement Registry Validation Accepted (#SOV-8F29)",
    actor: "Sovereign Registry",
    network: "SEPOLIA",
    status: "CONFIRMED",
  },
  {
    txHash: "0x992b...e041",
    time: "22 mins ago",
    action: "Strategy Agent Offer Accepted (Convergence reached)",
    actor: "strategy.sovereign.eth",
    network: "SEPOLIA",
    status: "FINALIZED",
  },
  {
    txHash: "0x12c8...7710",
    time: "31 mins ago",
    action: "Treasury Counter-Offer Submitted (8.40% Yield / 25d)",
    actor: "treasury.sovereign.eth",
    network: "SEPOLIA",
    status: "SETTLED",
  },
];

// ZK_RUNS represents ONLY on-chain records in the DecisionSink.
// SAFE evaluations are NEVER written here — they are private TEE-local
// results that are evaluated and discarded inside the CRE enclave.
// The only on-chain entry is the first actionable breach event.
export const ZK_RUNS = [
  {
    block: "#19,482,104",
    proofRoot: "0x9c41...b72a",
    // Breach proof: first actionable on-chain submission
    input: "CHECK_BREACH — Threshold Crossed",
    verdict: "BREACHED // ENFORCEMENT TRIGGERED",
    drift: "3.1000%",
    onChain: true,
  },
  {
    // Not an on-chain record — private TEE evaluation, shown for transparency.
    // This data exists only in the CRE local audit log, not in any public sink.
    block: "#19,482,103",
    proofRoot: "0x811e...3e01  [PRIVATE]",
    input: "TEE Evaluation — Safe (Not Submitted)",
    verdict: "CLEAR // NOT SUBMITTED ON-CHAIN",
    drift: "2.8000%",
    onChain: false,
  },
  {
    // Not an on-chain record — private TEE evaluation, shown for transparency.
    block: "#19,482,102",
    proofRoot: "0x4a00...d8f2  [PRIVATE]",
    input: "TEE Evaluation — Safe (Not Submitted)",
    verdict: "CLEAR // NOT SUBMITTED ON-CHAIN",
    drift: "1.8000%",
    onChain: false,
  },
];


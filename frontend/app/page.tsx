"use client";

import { useState } from "react";
import Link from "next/link";

export default function LandingPage() {
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const connectMockWallet = (address: string) => {
    setShowWalletModal(false);
    setToastMessage(`Signer authorized: ${address}. Entering Sovereign Control Plane.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="bg-surface-container-low text-on-surface font-body-md selection:bg-primary-container selection:text-white min-h-screen relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-surface-container-lowest border-2 border-on-surface p-4 neo-shadow flex items-center gap-3 animate-in fade-in slide-in-from-top-5">
          <span className="material-symbols-outlined text-primary">info</span>
          <span className="font-code-sm font-bold text-on-surface">{toastMessage}</span>
        </div>
      )}

      {/* TOP APP BAR */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-surface-container-low/90 backdrop-blur-md border-b-2 border-on-surface z-50 px-6 md:px-10 flex items-center justify-between">
        {/* Brand / Identifier */}
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-on-surface flex items-center justify-center text-surface font-headline-md text-headline-md font-bold tracking-tight">
            S
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-headline-sm text-headline-sm font-bold tracking-tight text-on-surface">SOVEREIGN</span>
              <span className="font-label-caps text-label-caps bg-surface-container-high px-1.5 py-0.5 border border-on-surface uppercase">v2.4</span>
            </div>
            <p className="font-label-caps text-label-caps text-secondary uppercase tracking-widest hidden sm:block">AUTONOMOUS FINANCIAL AGREEMENTS</p>
          </div>
        </div>
        {/* Center Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 font-code-sm text-code-sm uppercase tracking-widest text-on-surface">
          <a className="hover:text-primary transition-none" href="#overview">Overview</a>
          <a className="hover:text-primary transition-none" href="#lifecycle">Lifecycle</a>
          <a className="hover:text-primary transition-none" href="#privacy">Confidentiality</a>
          <a className="hover:text-primary transition-none" href="#negotiation">Negotiation</a>
          <a className="hover:text-primary transition-none" href="#risk">Enforcement</a>
          <a className="hover:text-primary transition-none" href="#architecture">Architecture</a>
        </nav>
        {/* Header Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-2.5 py-1 bg-surface-container-lowest border border-on-surface shadow-[1.5px_1.5px_0px_#1b1c19]">
            <span className="w-2 h-2 rounded-full bg-tertiary-container animate-pulse"></span>
            <span className="font-code-sm text-code-sm uppercase tracking-wider text-on-surface">SEPOLIA &amp; ARC // SYNCED</span>
          </div>
          <button 
            className="flex items-center gap-2 bg-primary-container text-on-primary px-4 py-2 border-2 border-on-surface font-code-sm text-code-sm tracking-wider shadow-[2px_2px_0px_#1b1c19] hover:shadow-[3px_3px_0px_#1b1c19] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[0px_0px_0px_#1b1c19] transition-none" 
            onClick={() => setShowWalletModal(true)}
          >
            <span className="material-symbols-outlined text-[16px]">account_balance_wallet</span>
            <span>Connect wallet</span>
          </button>
        </div>
      </header>

      {/* GRID WRAPPER */}
      <div className="grid-bg pt-16">
        {/* HERO SECTION */}
        <section className="max-w-7xl mx-auto px-6 md:px-10 pt-16 pb-20 border-b-2 border-on-surface" id="overview">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Text */}
            <div className="lg:col-span-7 flex flex-col items-start">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container-high border border-on-surface font-code-sm text-code-sm uppercase tracking-widest text-on-surface mb-6">
                <span className="w-2 h-2 bg-primary"></span>
                AUTONOMOUS FINANCIAL INFRASTRUCTURE
              </div>
              <h1 className="font-display-lg text-display-lg md:text-[58px] md:leading-[62px] text-on-surface font-bold tracking-tight mb-6">
                Autonomous agreements.<br/>
                <span className="underline decoration-primary-container decoration-4 underline-offset-8">Enforced privately.</span>
              </h1>
              <p className="font-body-lg text-body-lg text-secondary max-w-xl mb-8 leading-relaxed">
                Treasury and strategy agents negotiate programmatic financial covenants while private risk limits remain strictly confidential. Verified via zero-knowledge commitments and deterministically unwound on-chain.
              </p>
              <div className="flex flex-wrap items-center gap-4 mb-10">
                <button 
                  className="flex items-center gap-3 bg-primary-container text-on-primary px-6 py-3.5 border-2 border-on-surface font-code-md text-code-md tracking-wider font-semibold shadow-[3px_3px_0px_#1b1c19] hover:shadow-[4px_4px_0px_#1b1c19] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[0px_0px_0px_#1b1c19] transition-none" 
                  onClick={() => setShowWalletModal(true)}
                >
                  <span>Initialize agreement</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
                <Link 
                  className="flex items-center gap-2 bg-surface-container-lowest text-on-surface px-6 py-3.5 border-2 border-on-surface font-code-md text-code-md tracking-wider font-medium shadow-[2px_2px_0px_#1b1c19] hover:bg-surface-container transition-none" 
                  href="/overview"
                >
                  <span>Explore protocol</span>
                </Link>
              </div>
              {/* Hero Metrics Ledger */}
              <div className="grid grid-cols-3 gap-3 w-full max-w-lg border-2 border-on-surface bg-surface-container-lowest p-3 shadow-[2px_2px_0px_#1b1c19]">
                <div className="border-r border-on-surface pr-3">
                  <span className="font-label-caps text-label-caps text-secondary block uppercase">SETTLEMENT TIME</span>
                  <span className="font-num-headline text-num-headline text-on-surface font-bold">&lt;400ms</span>
                </div>
                <div className="border-r border-on-surface pr-3">
                  <span className="font-label-caps text-label-caps text-secondary block uppercase">ESCROW VOLUME</span>
                  <span className="font-num-headline text-num-headline text-on-surface font-bold">$14.2M</span>
                </div>
                <div>
                  <span className="font-label-caps text-label-caps text-secondary block uppercase">ZK AUDIT VERIFIED</span>
                  <span className="font-num-headline text-num-headline text-tertiary font-bold">100%</span>
                </div>
              </div>
            </div>
            {/* Hero Graphic: Protocol Architecture Pipeline */}
            <div className="lg:col-span-5">
              <div className="bg-surface-container-lowest border-2 border-on-surface shadow-[4px_4px_0px_#1b1c19] p-6 relative">
                <div className="flex items-center justify-between border-b-2 border-on-surface pb-3 mb-5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-tertiary-container"></span>
                    <span className="font-code-sm text-code-sm uppercase tracking-wider font-bold">PIPELINE EXECUTION TELEMETRY</span>
                  </div>
                  <span className="font-label-caps text-label-caps bg-surface-container-high px-2 py-0.5 border border-on-surface">FLOW #9182</span>
                </div>
                {/* Pipeline Nodes */}
                <div className="space-y-3 font-code-sm text-code-sm">
                  {/* Node 1 */}
                  <div className="p-3 border border-on-surface bg-surface-container-low flex items-center justify-between">
                    <div>
                      <span className="text-secondary block text-[10px]">01 // TREASURY AGENT</span>
                      <span className="font-semibold text-on-surface">alice.sovereign.eth</span>
                    </div>
                    <span className="px-2 py-0.5 bg-surface-container-lowest border border-on-surface text-[10px] text-primary font-bold">AUTHORIZED</span>
                  </div>
                  <div className="flex justify-center -my-1 text-on-surface">
                    <span className="material-symbols-outlined text-sm leading-none">arrow_downward</span>
                  </div>
                  {/* Node 2 */}
                  <div className="p-3 border border-on-surface bg-surface-container-lowest flex items-center justify-between shadow-[1.5px_1.5px_0px_#1b1c19]">
                    <div>
                      <span className="text-secondary block text-[10px]">02 // M2M NEGOTIATION</span>
                      <span className="font-semibold text-on-surface">CONVERGED (3 ROUNDS)</span>
                    </div>
                    <span className="px-2 py-0.5 bg-surface-container-high border border-on-surface text-[10px] font-bold">EIP-712</span>
                  </div>
                  <div className="flex justify-center -my-1 text-on-surface">
                    <span className="material-symbols-outlined text-sm leading-none">arrow_downward</span>
                  </div>
                  {/* Node 3 */}
                  <div className="p-3 border-2 border-primary-container bg-surface-container-low flex items-center justify-between shadow-[2px_2px_0px_#3155ff]">
                    <div>
                      <span className="text-primary font-bold block text-[10px]">03 // PRIVATE ZK VALIDATION</span>
                      <span className="font-semibold text-on-surface">0x71c4...9e11 (SEALED)</span>
                    </div>
                    <span className="px-2 py-0.5 bg-primary-container text-white border border-on-surface text-[10px] font-bold">LOCKED</span>
                  </div>
                  <div className="flex justify-center -my-1 text-on-surface">
                    <span className="material-symbols-outlined text-sm leading-none">arrow_downward</span>
                  </div>
                  {/* Node 4 */}
                  <div className="p-3 border border-on-surface bg-surface-container-lowest flex items-center justify-between">
                    <div>
                      <span className="text-secondary block text-[10px]">04 // ARC ESCROW CHANNEL</span>
                      <span className="font-semibold text-on-surface">100,000.00 USDC</span>
                    </div>
                    <span className="px-2 py-0.5 bg-surface-container-high border border-on-surface text-[10px] font-bold">DEPOSITED</span>
                  </div>
                  <div className="flex justify-center -my-1 text-on-surface">
                    <span className="material-symbols-outlined text-sm leading-none">arrow_downward</span>
                  </div>
                  {/* Node 5 */}
                  <div className="p-3 border border-on-surface bg-surface-container-low flex items-center justify-between">
                    <div>
                      <span className="text-secondary block text-[10px]">05 // RISK ENGINE MONITOR</span>
                      <span className="font-semibold text-on-surface">1.8% CONTINUOUS DELTA</span>
                    </div>
                    <span className="px-2 py-0.5 bg-tertiary text-white border border-on-surface text-[10px] font-bold">HEALTHY</span>
                  </div>
                  <div className="flex justify-center -my-1 text-on-surface">
                    <span className="material-symbols-outlined text-sm leading-none">arrow_downward</span>
                  </div>
                  {/* Node 6 */}
                  <div className="p-3 border border-on-surface bg-surface-container-high flex items-center justify-between">
                    <div>
                      <span className="text-secondary block text-[10px]">06 // UNWIND FINALITY GATE</span>
                      <span className="font-semibold text-on-surface">STANDBY ARMED</span>
                    </div>
                    <span className="px-2 py-0.5 bg-surface-container-lowest border border-on-surface text-[10px] font-mono">STANDBY</span>
                  </div>
                </div>
                {/* Terminal Hash Strip */}
                <div className="mt-4 pt-3 border-t border-on-surface flex justify-between items-center text-[10px] font-code-sm text-secondary">
                  <span>ROOT: 0x88f2...00ba</span>
                  <span className="text-tertiary font-bold">● PROTOCOL VERIFIED</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CONTINUOUS TELEMETRY STRIP */}
        <div className="w-full bg-surface-container-lowest border-b-2 border-on-surface py-3 px-6 md:px-10 overflow-x-auto whitespace-nowrap">
          <div className="flex items-center justify-between min-w-[960px] font-code-sm text-code-sm text-on-surface uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-tertiary-container"></span>
              <span>SEPOLIA // CORE REGISTRY: ACTIVE</span>
            </div>
            <span className="text-outline">/</span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-primary-container"></span>
              <span>ARC NETWORK // ESCROW CHANNEL #04</span>
            </div>
            <span className="text-outline">/</span>
            <span>CURRENCY: USDC NATIVE</span>
            <span className="text-outline">/</span>
            <span>POLICY VISIBILITY: CONFIDENTIAL (ZK-SNARK)</span>
            <span className="text-outline">/</span>
            <span>FINALITY: DETERMINISTIC SUB-BLOCK</span>
          </div>
        </div>

        {/* TRUST & CORE PILLARS (EDITORIAL THREE-COLUMN) */}
        <section className="max-w-7xl mx-auto px-6 md:px-10 py-20 border-b-2 border-on-surface">
          <div className="mb-10">
            <span className="font-label-caps text-label-caps text-secondary block uppercase mb-2">ARCHITECTURAL FOUNDATIONS</span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">Engineered for autonomous capital assurance</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1 */}
            <div className="border-2 border-on-surface bg-surface-container-lowest p-6 shadow-[3px_3px_0px_#1b1c19]">
              <div className="flex items-center justify-between mb-4 border-b border-on-surface pb-2">
                <span className="font-code-md text-code-md text-primary font-bold">01 // CONFIDENTIALITY</span>
                <span className="material-symbols-outlined text-primary">enhanced_encryption</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-3">Zero-Knowledge Private Policies</h3>
              <p className="font-body-md text-body-md text-secondary leading-relaxed">
                Your constraints remain completely shielded. Treasury loss thresholds, liquidation ratios, and minimum yield bounds are committed through ZK circuits and never exposed to counterparties or mempools.
              </p>
              <div className="mt-6 pt-3 border-t border-surface-variant font-code-sm text-code-sm text-on-surface-variant">
                PROOF SYSTEM: Groth16 / Plonk SNARK
              </div>
            </div>
            {/* Pillar 2 */}
            <div className="border-2 border-on-surface bg-surface-container-lowest p-6 shadow-[3px_3px_0px_#1b1c19]">
              <div className="flex items-center justify-between mb-4 border-b border-on-surface pb-2">
                <span className="font-code-md text-code-md text-primary font-bold">02 // DETERMINISM</span>
                <span className="material-symbols-outlined text-primary">gavel</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-3">Verifiable M2M Negotiations</h3>
              <p className="font-body-md text-body-md text-secondary leading-relaxed">
                Every exchange between agent delegates, term convergence, and parameter adjustments is cryptographically signed with EIP-712 structured envelopes and recorded immutably on Sepolia.
              </p>
              <div className="mt-6 pt-3 border-t border-surface-variant font-code-sm text-code-sm text-on-surface-variant">
                TRACE RIGOR: Hash-linked State Machine
              </div>
            </div>
            {/* Pillar 3 */}
            <div className="border-2 border-on-surface bg-surface-container-lowest p-6 shadow-[3px_3px_0px_#1b1c19]">
              <div className="flex items-center justify-between mb-4 border-b border-on-surface pb-2">
                <span className="font-code-md text-code-md text-primary font-bold">03 // FINALITY</span>
                <span className="material-symbols-outlined text-primary">published_with_changes</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-3">Automatic Escrow Unwind</h3>
              <p className="font-body-md text-body-md text-secondary leading-relaxed">
                The instant continuous telemetry confirms a breach of private parameters, the cross-chain bridge autonomously executes an escrow liquidation on Arc Network without human or multisig delay.
              </p>
              <div className="mt-6 pt-3 border-t border-surface-variant font-code-sm text-code-sm text-on-surface-variant">
                SETTLEMENT: Sub-block cross-chain trigger
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS: ONE LIFECYCLE (HORIZONTAL STEPPER) */}
        <section className="max-w-7xl mx-auto px-6 md:px-10 py-20 border-b-2 border-on-surface" id="lifecycle">
          <div className="mb-12">
            <span className="font-label-caps text-label-caps text-secondary block uppercase mb-2">END-TO-END SPECIFICATION</span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">One agreement. One autonomous lifecycle.</h2>
            <p className="font-body-md text-body-md text-secondary mt-1">From confidential risk intent to programmatic capital restitution.</p>
          </div>
          {/* 6 Sequential Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="border-2 border-on-surface bg-surface-container-lowest p-5 relative shadow-[2px_2px_0px_#1b1c19]">
              <div className="flex justify-between items-center mb-3">
                <span className="font-code-md text-code-md bg-on-surface text-surface-container-lowest px-2 py-0.5 font-bold">STEP 01</span>
                <span className="font-label-caps text-label-caps text-secondary uppercase">SPECIFICATION</span>
              </div>
              <h4 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-2">Define Private Bounds</h4>
              <p className="font-body-sm text-body-sm text-secondary">
                Treasury operators define confidential thresholds: drawdown limits, APR bounds, and max volatility without publishing raw numbers.
              </p>
            </div>
            {/* Step 2 */}
            <div className="border-2 border-on-surface bg-surface-container-lowest p-5 relative shadow-[2px_2px_0px_#1b1c19]">
              <div className="flex justify-between items-center mb-3">
                <span className="font-code-md text-code-md bg-on-surface text-surface-container-lowest px-2 py-0.5 font-bold">STEP 02</span>
                <span className="font-label-caps text-label-caps text-secondary uppercase">COORDINATION</span>
              </div>
              <h4 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-2">Autonomous Negotiation</h4>
              <p className="font-body-sm text-body-sm text-secondary">
                Machine agents run multi-round convergence algorithms to find mutually viable covenants within both parties' secret envelopes.
              </p>
            </div>
            {/* Step 3 */}
            <div className="border-2 border-on-surface bg-surface-container-lowest p-5 relative shadow-[2px_2px_0px_#1b1c19]">
              <div className="flex justify-between items-center mb-3">
                <span className="font-code-md text-code-md bg-on-surface text-surface-container-lowest px-2 py-0.5 font-bold">STEP 03</span>
                <span className="font-label-caps text-label-caps text-secondary uppercase">VERIFICATION</span>
              </div>
              <h4 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-2">ZK-Proof Anchoring</h4>
              <p className="font-body-sm text-body-sm text-secondary">
                A succinct zero-knowledge proof verifies that the terms comply with the private policy without leaking the boundary values.
              </p>
            </div>
            {/* Step 4 */}
            <div className="border-2 border-on-surface bg-surface-container-lowest p-5 relative shadow-[2px_2px_0px_#1b1c19]">
              <div className="flex justify-between items-center mb-3">
                <span className="font-code-md text-code-md bg-on-surface text-surface-container-lowest px-2 py-0.5 font-bold">STEP 04</span>
                <span className="font-label-caps text-label-caps text-secondary uppercase">DEPOSIT</span>
              </div>
              <h4 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-2">Arc Escrow Funding</h4>
              <p className="font-body-sm text-body-sm text-secondary">
                Capital is locked directly into the high-performance Arc execution contract, isolated with cryptographic timelocks.
              </p>
            </div>
            {/* Step 5 */}
            <div className="border-2 border-on-surface bg-surface-container-lowest p-5 relative shadow-[2px_2px_0px_#1b1c19]">
              <div className="flex justify-between items-center mb-3">
                <span className="font-code-md text-code-md bg-on-surface text-surface-container-lowest px-2 py-0.5 font-bold">STEP 05</span>
                <span className="font-label-caps text-label-caps text-secondary uppercase">TELEMETRY</span>
              </div>
              <h4 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-2">Real-Time Observation</h4>
              <p className="font-body-sm text-body-sm text-secondary">
                Off-chain oracles feed continuous balance sheets and collateral health data into the Sovereign confidential risk evaluator.
              </p>
            </div>
            {/* Step 6 */}
            <div className="border-2 border-on-surface bg-surface-container-lowest p-5 relative shadow-[2px_2px_0px_#1b1c19]">
              <div className="flex justify-between items-center mb-3">
                <span className="font-code-md text-code-md bg-primary-container text-white px-2 py-0.5 font-bold">STEP 06</span>
                <span className="font-label-caps text-label-caps text-secondary uppercase">FINALITY</span>
              </div>
              <h4 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-2">Deterministic Settlement</h4>
              <p className="font-body-sm text-body-sm text-secondary">
                Upon term maturity or immediate breach trigger, assets unwind to safe vaults with zero human friction.
              </p>
            </div>
          </div>
        </section>

        {/* KEY DIFFERENTIATOR: PRIVATE CONSTRAINTS VS PUBLIC TERMS */}
        <section className="max-w-7xl mx-auto px-6 md:px-10 py-20 border-b-2 border-on-surface" id="privacy">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: Explanatory Context */}
            <div className="lg:col-span-6">
              <span className="font-label-caps text-label-caps text-secondary block uppercase mb-2">CRYPTOGRAPHIC PRIVACY ENGINE</span>
              <h2 className="font-display-lg text-display-lg text-on-surface font-bold mb-6">
                The counterparty sees the deal.<br/>
                <span className="text-primary">They do not see your limits.</span>
              </h2>
              <p className="font-body-lg text-body-lg text-secondary mb-6 leading-relaxed">
                Traditional agreements require revealing internal financial models and pain thresholds to prove solvency. Sovereign decouples public covenants from private risk bounds.
              </p>
              <div className="space-y-4">
                <div className="border-l-4 border-primary-container pl-4 py-1">
                  <h5 className="font-headline-sm text-headline-sm font-bold text-on-surface">Public Execution Terms</h5>
                  <p className="font-body-sm text-body-sm text-secondary">Principal: $100,000 USDC | Duration: 25 Days | Agreed Yield: 8.40% APR</p>
                </div>
                <div className="border-l-4 border-on-surface pl-4 py-1">
                  <h5 className="font-headline-sm text-headline-sm font-bold text-on-surface">Zero-Knowledge Attestation</h5>
                  <p className="font-body-sm text-body-sm text-secondary">Proves: Deal yield &gt; Min Yield AND Counterparty Risk &lt; Max Drawdown without publishing values.</p>
                </div>
              </div>
            </div>
            {/* Right: Private Policy Vault Card */}
            <div className="lg:col-span-6">
              <div className="bg-surface-container-lowest border-2 border-on-surface p-6 shadow-[4px_4px_0px_#1b1c19]">
                <div className="flex items-center justify-between border-b-2 border-on-surface pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">lock</span>
                    <span className="font-code-sm text-code-sm font-bold uppercase">CONFIDENTIAL POLICY COMMITMENT</span>
                  </div>
                  <span className="font-label-caps text-label-caps bg-surface-container-high px-2 py-0.5 border border-on-surface">SEALED</span>
                </div>
                <div className="bg-surface-container-low border border-on-surface p-4 font-code-sm text-code-sm space-y-3 mb-5">
                  <div className="flex justify-between items-center">
                    <span className="text-secondary">MINIMUM ACCEPTABLE YIELD:</span>
                    <span className="bg-on-surface text-surface-container-lowest px-2 py-0.5 tracking-widest font-mono text-xs select-none">████████ [ENCRYPTED]</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-secondary">MAX VOLATILITY TOLERANCE:</span>
                    <span className="bg-on-surface text-surface-container-lowest px-2 py-0.5 tracking-widest font-mono text-xs select-none">████████ [ENCRYPTED]</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-secondary">MAX DRAWDOWN LIQUIDATION:</span>
                    <span className="bg-on-surface text-surface-container-lowest px-2 py-0.5 tracking-widest font-mono text-xs select-none">████████ [ENCRYPTED]</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-secondary">POLICY SALT HASH:</span>
                    <span className="text-primary font-mono text-xs">0x49f2...a10b</span>
                  </div>
                </div>
                {/* Attestation Footer Badge */}
                <div className="p-3 border border-on-surface bg-surface-container-lowest flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-tertiary text-sm">verified_user</span>
                    <span className="font-label-caps text-label-caps uppercase text-on-surface">ZK-SNARK VALIDATION ATTESTED</span>
                  </div>
                  <span className="font-code-sm text-code-sm text-tertiary font-bold">VALID // 100% SOLVENT</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AGENT NEGOTIATION PROTOCOL TRACE */}
        <section className="max-w-7xl mx-auto px-6 md:px-10 py-20 border-b-2 border-on-surface" id="negotiation">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <span className="font-label-caps text-label-caps text-secondary block uppercase mb-2">MACHINE-TO-MACHINE COORDINATION</span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">Autonomous Agent Negotiation Trace</h2>
            </div>
            <div className="mt-4 md:mt-0 font-code-sm text-code-sm text-secondary">
              PAIR: <span className="text-on-surface font-semibold">alice.sovereign.eth</span> ↔ <span className="text-on-surface font-semibold">bob.sovereign.eth</span>
            </div>
          </div>
          {/* Ledger Trace Component */}
          <div className="border-2 border-on-surface bg-surface-container-lowest shadow-[4px_4px_0px_#1b1c19] overflow-hidden">
            {/* Trace Header */}
            <div className="grid grid-cols-12 bg-surface-container-high border-b-2 border-on-surface py-2.5 px-4 font-label-caps text-label-caps text-on-surface uppercase tracking-wider">
              <div className="col-span-2">ROUND / PHASE</div>
              <div className="col-span-3">PROPOSING AGENT</div>
              <div className="col-span-4">OFFER SPECIFICATIONS</div>
              <div className="col-span-3 text-right">EIP-712 ATTESTATION</div>
            </div>
            {/* Round 1 */}
            <div className="grid grid-cols-12 py-3 px-4 border-b border-surface-variant font-code-sm text-code-sm items-center hover:bg-surface-container-low">
              <div className="col-span-2 font-bold text-on-surface">ROUND 01</div>
              <div className="col-span-3 text-secondary">alice.sovereign.eth (Treasury)</div>
              <div className="col-span-4">30 DAYS @ 8.00% APR // $100K USDC</div>
              <div className="col-span-3 text-right font-mono text-outline">0xfa29...81c2</div>
            </div>
            {/* Round 2 */}
            <div className="grid grid-cols-12 py-3 px-4 border-b border-surface-variant font-code-sm text-code-sm items-center hover:bg-surface-container-low">
              <div className="col-span-2 font-bold text-on-surface">ROUND 02</div>
              <div className="col-span-3 text-secondary">bob.sovereign.eth (Strategy)</div>
              <div className="col-span-4">30 DAYS @ 8.80% APR // $100K USDC</div>
              <div className="col-span-3 text-right font-mono text-outline">0x8891...33d1</div>
            </div>
            {/* Round 3 (Convergence) */}
            <div className="grid grid-cols-12 py-3 px-4 border-b-2 border-on-surface bg-surface-container font-code-sm text-code-sm items-center">
              <div className="col-span-2 font-bold text-primary">ROUND 03 [FINAL]</div>
              <div className="col-span-3 text-on-surface font-semibold">alice ↔ bob (Mutual Convergence)</div>
              <div className="col-span-4 text-on-surface font-bold">25 DAYS @ 8.40% APR // $100K USDC</div>
              <div className="col-span-3 text-right">
                <span className="bg-tertiary text-white px-2 py-0.5 border border-on-surface font-label-caps text-label-caps uppercase">CONVERGED &amp; SIGNED</span>
              </div>
            </div>
            {/* Bottom Execution Status */}
            <div className="p-4 bg-surface-container-low flex flex-wrap items-center justify-between gap-4 font-code-sm text-code-sm">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary text-sm">lock</span>
                <span>AGREEMENT HASH: <span className="font-bold">0x629c48b1...09ac</span></span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-secondary">GAS USED: 84,102 WEI</span>
                <span className="text-primary font-bold">SETTLEMENT DISPATCHED →</span>
              </div>
            </div>
          </div>
        </section>

        {/* RISK DYNAMICS & THE ENFORCEMENT KILLER MOMENT */}
        <section className="max-w-7xl mx-auto px-6 md:px-10 py-20 border-b-2 border-on-surface" id="risk">
          <div className="mb-10">
            <span className="font-label-caps text-label-caps text-secondary block uppercase mb-2">AUTONOMOUS RISK MONITOR</span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">Risk changes. Sovereign reacts.</h2>
            <p className="font-body-md text-body-md text-secondary mt-1">Simulated execution trigger when an agreement exceeds its private risk boundary.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Telemetry Progression Simulator */}
            <div className="lg:col-span-7 bg-surface-container-lowest border-2 border-on-surface p-6 shadow-[3px_3px_0px_#1b1c19]">
              <div className="flex justify-between items-center border-b-2 border-on-surface pb-3 mb-6">
                <span className="font-code-sm text-code-sm font-bold uppercase">LIVE DRAWDOWN TELEMETRY</span>
                <span className="font-label-caps text-label-caps bg-surface-container-high px-2 py-0.5 border border-on-surface">1 SEC REFRESH</span>
              </div>
              {/* Step Progression Bars */}
              <div className="space-y-4 font-code-sm text-code-sm">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>T+00s // Initial State</span>
                    <span className="font-bold text-tertiary">1.8% (NORMAL)</span>
                  </div>
                  <div className="h-3 w-full bg-surface-container border border-on-surface">
                    <div className="h-full bg-tertiary-container w-[18%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>T+12s // Minor Slippage</span>
                    <span className="font-bold text-tertiary">2.1% (NORMAL)</span>
                  </div>
                  <div className="h-3 w-full bg-surface-container border border-on-surface">
                    <div className="h-full bg-tertiary-container w-[21%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>T+24s // Market Stress</span>
                    <span className="font-bold text-secondary">2.5% (ELEVATED)</span>
                  </div>
                  <div className="h-3 w-full bg-surface-container border border-on-surface">
                    <div className="h-full bg-on-surface w-[25%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>T+36s // Approaching Bound</span>
                    <span className="font-bold text-on-error-container">2.8% (WARNING)</span>
                  </div>
                  <div className="h-3 w-full bg-surface-container border border-on-surface">
                    <div className="h-full bg-error w-[28%]"></div>
                  </div>
                </div>
                <div className="p-3 bg-error-container/40 border-2 border-error">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-bold text-error">T+48s // BOUND EXCEEDED</span>
                    <span className="font-bold text-error">3.1% &gt; 3.0% [BREACH]</span>
                  </div>
                  <div className="h-4 w-full bg-surface-container border border-error">
                    <div className="h-full bg-error w-[31%]"></div>
                  </div>
                  <p className="font-code-sm text-code-sm text-error mt-2 font-medium">
                    [!] CRITICAL: Secret threshold of 3.00% breached. Proof generator armed.
                  </p>
                </div>
              </div>
            </div>
            {/* Right: Enforcement Cascade Execution Card */}
            <div className="lg:col-span-5 bg-surface-container-lowest border-2 border-on-surface p-6 shadow-[3px_3px_0px_#1b1c19] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b-2 border-on-surface pb-3 mb-4">
                  <span className="font-code-sm text-code-sm font-bold uppercase text-error flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px]">warning</span>
                    AUTONOMOUS ENFORCEMENT CASCADE
                  </span>
                  <span className="font-label-caps text-label-caps bg-error-container text-error px-1.5 py-0.5 border border-error font-bold">TRIGGERED</span>
                </div>
                <div className="space-y-4 font-code-sm text-code-sm">
                  <div className="p-2.5 border border-on-surface bg-surface-container-low flex items-center gap-3">
                    <span className="font-bold text-error">01</span>
                    <div>
                      <span className="font-bold block text-on-surface">Breach Proof Generated</span>
                      <span className="text-xs text-secondary">Zero-knowledge circuit verifies delta</span>
                    </div>
                  </div>
                  <div className="p-2.5 border border-on-surface bg-surface-container-low flex items-center gap-3">
                    <span className="font-bold text-primary">02</span>
                    <div>
                      <span className="font-bold block text-on-surface">Cross-Chain Relay Dispatched</span>
                      <span className="text-xs text-secondary">Sepolia → Arc Escrow Channel</span>
                    </div>
                  </div>
                  <div className="p-2.5 border border-on-surface bg-surface-container-low flex items-center gap-3">
                    <span className="font-bold text-tertiary">03</span>
                    <div>
                      <span className="font-bold block text-on-surface">Escrow Liquidated</span>
                      <span className="text-xs text-secondary">100,000.00 USDC returned to Treasury</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Bottom Settlement Confirmation */}
              <div className="mt-6 pt-4 border-t-2 border-on-surface bg-surface-container p-3 border">
                <div className="flex items-center justify-between">
                  <span className="font-code-sm text-code-sm uppercase font-bold text-tertiary flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    CAPITAL SECURED
                  </span>
                  <span className="font-label-caps text-label-caps font-mono">0 SLIPPAGE</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CROSS-CHAIN INFRASTRUCTURE PIPELINE */}
        <section className="max-w-7xl mx-auto px-6 md:px-10 py-20 border-b-2 border-on-surface" id="architecture">
          <div className="mb-10 text-center">
            <span className="font-label-caps text-label-caps text-secondary uppercase block mb-2">DUAL-CHAIN ARCHITECTURE</span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">Built across Sepolia &amp; Arc Networks</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Layer 1: Sepolia */}
            <div className="border-2 border-on-surface bg-surface-container-lowest p-6 shadow-[3px_3px_0px_#1b1c19]">
              <div className="flex items-center justify-between mb-4 border-b border-on-surface pb-2">
                <span className="font-code-md text-code-md font-bold">SEPOLIA LAYER</span>
                <span className="font-label-caps text-label-caps bg-surface-container-high px-2 py-0.5 border border-on-surface">REGISTRY</span>
              </div>
              <h4 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-2">Validation &amp; Identity</h4>
              <ul className="font-code-sm text-code-sm space-y-2 text-secondary">
                <li>• Agent ENS Identity Mapping</li>
                <li>• EIP-712 Negotiation Hashes</li>
                <li>• Groth16 ZK Verifier Contracts</li>
                <li>• Policy Commitment Merkle Tree</li>
              </ul>
            </div>
            {/* Relay Bridge Node */}
            <div className="border-2 border-dashed border-on-surface bg-surface-container p-6 text-center shadow-[2px_2px_0px_#1b1c19]">
              <span className="material-symbols-outlined text-primary text-3xl mb-2">sync_alt</span>
              <h4 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-1">Sovereign Relay</h4>
              <p className="font-code-sm text-code-sm text-secondary mb-3">Cryptographic State Attestation</p>
              <div className="inline-block px-3 py-1 bg-surface-container-lowest border border-on-surface font-code-sm text-code-sm font-bold text-primary">
                LATENCY: &lt;180ms
              </div>
            </div>
            {/* Layer 2: Arc Network */}
            <div className="border-2 border-on-surface bg-surface-container-lowest p-6 shadow-[3px_3px_0px_#1b1c19]">
              <div className="flex items-center justify-between mb-4 border-b border-on-surface pb-2">
                <span className="font-code-md text-code-md font-bold">ARC LAYER</span>
                <span className="font-label-caps text-label-caps bg-surface-container-high px-2 py-0.5 border border-on-surface">SETTLEMENT</span>
              </div>
              <h4 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-2">Escrow &amp; Execution</h4>
              <ul className="font-code-sm text-code-sm space-y-2 text-secondary">
                <li>• High-Throughput Vaults</li>
                <li>• Deterministic Unwind Engine</li>
                <li>• Direct USDC Native Balance</li>
                <li>• Zero-Latency State Updates</li>
              </ul>
            </div>
          </div>
        </section>

        {/* FINAL ACTION / CTA CALLOUT */}
        <section className="max-w-7xl mx-auto px-6 md:px-10 py-24">
          <div className="border-2 border-on-surface bg-surface-container-lowest p-8 md:p-14 shadow-[6px_6px_0px_#1b1c19] relative">
            <div className="max-w-2xl">
              <span className="font-label-caps text-label-caps text-secondary uppercase block mb-3">DEPLOY AUTONOMOUS TREASURY SHIELD</span>
              <h2 className="font-display-lg text-display-lg text-on-surface font-bold mb-4 leading-tight">
                Give your treasury an autonomous agent.
              </h2>
              <p className="font-body-lg text-body-lg text-secondary mb-8 leading-relaxed">
                Define your confidential boundaries once. Let autonomous software negotiate terms with counterparties and let the Sovereign protocol enforce capital protection on-chain.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <button 
                  className="flex items-center gap-3 bg-primary-container text-on-primary px-8 py-4 border-2 border-on-surface font-code-md text-code-md uppercase tracking-wider font-semibold shadow-[3px_3px_0px_#1b1c19] hover:shadow-[4px_4px_0px_#1b1c19] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[0px_0px_0px_#1b1c19] transition-none" 
                  onClick={() => setShowWalletModal(true)}
                >
                  <span>CONNECT WALLET</span>
                  <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
                </button>
                <a 
                  className="flex items-center gap-2 bg-surface-container-lowest text-on-surface px-6 py-4 border-2 border-on-surface font-code-md text-code-md uppercase tracking-wider font-medium shadow-[2px_2px_0px_#1b1c19] hover:bg-surface-container transition-none" 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noreferrer"
                >
                  <span>VIEW REPOSITORY &amp; DOCS</span>
                  <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                </a>
              </div>
            </div>
            <div className="hidden lg:block absolute right-12 bottom-12 opacity-10">
              <span className="font-headline-lg text-[180px] font-extrabold select-none">S</span>
            </div>
          </div>
        </section>
      </div>

      {/* MINIMAL FOOTER */}
      <footer className="border-t-2 border-on-surface bg-surface-container-low py-12 px-6 md:px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-6 h-6 bg-on-surface flex items-center justify-center text-surface font-headline-sm text-headline-sm font-bold">
                S
              </div>
              <span className="font-headline-sm text-headline-sm font-bold text-on-surface tracking-tight">SOVEREIGN PROTOCOL</span>
            </div>
            <p className="font-code-sm text-code-sm text-secondary">Deterministic covenant execution &amp; zero-knowledge policy enforcement.</p>
          </div>
          <div className="flex flex-wrap gap-8 font-code-sm text-code-sm uppercase tracking-wider text-on-surface">
            <a className="hover:text-primary transition-none" href="#overview">Specification</a>
            <a className="hover:text-primary transition-none" href="#architecture">Architecture</a>
            <a className="hover:text-primary transition-none" href="#lifecycle">Contracts</a>
            <a className="hover:text-primary transition-none" href="https://github.com" target="_blank" rel="noreferrer">GitHub</a>
            <a className="hover:text-primary transition-none" href="#privacy">Certora Audit</a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-surface-variant flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-code-sm text-outline">
          <span>© 2026 SOVEREIGN PROTOCOL FOUNDATION. ALL RIGHTS RESERVED.</span>
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-tertiary-container"></span>
            <span>NETWORK LATENCY: 22MS (SEPOLIA-ARC RELAY)</span>
          </div>
        </div>
      </footer>

      {/* INTERACTIVE WALLET CONNECTION MODAL */}
      {showWalletModal && (
        <div className="fixed inset-0 bg-on-surface/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest border-2 border-on-surface shadow-[6px_6px_0px_#1b1c19] w-full max-w-md p-6 relative">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b-2 border-on-surface pb-3 mb-5">
              <div>
                <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Connect Signer</h3>
                <p className="font-code-sm text-code-sm text-secondary">Authorized control plane access</p>
              </div>
              <button 
                className="w-8 h-8 border border-on-surface flex items-center justify-center hover:bg-surface-container-high transition-none" 
                onClick={() => setShowWalletModal(false)}
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            {/* Provider List */}
            <div className="space-y-3 font-code-sm text-code-sm mb-6">
              <button 
                className="w-full p-3.5 border-2 border-on-surface bg-surface-container-lowest hover:bg-surface-container-high flex items-center justify-between shadow-[2px_2px_0px_#1b1c19] active:translate-x-0.5 active:translate-y-0.5 transition-none text-left" 
                onClick={() => connectMockWallet('0x4F92...B9AC')}
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
                  <div>
                    <span className="font-bold text-on-surface block">MetaMask / Injected</span>
                    <span className="text-xs text-secondary">Browser extension signer</span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
              <button 
                className="w-full p-3.5 border-2 border-on-surface bg-surface-container-lowest hover:bg-surface-container-high flex items-center justify-between shadow-[2px_2px_0px_#1b1c19] active:translate-x-0.5 active:translate-y-0.5 transition-none text-left" 
                onClick={() => connectMockWallet('0x71c4...9E11')}
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">hub</span>
                  <div>
                    <span className="font-bold text-on-surface block">WalletConnect v2</span>
                    <span className="text-xs text-secondary">Mobile wallet bridge</span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
              <button 
                className="w-full p-3.5 border-2 border-on-surface bg-surface-container-lowest hover:bg-surface-container-high flex items-center justify-between shadow-[2px_2px_0px_#1b1c19] active:translate-x-0.5 active:translate-y-0.5 transition-none text-left" 
                onClick={() => connectMockWallet('0x88f2...00BA')}
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">terminal</span>
                  <div>
                    <span className="font-bold text-on-surface block">Enclave Hardware Key</span>
                    <span className="text-xs text-secondary">FIPS 140-2 Level 3 HSM</span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
            {/* Security Guarantee Note */}
            <div className="p-3 bg-surface-container border border-on-surface text-xs font-code-sm text-secondary flex items-start gap-2">
              <span className="material-symbols-outlined text-sm mt-0.5 text-primary">lock</span>
              <span>Sovereign never accesses or stores private policies unencrypted. All cryptographic bounds remain client-side.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

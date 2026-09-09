import { notFound } from "next/navigation";
import Link from "next/link";
import { AGREEMENTS } from "@/lib/mock-data";

export default function AgreementDetailPage({ params }: { params: { id: string } }) {
  const agreement = AGREEMENTS.find((a) => a.id === params.id) || AGREEMENTS[0];
  if (!agreement) notFound();

  const isCurrentStep = (step: number) => step === agreement.lifecyclePhase;
  const isPastStep = (step: number) => step < agreement.lifecyclePhase;

  return (
    <div className="space-y-unit-6">
      {/* Breadcrumbs & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-unit-4 pb-unit-2 border-b border-on-surface">
        <div className="flex items-center gap-unit-3">
          <h1 className="font-headline-lg text-headline-lg font-bold tracking-tight text-on-surface">
            Agreement #{agreement.id}
          </h1>
          <div className="px-unit-3 py-1 bg-[#E6F4EA] border border-on-surface flex items-center gap-1.5" style={{ boxShadow: "1px 1px 0px #1b1c19" }}>
            <span className="w-2 h-2 bg-emerald-600"></span>
            <span className="font-label-caps text-label-caps text-emerald-800 font-bold tracking-wider">[{agreement.status}]</span>
          </div>
        </div>
        <div className="flex items-center gap-unit-2 font-code-md text-code-md bg-surface-container-lowest border border-on-surface p-1 px-unit-3 neo-shadow">
          <span className="text-secondary text-xs uppercase font-label-caps">Treasury:</span>
          <span className="font-semibold text-primary">{agreement.partyA.name}</span>
          <span className="text-on-surface font-bold px-2">↔</span>
          <span className="text-secondary text-xs uppercase font-label-caps">Strategy:</span>
          <span className="font-semibold text-primary">{agreement.partyB.name}</span>
        </div>
      </div>

      {/* Financial Dominance Block */}
      <section className="bg-surface-container-lowest border-2 border-on-surface neo-shadow-lg">
        <div className="bg-surface-container border-b-2 border-on-surface px-unit-6 py-unit-2 flex items-center justify-between">
          <span className="font-label-caps text-label-caps uppercase tracking-widest text-on-surface font-bold">
            FINANCIAL POSITION SPECIFICATION // ARC ESCROW
          </span>
          <span className="font-code-sm text-code-sm text-secondary uppercase">TIMESTAMP: 2025-02-23 09:41 UTC</span>
        </div>
        <div className="p-unit-6 grid grid-cols-1 md:grid-cols-3 gap-unit-6 divide-y md:divide-y-0 md:divide-x divide-on-surface">
          <div className="flex flex-col gap-unit-1 md:pr-unit-6">
            <span className="font-label-caps text-label-caps uppercase tracking-widest text-secondary font-bold">COMMITTED PRINCIPAL</span>
            <div className="font-num-display text-num-display font-extrabold tracking-tight text-on-surface">
              ${agreement.principal.toLocaleString()}.00
            </div>
            <div className="inline-flex items-center gap-1.5 mt-unit-1">
              <span className="px-1.5 py-0.5 bg-surface-container border border-on-surface font-code-sm text-code-sm font-semibold">{agreement.principalAsset}</span>
              <span className="font-body-sm text-body-sm text-secondary">Verified Circle Native</span>
            </div>
          </div>
          <div className="flex flex-col gap-unit-1 md:px-unit-6">
            <span className="font-label-caps text-label-caps uppercase tracking-widest text-secondary font-bold">AGREED YIELD / EXPIRY</span>
            <div className="flex items-baseline gap-unit-3">
              <span className="font-num-display text-num-display font-extrabold tracking-tight text-tertiary">
                {agreement.yield.toFixed(2)}%
              </span>
              <span className="font-code-md text-code-md uppercase text-secondary font-bold">APR FIXED</span>
            </div>
            <div className="flex items-center gap-unit-2 mt-unit-1">
              <span className="px-2 py-0.5 bg-secondary-container border border-on-surface font-code-sm text-code-sm font-bold text-on-surface">
                {agreement.duration} DAYS REMAINING
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-unit-2 md:pl-unit-6">
            <span className="font-label-caps text-label-caps uppercase tracking-widest text-secondary font-bold">SETTLEMENT CHANNELS</span>
            <div className="flex flex-col gap-1.5">
              <div className="flex flex-col">
                <span className="font-code-sm text-code-sm text-secondary uppercase">SETTLEMENT CONTRACT</span>
                <span className="font-code-md text-code-md font-bold text-on-surface">{agreement.settlementContract}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-code-sm text-code-sm text-secondary uppercase">ESCROW CHANNEL</span>
                <span className="font-code-md text-code-md font-bold text-primary">{agreement.escrowChannel}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Protocol Lifecycle Stepper */}
      <section className="bg-surface-container-lowest border-2 border-on-surface neo-shadow-lg p-unit-6">
        <div className="flex items-center justify-between pb-unit-4 mb-unit-6 border-b-2 border-on-surface">
          <div className="flex items-center gap-unit-2">
            <span className="material-symbols-outlined text-primary">linear_scale</span>
            <h2 className="font-headline-sm text-headline-sm uppercase tracking-tight text-on-surface font-bold">
              PROTOCOL LIFECYCLE EXECUTION
            </h2>
          </div>
          <div className="font-code-sm text-code-sm uppercase bg-surface-container border border-on-surface px-unit-3 py-1 font-semibold text-secondary">
            STATE ENGINE // PHASE: 05_ACTIVE
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-unit-2">
          {[
            { id: 1, label: "INTENT", sub: "Confirmed" },
            { id: 2, label: "NEGOTIATION", sub: "Multi-Party OK" },
            { id: 3, label: "VALIDATION", sub: "ZK-Proof Valid" },
            { id: 4, label: "ESCROW", sub: "Capital Bound" },
            { id: 5, label: "ACTIVE", sub: "Yield Accruing" },
            { id: 6, label: "BREACH", sub: "Standby" },
            { id: 7, label: "UNWIND", sub: "Finality Gate" },
          ].map((node) => {
            const active = isCurrentStep(node.id);
            const past = isPastStep(node.id);
            return (
              <div
                key={node.id}
                className={`flex flex-col p-unit-3 border-2 ${
                  active
                    ? "border-on-surface bg-on-surface text-surface-container-lowest transform -translate-y-1 neo-shadow-blue"
                    : past
                    ? "border-on-surface bg-surface-container-high shadow-[1px_1px_0px_#1b1c19] text-on-surface"
                    : "border-outline bg-surface-container opacity-60 text-secondary"
                }`}
              >
                <div className="flex items-center justify-between mb-unit-2">
                  <span className={`font-label-caps text-label-caps font-bold ${active ? "text-primary-fixed" : "text-secondary"}`}>NODE 0{node.id}</span>
                  {active ? (
                    <span className="w-2 h-2 bg-tertiary-fixed animate-ping"></span>
                  ) : past ? (
                    <span className="material-symbols-outlined text-xs text-tertiary">check</span>
                  ) : (
                    <span className="material-symbols-outlined text-xs">circle</span>
                  )}
                </div>
                <span className={`font-code-md text-code-md font-bold ${active ? "text-surface-container-lowest" : ""}`}>{node.label}</span>
                <span className={`font-code-sm text-code-sm mt-1 ${active ? "text-surface-dim font-semibold" : ""}`}>{node.sub}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bento Grid (Verif / Health) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-unit-6">
        <section className="lg:col-span-8 bg-surface-container-lowest border-2 border-on-surface neo-shadow-lg flex flex-col justify-between">
          <div>
            <div className="bg-surface-container border-b-2 border-on-surface px-unit-6 py-unit-3 flex items-center justify-between">
              <div className="flex items-center gap-unit-2">
                <span className="material-symbols-outlined text-sm">verified_user</span>
                <span className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface font-bold">
                  CRYPTOGRAPHIC VERIFICATION & SETTLEMENT PROOF
                </span>
              </div>
              <span className="px-2 py-0.5 bg-surface-container-lowest border border-on-surface font-code-sm text-code-sm font-semibold">
                SNARK PLONK VERIFIED
              </span>
            </div>
            <div className="p-unit-6 flex flex-col gap-unit-5">
              <div className="flex items-center justify-between pb-unit-4 border-b border-surface-variant gap-unit-2">
                <div className="flex flex-col">
                  <span className="font-label-caps text-label-caps uppercase text-secondary font-bold">TERMS HASH (SHA-256 CANONICAL)</span>
                  <span className="font-code-md text-code-md font-semibold text-on-surface break-all">{agreement.termsHash}</span>
                </div>
              </div>
              <div className="flex items-center justify-between pb-unit-4 border-b border-surface-variant gap-unit-2">
                <div className="flex flex-col">
                  <span className="font-label-caps text-label-caps uppercase text-secondary font-bold">POLICY COMMITMENT ROOT</span>
                  <span className="font-code-md text-code-md font-semibold text-on-surface break-all">{agreement.policyCommitment}</span>
                </div>
                <div className="px-unit-3 py-1 bg-surface-container-low border border-on-surface font-label-caps text-label-caps uppercase font-bold text-secondary">
                  CONFIDENTIAL POLICY PROTECTED
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-unit-4">
                <div className="p-unit-4 bg-surface-container border border-on-surface flex flex-col gap-unit-1">
                  <span className="font-label-caps text-label-caps uppercase text-secondary font-bold">ZK POLICY VALIDATION</span>
                  <div className="flex items-center gap-unit-2">
                    <span className="material-symbols-outlined text-tertiary text-sm font-bold">check_circle</span>
                    <span className="font-code-sm text-code-sm font-bold text-on-surface">VERIFIED ON-CHAIN</span>
                  </div>
                </div>
                <div className="p-unit-4 bg-[#E6F4EA] border border-on-surface flex flex-col gap-unit-1">
                  <span className="font-label-caps text-label-caps uppercase text-emerald-800 font-bold">ARC ESCROW CAPITAL LOCK</span>
                  <div className="flex items-center gap-unit-2">
                    <span className="material-symbols-outlined text-emerald-800 text-sm font-bold">lock</span>
                    <span className="font-code-sm text-code-sm font-bold text-emerald-800">${agreement.principal.toLocaleString()} USDC CONFIRMED LOCKED</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="p-unit-6 bg-surface-container-low border-t-2 border-on-surface flex items-center gap-unit-4">
            <Link
              href="/monitoring"
              className="px-unit-6 py-unit-3 bg-primary-container text-on-primary border-2 border-on-surface font-code-md text-code-md uppercase font-bold neo-shadow neo-press hover:bg-primary flex items-center gap-2"
            >
              MONITOR POSITION RISK <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
            </Link>
          </div>
        </section>

        <div className="lg:col-span-4 flex flex-col gap-unit-6">
          <div className="bg-surface-container-lowest border-2 border-on-surface neo-shadow-lg p-unit-6 flex flex-col gap-unit-4">
            <div className="flex items-center justify-between border-b border-on-surface pb-unit-2">
              <span className="font-label-caps text-label-caps uppercase text-secondary font-bold">COLLATERAL RATIO</span>
              <span className="font-code-md text-code-md font-bold text-tertiary">142.5% // SAFE</span>
            </div>
            <div className="flex flex-col gap-unit-2">
              <div className="h-5 flex gap-1 bg-surface-container p-1 border border-on-surface">
                <div className="flex-1 bg-red-600"></div><div className="flex-1 bg-red-600"></div>
                <div className="flex-1 bg-amber-500"></div><div className="flex-1 bg-amber-500"></div>
                <div className="flex-1 bg-emerald-600"></div><div className="flex-1 bg-emerald-600"></div>
                <div className="flex-1 bg-emerald-600"></div><div className="flex-1 bg-surface-container-high"></div>
              </div>
              <div className="flex justify-between font-label-caps text-label-caps text-secondary uppercase font-bold text-[9px]">
                <span>100% MIN</span><span>120% WARN</span><span>150% TGT</span>
              </div>
            </div>
            <p className="font-body-sm text-body-sm text-secondary">
              Algorithmic liquidation triggers below 110.0%. Current barrier is $78,400 USDC.
            </p>
          </div>

          <div className="bg-surface-container border-2 border-dashed border-on-surface p-unit-5 flex flex-col gap-unit-3">
            <div className="flex items-center gap-unit-2">
              <span className="material-symbols-outlined text-base">fingerprint</span>
              <span className="font-label-caps text-label-caps uppercase font-bold text-on-surface">AUTHORIZATION SIGNATURE</span>
            </div>
            <div className="font-code-sm text-code-sm text-secondary flex flex-col gap-1 bg-surface-container-lowest p-unit-3 border border-on-surface">
              <div className="flex justify-between"><span>ROOT:</span><span className="font-semibold text-on-surface">{agreement.sigRoot}</span></div>
              <div className="flex justify-between"><span>MAX GAS:</span><span className="font-semibold text-on-surface">{agreement.maxGas}</span></div>
              <div className="flex justify-between"><span>BLOCK EXPIRY:</span><span className="font-semibold text-on-surface">{agreement.blockExpiry}</span></div>
            </div>
            <div className="w-full py-unit-2 px-unit-3 bg-surface-container-highest border border-on-surface flex items-center justify-between text-secondary font-label-caps text-label-caps font-bold">
              <span>SIGNATURE: VERIFIED ON HARDWARE</span>
              <span className="material-symbols-outlined text-xs text-tertiary">lock</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

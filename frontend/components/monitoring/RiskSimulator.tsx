"use client";

import { useState } from "react";
import { RISK_STEPS } from "@/lib/mock-data";

export default function RiskSimulator() {
  const [stepIndex, setStepIndex] = useState(0);
  const step = RISK_STEPS[stepIndex];

  const triggerNext = () => {
    if (stepIndex < RISK_STEPS.length - 1) setStepIndex((i) => i + 1);
  };
  const reset = () => setStepIndex(0);

  const barColors = [
    ["bg-emerald"],
    ["bg-emerald", "bg-emerald/80"],
    ["bg-amber", "bg-amber", "bg-amber"],
    ["bg-amber", "bg-amber", "bg-amber", "bg-amber/80"],
    ["bg-crimson", "bg-crimson", "bg-crimson", "bg-crimson", "bg-crimson animate-pulse"],
  ];
  const bars = barColors[stepIndex] ?? [];

  return (
    <div className="space-y-unit-6">
      {/* Risk Score + Gauge */}
      <div
        className="bg-surface-container-lowest border-2 border-on-surface p-unit-6 space-y-unit-4"
        style={{ boxShadow: "2px 2px 0px #1b1c19" }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-unit-2 border-b-2 border-on-surface pb-unit-3">
          <div>
            <div className="font-headline-sm text-headline-sm font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-base">speed</span>
              Observed market risk metric
            </div>
            <div className="font-code-sm text-code-sm text-secondary">
              Aggregated volatility index &amp; counterparty collateral ratio
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-label-caps text-label-caps text-secondary uppercase">Current risk score:</span>
            <span
              className={`font-num-headline text-num-headline font-bold ${step.breach ? "text-crimson" : "text-tertiary"}`}
            >
              {step.score}
            </span>
          </div>
        </div>

        {/* Segmented Health Gauge */}
        <div>
          <div className="h-6 w-full flex border-2 border-on-surface p-0.5 bg-surface-container gap-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`h-full flex-1 transition-all duration-300 ${bars[i] ?? "bg-surface-container-highest"}`}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs font-code-sm text-secondary mt-1">
            <span>1.8% (NORMAL)</span>
            <span>2.1%</span>
            <span>2.5%</span>
            <span>2.8%</span>
            <span>3.1% (CRITICAL)</span>
          </div>
        </div>

        {/* Privacy Publication Status Badge */}
        <div
          className={`p-unit-3 border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-unit-2 text-xs font-code-sm ${
            step.onChain
              ? "bg-crimson/10 border-crimson border-dashed"
              : "bg-surface-container border-dashed border-on-surface"
          }`}
        >
          <div className="flex items-center gap-unit-2">
            <span className={`material-symbols-outlined text-base ${step.onChain ? "text-crimson" : "text-primary"}`}>
              {step.onChain ? "cloud_upload" : "shield"}
            </span>
            {step.onChain ? (
              <span className="font-bold text-crimson">
                BREACH DETECTED — Submitting to DecisionSink on-chain
              </span>
            ) : (
              <span className="font-bold text-on-surface">Private TEE evaluation — not submitted on-chain</span>
            )}
          </div>
          <div className="text-secondary">
            {step.onChain ? (
              <>
                <span className="font-bold text-crimson uppercase">CHECK_BREACH, result=BREACHED</span>{" "}
                — First actionable decision. Enforcement cascade initiated.
              </>
            ) : (
              <>
                Threshold not crossed.{" "}
                <span className="font-bold text-on-surface underline">
                  Result discarded privately. No on-chain record created.
                </span>
              </>
            )}
          </div>
        </div>

        {/* Confidential threshold note */}
        <div className="p-unit-3 bg-surface-container border border-dashed border-on-surface flex items-center gap-unit-2 text-xs font-code-sm text-secondary">
          <span className="material-symbols-outlined text-sm text-secondary">info</span>
          <span>
            Exact threshold sealed in policy commitment.{" "}
            <span className="font-bold text-on-surface">
              Publishing SAFE results narrows the threshold interval for observers — this system discards them.
            </span>
          </span>
        </div>
      </div>

      {/* Simulation Control */}
      <div
        className="bg-surface-container-lowest border-2 border-on-surface p-unit-6"
        style={{ boxShadow: "2px 2px 0px #1b1c19" }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-unit-3 mb-unit-4">
          <div>
            <div className="font-headline-sm text-headline-sm font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-crimson">science</span>
              Protocol stress test // Simulation control plane
            </div>
            <div className="font-code-sm text-code-sm text-secondary">
              Step through market volatility to test autonomous private enforcement.
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-unit-2 font-code-sm text-xs">
              <span className="font-bold">Simulation state:</span>
              <span className="px-unit-2 py-1 bg-surface-container border border-on-surface font-bold text-on-surface">
                {step.label}
              </span>
            </div>
            {/* Chain publication indicator */}
            <div
              className={`px-unit-2 py-0.5 text-[10px] font-bold uppercase border font-code-sm ${
                step.onChain
                  ? "bg-crimson text-white border-crimson"
                  : "bg-surface-container text-secondary border-on-surface"
              }`}
            >
              {step.onChain ? "⬆ ON-CHAIN SUBMISSION" : "○ PRIVATE — NOT SUBMITTED"}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-unit-3">
          <button
            onClick={triggerNext}
            disabled={step.breach}
            className={`px-unit-6 py-unit-3 bg-primary-container text-on-primary font-code-md text-code-md font-bold uppercase tracking-wider border-2 border-on-surface flex items-center gap-2 neo-press ${
              step.breach ? "opacity-50 cursor-not-allowed" : "hover:bg-primary"
            }`}
            style={{ boxShadow: "2px 2px 0px #1b1c19" }}
          >
            <span className="material-symbols-outlined text-base">bolt</span>
            Trigger adverse risk event
          </button>
          <button
            onClick={reset}
            className="px-unit-4 py-unit-3 bg-surface-container-lowest text-on-surface font-code-md text-code-md font-bold uppercase border-2 border-on-surface hover:bg-surface-container neo-press"
            style={{ boxShadow: "2px 2px 0px #1b1c19" }}
          >
            Reset simulation
          </button>
          <span className="text-xs font-code-sm text-secondary">
            * CRE/TEE evaluates privately on each tick. Safe results are discarded. Only breach triggers an on-chain submission.
          </span>
        </div>
      </div>

      {/* Breach Panel */}
      {step.breach && (
        <div className="space-y-unit-6">
          {/* Breach Banner */}
          <div
            className="border-2 border-on-surface bg-crimson text-white p-unit-6"
            style={{ boxShadow: "4px 4px 0px #1b1c19" }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-unit-3">
              <div className="flex items-center gap-unit-4">
                <div className="w-12 h-12 bg-white text-crimson flex items-center justify-center font-bold text-2xl border-2 border-on-surface">
                  !
                </div>
                <div>
                  <div className="font-headline-lg text-headline-lg font-bold tracking-tight">
                    Breach verified // Private policy triggered
                  </div>
                  <div className="font-code-sm text-code-sm text-white/90">
                    Observed Risk (3.1%) exceeded confidential threshold encoded in Policy Commitment
                    0x71c4...9e11
                  </div>
                </div>
              </div>
              <div className="font-code-sm text-xs px-unit-3 py-1 bg-white text-crimson font-bold border border-on-surface uppercase">
                AUTONOMOUS UNWIND ENGAGED
              </div>
            </div>
          </div>

          {/* Breach-only submission note */}
          <div
            className="border-2 border-on-surface bg-surface-container-lowest p-unit-4 flex items-start gap-unit-3 font-code-sm text-code-sm"
            style={{ boxShadow: "2px 2px 0px #1b1c19" }}
          >
            <span className="material-symbols-outlined text-sm text-primary mt-0.5">info</span>
            <div>
              <div className="font-bold text-on-surface mb-1">
                Breach-only publication model — privacy design
              </div>
              <div className="text-secondary">
                The 4 preceding SAFE evaluations were computed privately inside the TEE and never
                submitted on-chain. An external observer sees only this single{" "}
                <span className="font-bold text-on-surface">CHECK_BREACH / result=BREACHED</span>{" "}
                entry in the public DecisionSink. This prevents the binary-search oracle narrowing
                attack. See{" "}
                <span className="font-bold text-on-surface">PRIVACY_LIMITATIONS.md</span> for
                the full threat model and residual leakage analysis.
              </div>
            </div>
          </div>

          {/* 4-Step Pipeline */}
          <div
            className="bg-surface-container-lowest border-2 border-on-surface p-unit-6"
            style={{ boxShadow: "2px 2px 0px #1b1c19" }}
          >
            <div className="font-headline-sm text-headline-sm font-bold text-on-surface mb-unit-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-tertiary">fact_check</span>
              Autonomous unwind pipeline // Verified steps
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-unit-4">
              {[
                { step: "STEP 01", title: "Private Policy Evaluated", desc: "Off-chain ZK evaluator computed delta exceeding commitment. Result: BREACHED." },
                { step: "STEP 02", title: "Recorded on Sepolia", desc: "Breach decision (CHECK_BREACH, result=false) registered on-chain at TX 0x71ab...c841. No SAFE results published." },
                { step: "STEP 03", title: "Relay Submitted", desc: "Cross-chain cryptographic message dispatched to Arc Escrow." },
                { step: "STEP 04", title: "Arc Escrow Unwind", desc: "Capital release sequence triggered back to Treasury safe." },
              ].map((item) => (
                <div key={item.step} className="p-unit-3 bg-surface-container border-2 border-on-surface">
                  <div className="flex items-center justify-between text-xs font-code-sm mb-1">
                    <span className="font-bold">{item.step}</span>
                    <span className="text-tertiary font-bold">✓ DONE</span>
                  </div>
                  <div className="font-bold text-sm text-on-surface">{item.title}</div>
                  <div className="text-xs font-code-sm text-secondary mt-1">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Cross-Chain Recovery */}
          <div
            className="bg-surface-container-lowest border-2 border-on-surface p-unit-6"
            style={{ boxShadow: "2px 2px 0px #1b1c19" }}
          >
            <div className="font-headline-sm text-headline-sm font-bold text-on-surface mb-unit-4">
              Cross-chain escrow recovery telemetry
            </div>
            <div className="flex flex-col md:flex-row items-stretch justify-between gap-unit-4">
              <div className="flex-1 p-unit-4 bg-surface-container border border-on-surface">
                <div className="font-label-caps text-label-caps text-secondary uppercase font-bold">Source chain</div>
                <div className="font-headline-sm text-headline-sm font-bold text-on-surface mt-1">Ethereum Sepolia</div>
                <div className="text-xs font-code-sm text-secondary mt-2">Breach Proof Hash:</div>
                <div className="text-xs font-code-sm font-bold truncate">0x71abcde49100fa12847120c8419</div>
                <div className="mt-2 text-xs font-code-sm text-tertiary font-bold">STATE: DECISION RECORDED</div>
              </div>
              <div className="flex flex-col items-center justify-center text-secondary px-unit-2">
                <span className="material-symbols-outlined text-2xl text-on-surface">east</span>
                <span className="font-code-sm text-[10px] font-bold uppercase">Cross-chain Relay</span>
              </div>
              <div className="flex-1 p-unit-4 bg-surface-container border border-on-surface">
                <div className="font-label-caps text-label-caps text-secondary uppercase font-bold">Destination escrow</div>
                <div className="font-headline-sm text-headline-sm font-bold text-on-surface mt-1">Arc Settlement Engine</div>
                <div className="text-xs font-code-sm text-secondary mt-2">Action Dispatched:</div>
                <div className="text-xs font-code-sm font-bold text-crimson">ESCROW_UNWIND_CONFIRMED</div>
                <div className="mt-2 text-xs font-code-sm text-tertiary font-bold">STATE: CAPITAL RETURNED</div>
              </div>
            </div>

            {/* Capital Protected */}
            <div
              className="mt-unit-6 p-unit-4 bg-surface-container border-2 border-on-surface flex flex-col sm:flex-row sm:items-center justify-between gap-unit-3"
              style={{ boxShadow: "2px 2px 0px #1b1c19" }}
            >
              <div>
                <div className="font-label-caps text-label-caps text-emerald uppercase font-bold">
                  Solvency preservation verified
                </div>
                <div className="font-headline-md text-headline-md font-bold text-on-surface">
                  $100,000.00 USDC RETURNED TO TREASURY
                </div>
                <div className="text-xs font-code-sm text-emerald mt-1">
                  0% Capital Loss incurred. Agreement #SOV-8F29 status moved to TERMINATED / FULLY PROTECTED.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

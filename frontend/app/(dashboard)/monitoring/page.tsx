import RiskSimulator from "@/components/monitoring/RiskSimulator";
import { ZK_RUNS } from "@/lib/mock-data";

export default function MonitoringPage() {
  return (
    <div className="space-y-unit-6">
      {/* Breadcrumbs & Context Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-unit-5 border-b-2 border-on-surface gap-unit-4">
        <div>
          <div className="flex items-center gap-unit-2 font-label-caps text-label-caps text-secondary mb-unit-1 uppercase">
            <span>AGREEMENTS</span><span>/</span>
            <span className="text-primary font-bold">SOV-8F29</span><span>/</span>
            <span className="text-on-surface font-bold">MONITORING</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg font-bold tracking-tight text-on-surface">
            Position Monitoring
          </h1>
          <p className="font-body-md text-body-md text-secondary mt-0.5">
            Live risk evaluation for active agreement <span className="font-code-md text-on-surface font-semibold">#SOV-8F29</span>
          </p>
        </div>
        <div className="flex items-center border-2 border-on-surface bg-surface-container-lowest p-unit-2 neo-shadow">
          <div className="flex items-center gap-unit-2 px-unit-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary-container"></span>
            <span className="font-code-sm text-code-sm font-semibold text-on-surface">alice.sovereign.eth</span>
          </div>
          <div className="px-unit-2 text-on-surface"><span className="material-symbols-outlined font-bold">swap_horiz</span></div>
          <div className="flex items-center gap-unit-2 px-unit-2">
            <span className="w-2.5 h-2.5 rounded-full bg-on-surface"></span>
            <span className="font-code-sm text-code-sm font-semibold text-on-surface">bob.sovereign.eth</span>
          </div>
        </div>
      </div>

      {/* Main Monitoring & Simulation Components (Client-side) */}
      <RiskSimulator />

      {/* ZK Audit Runs Table — On-Chain vs Private Distinction */}
      <section className="border-2 border-on-surface bg-surface-container-lowest neo-shadow">
        <div className="bg-surface-container px-unit-5 py-unit-3 border-b-2 border-on-surface flex flex-col gap-unit-2">
          <div className="flex items-center justify-between">
            <div className="font-headline-sm text-headline-sm font-bold text-on-surface flex items-center gap-unit-2">
              <span>EVALUATION RUNS</span>
              <span className="font-code-sm text-code-sm text-secondary font-normal">(LAST 3 OBSERVATIONS)</span>
            </div>
            <span className="font-label-caps text-label-caps font-mono bg-surface-container-lowest px-unit-2 py-1 border border-on-surface font-bold">ZK-SNARK AUDIT PASS</span>
          </div>
          {/* Breach-only publication notice */}
          <div className="flex items-start gap-unit-2 p-unit-2 bg-surface-container border border-dashed border-on-surface text-xs font-code-sm text-secondary">
            <span className="material-symbols-outlined text-sm text-primary mt-0.5">info</span>
            <span>
              <span className="font-bold text-on-surface">Breach-only publication model:</span>{" "}
              Only the breach decision ({" "}
              <span className="font-bold text-crimson">CHECK_BREACH, result=BREACHED</span>{" "}
              ) is written to the public DecisionSink on-chain. SAFE evaluations are computed privately
              inside the CRE/TEE enclave and discarded — they never appear in a public log.
              Rows marked{" "}
              <span className="font-bold text-on-surface">PRIVATE</span>{" "}
              below are from the CRE local audit trail only.
            </span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-high border-b-2 border-on-surface font-label-caps text-label-caps text-on-surface uppercase">
                <th className="py-unit-2 px-unit-4 border-r border-surface-container-highest">EPOCH / BLOCK</th>
                <th className="py-unit-2 px-unit-4 border-r border-surface-container-highest">ZK PROOF ROOT</th>
                <th className="py-unit-2 px-unit-4 border-r border-surface-container-highest">INPUT COMMITTED</th>
                <th className="py-unit-2 px-unit-4 border-r border-surface-container-highest">EVALUATOR VERDICT</th>
                <th className="py-unit-2 px-unit-4 border-r border-surface-container-highest text-right">DRIFT OBSERVED</th>
                <th className="py-unit-2 px-unit-4 text-right">PUBLICATION</th>
              </tr>
            </thead>
            <tbody className="font-code-md text-code-md divide-y divide-surface-container-highest">
              {ZK_RUNS.map((run, i) => (
                <tr key={i} className={`ledger-row ${run.onChain ? "bg-crimson/5" : ""}`}>
                  <td className="py-unit-3 px-unit-4 border-r border-surface-container-highest font-mono text-on-surface font-semibold">{run.block}</td>
                  <td className={`py-unit-3 px-unit-4 border-r border-surface-container-highest font-mono ${run.onChain ? "text-crimson" : "text-secondary"}`}>{run.proofRoot}</td>
                  <td className="py-unit-3 px-unit-4 border-r border-surface-container-highest text-secondary">{run.input}</td>
                  <td className="py-unit-3 px-unit-4 border-r border-surface-container-highest">
                    <span
                      className={`px-unit-2 py-0.5 border font-label-caps text-label-caps font-bold ${
                        run.onChain
                          ? "border-crimson bg-crimson/10 text-crimson"
                          : "border-on-surface bg-surface-container text-secondary"
                      }`}
                    >
                      {run.verdict}
                    </span>
                  </td>
                  <td className="py-unit-3 px-unit-4 border-r border-surface-container-highest text-right font-num-table text-num-table font-bold text-on-surface">{run.drift}</td>
                  <td className="py-unit-3 px-unit-4 text-right">
                    <span
                      className={`px-unit-2 py-0.5 border font-label-caps text-label-caps text-[9px] font-bold uppercase ${
                        run.onChain
                          ? "border-crimson bg-crimson text-white"
                          : "border-on-surface bg-surface-container text-secondary"
                      }`}
                    >
                      {run.onChain ? "⬆ ON-CHAIN" : "○ PRIVATE"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}


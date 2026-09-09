import Link from "next/link";
import StatusBadge from "@/components/ui/StatusBadge";
import { AGREEMENTS } from "@/lib/mock-data";

export default function AgreementsPage() {
  return (
    <div className="space-y-unit-6">
      {/* Header & Stats Strip */}
      <section className="flex flex-col md:flex-row md:items-end justify-between border-b-2 border-on-surface pb-unit-5 gap-unit-4">
        <div>
          <div className="flex items-center gap-unit-2 mb-unit-1">
            <span className="font-label-caps text-label-caps bg-on-surface text-surface-container-lowest px-unit-2 py-0.5 tracking-widest font-bold">
              CRYPTOGRAPHIC LEDGER
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight">
            Agreements
          </h1>
          <p className="font-body-md text-body-md text-secondary mt-1 max-w-2xl">
            Autonomous economic positions enforced by zero-knowledge policy boundaries.
          </p>
        </div>
        <div className="flex items-center gap-unit-3">
          <div className="border border-on-surface bg-surface-container-lowest px-unit-4 py-unit-2 flex flex-col items-center justify-center neo-shadow">
            <div className="font-label-caps text-label-caps text-secondary font-bold">TOTAL TVL</div>
            <div className="font-code-md text-code-md font-bold text-on-surface">$500,000.00</div>
          </div>
          <div className="border border-on-surface bg-surface-container-lowest px-unit-4 py-unit-2 flex flex-col items-center justify-center neo-shadow">
            <div className="font-label-caps text-label-caps text-secondary font-bold">ACTIVE POSITIONS</div>
            <div className="font-code-md text-code-md font-bold text-primary">01</div>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="bg-surface-container-lowest border-2 border-on-surface p-unit-4 neo-shadow flex flex-col lg:flex-row lg:items-center justify-between gap-unit-4">
        <div className="flex flex-wrap items-center gap-unit-2">
          <button className="px-unit-4 py-1.5 bg-on-surface text-surface-container-lowest font-label-caps text-label-caps font-bold border border-on-surface neo-press shadow-[2px_2px_0px_#1b1c19]">
            ALL COVENANTS
          </button>
          <button className="px-unit-4 py-1.5 bg-surface-container hover:bg-surface-container-high text-on-surface font-label-caps text-label-caps font-bold border border-on-surface neo-press shadow-[2px_2px_0px_#1b1c19]">
            ACTIVE (1)
          </button>
          <button className="px-unit-4 py-1.5 bg-surface-container hover:bg-surface-container-high text-on-surface font-label-caps text-label-caps font-bold border border-on-surface neo-press shadow-[2px_2px_0px_#1b1c19]">
            SETTLED (1)
          </button>
          <button className="px-unit-4 py-1.5 bg-red-100 text-red-700 hover:bg-red-200 font-label-caps text-label-caps font-bold border border-on-surface neo-press shadow-[2px_2px_0px_#1b1c19] flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
            BREACHED (1)
          </button>
        </div>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-unit-3 flex items-center pointer-events-none text-secondary">
            <span className="material-symbols-outlined text-base">search</span>
          </span>
          <input
            className="w-full lg:w-64 pl-unit-10 pr-unit-4 py-unit-2 bg-surface-container-lowest border border-on-surface font-code-sm text-code-sm placeholder:text-secondary focus:outline-none focus:border-primary transition-none"
            placeholder="Search by ID, Hash, or Address..."
            type="text"
          />
        </div>
      </section>

      {/* Ledger Table */}
      <section className="bg-surface-container-lowest border-2 border-on-surface neo-shadow-lg overflow-x-auto">
        <div className="bg-surface-container-high border-b-2 border-on-surface px-unit-4 py-unit-2 flex items-center justify-between font-label-caps text-label-caps">
          <div className="flex items-center gap-2 font-bold text-on-surface">
            <span>TABLE VIEW:</span>
            <span className="text-secondary">INSTITUTIONAL PROTOCOL LEDGER</span>
          </div>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container border-b-2 border-on-surface font-label-caps text-label-caps uppercase text-secondary">
              <th className="py-unit-3 px-unit-4 font-bold border-r border-surface-container-highest">Agreement ID</th>
              <th className="py-unit-3 px-unit-4 font-bold border-r border-surface-container-highest">Counterparty</th>
              <th className="py-unit-3 px-unit-4 font-bold border-r border-surface-container-highest">Capital (USDC)</th>
              <th className="py-unit-3 px-unit-4 font-bold border-r border-surface-container-highest">Yield / Risk</th>
              <th className="py-unit-3 px-unit-4 font-bold border-r border-surface-container-highest text-center">Status</th>
              <th className="py-unit-3 px-unit-4 font-bold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container-highest font-body-sm text-body-sm">
            {AGREEMENTS.map((agreement) => (
              <tr key={agreement.id} className="ledger-row">
                <td className="py-unit-3 px-unit-4 border-r border-surface-container-highest">
                  <div className="font-code-md text-code-md font-bold text-on-surface">{agreement.id}</div>
                  <div className="font-label-caps text-label-caps text-secondary mt-1">{agreement.type}</div>
                </td>
                <td className="py-unit-3 px-unit-4 border-r border-surface-container-highest">
                  <div className="font-code-sm text-code-sm font-semibold text-primary">{agreement.partyB.name}</div>
                  <div className="font-label-caps text-label-caps text-secondary mt-1">HASH: {agreement.partyB.strategyHash}</div>
                </td>
                <td className="py-unit-3 px-unit-4 border-r border-surface-container-highest">
                  <div className="font-num-table text-num-table font-bold text-on-surface">
                    ${agreement.principal.toLocaleString()}.00
                  </div>
                  <div className="font-label-caps text-label-caps text-secondary mt-1">DURATION: {agreement.duration}D</div>
                </td>
                <td className="py-unit-3 px-unit-4 border-r border-surface-container-highest">
                  <div className="font-code-md text-code-md font-bold text-tertiary">{agreement.yield.toFixed(2)}% APR</div>
                  <div className={`font-label-caps text-label-caps mt-1 font-bold ${agreement.status === "UNWOUND" ? "text-red-600" : "text-secondary"}`}>
                    RISK: {agreement.riskScore.toFixed(1)}%
                  </div>
                </td>
                <td className="py-unit-3 px-unit-4 border-r border-surface-container-highest text-center">
                  <StatusBadge status={agreement.status} />
                </td>
                <td className="py-unit-3 px-unit-4 text-right">
                  <Link
                    href={`/agreements/${agreement.id}`}
                    className="inline-flex items-center gap-1 font-code-sm text-code-sm font-bold text-on-surface border border-on-surface px-unit-3 py-1 bg-surface-container-lowest hover:bg-surface-container neo-shadow-sm neo-press"
                  >
                    INSPECT <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

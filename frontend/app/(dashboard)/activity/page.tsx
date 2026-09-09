import Link from "next/link";
import StatusBadge from "@/components/ui/StatusBadge";
import { ACTIVITY_EVENTS } from "@/lib/mock-data";

export default function ActivityPage() {
  return (
    <div className="space-y-unit-6">
      {/* Header & Metrics Strip */}
      <section className="flex flex-col md:flex-row md:items-end justify-between border-b-2 border-on-surface pb-unit-5 gap-unit-4">
        <div>
          <div className="flex items-center gap-unit-2 mb-unit-1">
            <span className="font-label-caps text-label-caps bg-on-surface text-surface-container-lowest px-unit-2 py-0.5 tracking-widest font-bold">
              SYSTEM OBSERVABILITY
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight">
            Unified Activity Ledger
          </h1>
          <p className="font-body-md text-body-md text-secondary mt-1">
            Chronological audit trail of all machine-driven economic events.
          </p>
        </div>
        <div className="flex items-center gap-unit-3">
          <div className="border border-on-surface bg-surface-container-lowest px-unit-4 py-unit-2 flex flex-col items-center justify-center neo-shadow">
            <div className="font-label-caps text-label-caps text-secondary font-bold">EVENTS (24H)</div>
            <div className="font-code-md text-code-md font-bold text-on-surface">1,492</div>
          </div>
          <div className="border border-on-surface bg-surface-container-lowest px-unit-4 py-unit-2 flex flex-col items-center justify-center neo-shadow">
            <div className="font-label-caps text-label-caps text-secondary font-bold">AVG ZK PROOF TIME</div>
            <div className="font-code-md text-code-md font-bold text-primary">480ms</div>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="bg-surface-container-lowest border-2 border-on-surface p-unit-4 neo-shadow flex flex-col lg:flex-row lg:items-center justify-between gap-unit-4">
        <div className="flex flex-wrap items-center gap-unit-2">
          <button className="px-unit-4 py-1.5 bg-on-surface text-surface-container-lowest font-label-caps text-label-caps font-bold border border-on-surface neo-press shadow-[2px_2px_0px_#1b1c19]">
            ALL EVENTS
          </button>
          <button className="px-unit-4 py-1.5 bg-surface-container hover:bg-surface-container-high text-on-surface font-label-caps text-label-caps font-bold border border-on-surface neo-press shadow-[2px_2px_0px_#1b1c19] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span> SEPOLIA L1
          </button>
          <button className="px-unit-4 py-1.5 bg-surface-container hover:bg-surface-container-high text-on-surface font-label-caps text-label-caps font-bold border border-on-surface neo-press shadow-[2px_2px_0px_#1b1c19] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span> ARC ESCROW
          </button>
          <button className="px-unit-4 py-1.5 bg-surface-container hover:bg-surface-container-high text-on-surface font-label-caps text-label-caps font-bold border border-on-surface neo-press shadow-[2px_2px_0px_#1b1c19] flex items-center gap-1 text-red-600">
            <span className="material-symbols-outlined text-[12px]">warning</span> BREACH EVENTS
          </button>
        </div>
      </section>

      {/* Cross-Chain Activity Table */}
      <section className="bg-surface-container-lowest border-2 border-on-surface neo-shadow-lg overflow-x-auto">
        <div className="bg-surface-container-high border-b-2 border-on-surface px-unit-4 py-unit-2 flex items-center justify-between font-label-caps text-label-caps">
          <div className="flex items-center gap-2 font-bold text-on-surface">
            <span>TABLE VIEW:</span>
            <span className="text-secondary">CROSS-CHAIN EXECUTION LOG</span>
          </div>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container border-b-2 border-on-surface font-label-caps text-label-caps uppercase text-secondary">
              <th className="py-unit-3 px-unit-4 font-bold border-r border-surface-container-highest">Timestamp / Chain</th>
              <th className="py-unit-3 px-unit-4 font-bold border-r border-surface-container-highest">Agreement Ref</th>
              <th className="py-unit-3 px-unit-4 font-bold border-r border-surface-container-highest">Event Description</th>
              <th className="py-unit-3 px-unit-4 font-bold border-r border-surface-container-highest text-center">Status</th>
              <th className="py-unit-3 px-unit-4 font-bold text-right">Transaction Hash</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container-highest font-body-sm text-body-sm">
            {ACTIVITY_EVENTS.map((evt) => (
              <tr key={evt.id} className="ledger-row">
                <td className="py-unit-3 px-unit-4 border-r border-surface-container-highest">
                  <div className="font-code-md text-code-md font-semibold text-on-surface">{evt.time}</div>
                  <div className="font-label-caps text-label-caps text-secondary mt-1">{evt.chain}</div>
                </td>
                <td className="py-unit-3 px-unit-4 border-r border-surface-container-highest">
                  <Link href={`/agreements/${evt.agreement.replace('#', '')}`} className="font-code-sm text-code-sm font-bold text-primary hover:underline">
                    {evt.agreement}
                  </Link>
                </td>
                <td className="py-unit-3 px-unit-4 border-r border-surface-container-highest">
                  <div className={`font-body-sm text-body-sm font-bold ${evt.isBreach ? "text-red-600 flex items-center gap-1" : "text-on-surface"}`}>
                    {evt.isBreach && <span className="material-symbols-outlined text-sm">warning</span>}
                    {evt.event}
                  </div>
                </td>
                <td className="py-unit-3 px-unit-4 border-r border-surface-container-highest text-center">
                  <StatusBadge status={evt.status} />
                </td>
                <td className="py-unit-3 px-unit-4 text-right">
                  <div className="font-code-sm text-code-sm text-secondary bg-surface-container-high border border-on-surface px-unit-2 py-0.5 inline-block">
                    {evt.txHash}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Log Footer */}
      <div className="flex items-center justify-between text-xs font-code-sm text-secondary bg-surface-container-low border border-on-surface p-unit-3">
        <span>Displaying last 8 verification events. Real-time websocket connected.</span>
        <div className="flex items-center gap-unit-2">
          <span className="material-symbols-outlined text-[14px]">lock</span>
          <span>End-to-End Cryptographically Proven</span>
        </div>
      </div>
    </div>
  );
}

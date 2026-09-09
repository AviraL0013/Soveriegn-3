import Link from "next/link";

export default function CreateIntentPage() {
  return (
    <div className="space-y-unit-6">
      {/* Page Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between border-b-2 border-on-surface pb-unit-5 gap-unit-4">
        <div>
          <div className="flex items-center gap-unit-2 mb-unit-1">
            <span className="font-label-caps text-label-caps bg-on-surface text-surface-container-lowest px-unit-2 py-0.5 tracking-widest">
              DEPLOYMENT MODULE
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight">
            Create Intent
          </h1>
          <p className="font-body-md text-body-md text-secondary mt-1">
            Specify public economic parameters and define confidential policy boundaries for machine agents.
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-unit-6">
        {/* Public Intent Block */}
        <section className="lg:col-span-8 flex flex-col gap-unit-6">
          <div className="bg-surface-container-lowest border-2 border-on-surface neo-shadow-lg p-unit-6 space-y-unit-6">
            <div className="flex items-center justify-between border-b-2 border-on-surface pb-unit-4">
              <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface flex items-center gap-unit-2 uppercase">
                <span className="material-symbols-outlined">public</span>
                Public Intent Parameters
              </h2>
              <span className="font-label-caps text-label-caps font-bold px-unit-2 py-1 bg-surface-container border border-on-surface">VISIBLE ON-CHAIN</span>
            </div>

            <div className="space-y-unit-4">
              <div>
                <label className="block font-label-caps text-label-caps font-bold text-on-surface uppercase mb-unit-2">Agreement Type</label>
                <div className="flex gap-unit-3">
                  <button className="flex-1 px-unit-4 py-unit-3 border-2 border-on-surface bg-surface-container-low text-on-surface font-code-md text-code-md font-bold neo-shadow shadow-[2px_2px_0px_#1b1c19] text-left">
                    <span className="block mb-1">YIELD VAULT</span>
                    <span className="font-code-sm text-code-sm text-secondary font-normal uppercase">Lending & Borrowing</span>
                  </button>
                  <button className="flex-1 px-unit-4 py-unit-3 border-2 border-on-surface bg-on-surface text-surface-container-lowest font-code-md text-code-md font-bold neo-shadow-blue transform -translate-y-1 text-left">
                    <span className="block mb-1">COLLATERALIZED LOAN</span>
                    <span className="font-code-sm text-code-sm text-surface-dim font-normal uppercase">Delta-Neutral Peg</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-unit-4">
                <div>
                  <label className="block font-label-caps text-label-caps font-bold text-on-surface uppercase mb-unit-2">Principal Asset</label>
                  <select className="w-full px-unit-4 py-unit-3 border-2 border-on-surface bg-surface-container-lowest font-code-md text-code-md appearance-none focus:outline-none focus:border-primary shadow-[2px_2px_0px_#1b1c19]">
                    <option>USDC (Circle Native)</option>
                    <option>USDT (Tether)</option>
                    <option>DAI (Maker)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-label-caps text-label-caps font-bold text-on-surface uppercase mb-unit-2">Principal Amount</label>
                  <div className="relative">
                    <span className="absolute left-unit-4 top-1/2 -translate-y-1/2 font-code-md text-code-md text-secondary">$</span>
                    <input type="number" defaultValue="100000" className="w-full pl-unit-8 pr-unit-4 py-unit-3 border-2 border-on-surface bg-surface-container-lowest font-code-md text-code-md font-bold shadow-[2px_2px_0px_#1b1c19] focus:outline-none focus:border-primary" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-unit-4">
                <div>
                  <label className="block font-label-caps text-label-caps font-bold text-on-surface uppercase mb-unit-2">Target Yield Rate (APR)</label>
                  <div className="relative">
                    <input type="number" defaultValue="8.4" step="0.1" className="w-full px-unit-4 py-unit-3 border-2 border-on-surface bg-surface-container-lowest font-code-md text-code-md font-bold shadow-[2px_2px_0px_#1b1c19] focus:outline-none focus:border-primary" />
                    <span className="absolute right-unit-4 top-1/2 -translate-y-1/2 font-code-md text-code-md text-secondary">%</span>
                  </div>
                </div>
                <div>
                  <label className="block font-label-caps text-label-caps font-bold text-on-surface uppercase mb-unit-2">Escrow Duration</label>
                  <div className="relative">
                    <input type="number" defaultValue="25" className="w-full px-unit-4 py-unit-3 border-2 border-on-surface bg-surface-container-lowest font-code-md text-code-md font-bold shadow-[2px_2px_0px_#1b1c19] focus:outline-none focus:border-primary" />
                    <span className="absolute right-unit-4 top-1/2 -translate-y-1/2 font-code-sm text-code-sm text-secondary uppercase">Days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Confidential Policy Block */}
        <section className="lg:col-span-4 flex flex-col gap-unit-6">
          <div className="bg-surface-container-lowest border-2 border-dashed border-on-surface p-unit-6 space-y-unit-5 h-full relative">
            <div className="flex items-center justify-between border-b border-on-surface pb-unit-4">
              <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface flex items-center gap-unit-2 uppercase">
                <span className="material-symbols-outlined text-primary">shield_locked</span>
                Private Policy
              </h2>
            </div>
            <p className="font-body-sm text-body-sm text-secondary bg-surface-container p-unit-3 border border-on-surface">
              These bounds are cryptographically hashed. The exact limits remain completely confidential until a breach proof is submitted on-chain.
            </p>

            <div className="space-y-unit-4 pt-unit-2">
              <div>
                <label className="block font-label-caps text-label-caps font-bold text-on-surface uppercase mb-unit-2 text-primary">Max Allowable Risk Drift</label>
                <div className="relative">
                  <input type="number" defaultValue="3.1" step="0.1" className="w-full px-unit-3 py-unit-2 border-2 border-on-surface bg-[#F9F9F6] font-code-md text-code-md font-bold shadow-[2px_2px_0px_#1b1c19] focus:outline-none focus:border-primary" />
                  <span className="absolute right-unit-3 top-1/2 -translate-y-1/2 font-code-md text-code-md text-secondary">%</span>
                </div>
              </div>
              <div>
                <label className="block font-label-caps text-label-caps font-bold text-on-surface uppercase mb-unit-2 text-primary">Liquidation Barrier</label>
                <div className="relative">
                  <span className="absolute left-unit-3 top-1/2 -translate-y-1/2 font-code-md text-code-md text-secondary">$</span>
                  <input type="number" defaultValue="78400" className="w-full pl-unit-6 pr-unit-3 py-unit-2 border-2 border-on-surface bg-[#F9F9F6] font-code-md text-code-md font-bold shadow-[2px_2px_0px_#1b1c19] focus:outline-none focus:border-primary" />
                </div>
              </div>
              <div className="mt-unit-4 pt-unit-4 border-t border-surface-container-highest">
                <div className="font-label-caps text-label-caps text-secondary mb-1 uppercase">Computed Commitment Hash</div>
                <div className="font-code-sm text-code-sm text-secondary bg-surface-container p-2 border border-on-surface break-all">
                  0x71c4801fbde9e11504936d8193aef49204bc99
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Action Footer */}
      <section className="bg-surface-container-lowest border-2 border-on-surface p-unit-6 neo-shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-unit-6">
        <div className="flex items-center gap-unit-3 font-code-sm text-code-sm text-secondary max-w-lg">
          <span className="material-symbols-outlined text-[24px]">verified</span>
          <span>By deploying this intent, your authorized agents will begin parallel execution and automated negotiation under the bound policy conditions.</span>
        </div>
        <div className="flex items-center gap-unit-4">
          <button className="px-unit-6 py-unit-3 bg-surface-container hover:bg-surface-container-high border-2 border-on-surface text-on-surface font-code-md text-code-md font-bold uppercase neo-press shadow-[2px_2px_0px_#1b1c19]">
            Save Draft
          </button>
          <Link href="/agreements" className="px-unit-6 py-unit-3 bg-primary-container hover:bg-primary border-2 border-on-surface text-on-primary font-code-md text-code-md font-bold uppercase neo-press shadow-[2px_2px_0px_#1b1c19] flex items-center gap-unit-2">
            Sign & Deploy Intent <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default function TopBar() {
  return (
    <header
      className="fixed top-0 left-0 lg:left-64 right-0 h-14 bg-surface-container-low border-b-2 border-on-surface flex items-center justify-between pl-16 pr-6 lg:px-unit-6 z-30"
      style={{ boxShadow: "0px 2px 0px #1b1c19" }}
    >
      <div className="flex items-center gap-unit-4">
        <div className="font-label-caps text-label-caps text-on-surface font-bold uppercase tracking-widest flex items-center gap-unit-2 hidden sm:flex">
          <span className="w-2 h-2 bg-tertiary inline-block"></span>
          Control Plane // v2.4
        </div>
        <div className="h-4 w-px bg-outline-variant hidden sm:block"></div>
        <div className="font-code-sm text-code-sm text-secondary flex items-center gap-unit-2">
          <span className="hidden md:inline">Sovereign Private Policy VM</span>
          <span className="px-unit-2 py-0.5 bg-surface-container-high text-on-surface font-semibold border border-on-surface text-[10px]">
            VERIFIED ZERO-KNOWLEDGE
          </span>
        </div>
      </div>

      <div className="flex items-center gap-unit-4">
        <div className="flex items-center gap-unit-2 font-code-sm text-code-sm hidden md:flex">
          <span
            className="px-unit-2 py-1 bg-surface-container-lowest border border-on-surface font-bold flex items-center gap-1"
            style={{ boxShadow: "1px 1px 0px #1b1c19" }}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            SEPOLIA
          </span>
          <span
            className="px-unit-2 py-1 bg-surface-container-lowest border border-on-surface font-bold flex items-center gap-1"
            style={{ boxShadow: "1px 1px 0px #1b1c19" }}
          >
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            ARC ESCROW
          </span>
        </div>

        <div className="flex items-center gap-unit-2">
          <button
            aria-label="Block Lock State"
            className="w-8 h-8 flex items-center justify-center border border-on-surface bg-surface-container-lowest hover:bg-surface-container neo-press"
            style={{ boxShadow: "1px 1px 0px #1b1c19" }}
            title="Block Lock State"
          >
            <span className="material-symbols-outlined text-sm">lock</span>
          </button>
          <button
            aria-label="Sync Telemetry"
            className="w-8 h-8 flex items-center justify-center border border-on-surface bg-surface-container-lowest hover:bg-surface-container neo-press"
            style={{ boxShadow: "1px 1px 0px #1b1c19" }}
            title="Sync Telemetry"
          >
            <span className="material-symbols-outlined text-sm">sync</span>
          </button>
        </div>

        <div
          className="flex items-center gap-unit-2 border-2 border-on-surface bg-on-surface text-surface-container-lowest px-unit-3 py-1 font-code-sm text-code-sm font-bold"
          style={{ boxShadow: "2px 2px 0px #1b1c19" }}
        >
          <span>0x4F92...B9AC</span>
        </div>
      </div>
    </header>
  );
}

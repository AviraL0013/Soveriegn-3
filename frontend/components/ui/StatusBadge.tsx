type StatusType = "ACTIVE" | "SETTLED" | "UNWOUND" | "PENDING" | "CONFIRMED" | "FINALIZED" | "LOCKED" | "SIGNED" | "COMMITTED" | "VERIFIED" | "INITIALIZED";

interface StatusBadgeProps {
  status: StatusType | string;
  size?: "sm" | "md";
}

const STATUS_CONFIG: Record<string, { bg: string; text: string; icon?: string }> = {
  ACTIVE: { bg: "#E6F4EA", text: "#00875A", icon: "check_circle" },
  SETTLED: { bg: "#ECEAE2", text: "#1b1c19", icon: "remove" },
  UNWOUND: { bg: "#FEE2E2", text: "#DC2626", icon: "cancel" },
  PENDING: { bg: "#FEF3C7", text: "#B45309", icon: "hourglass_empty" },
  CONFIRMED: { bg: "#E6F4EA", text: "#00875A", icon: "check" },
  FINALIZED: { bg: "#ECEAE2", text: "#1b1c19", icon: "done_all" },
  LOCKED: { bg: "#FEF3C7", text: "#B45309", icon: "lock" },
  SIGNED: { bg: "#dee0ff", text: "#00105b", icon: "edit_document" },
  COMMITTED: { bg: "#ECEAE2", text: "#1b1c19", icon: "save" },
  VERIFIED: { bg: "#E6F4EA", text: "#00875A", icon: "verified" },
  INITIALIZED: { bg: "#E6F4EA", text: "#00875A", icon: "play_arrow" },
  DEFAULT: { bg: "#ECEAE2", text: "#1b1c19", icon: "info" },
};

export default function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.DEFAULT;
  const padding = size === "md" ? "px-3 py-1" : "px-2 py-0.5";

  return (
    <span
      className={`inline-flex items-center gap-1.5 ${padding} border border-on-surface font-label-caps text-label-caps font-bold`}
      style={{ backgroundColor: config.bg, color: config.text }}
    >
      {config.icon && (
        <span
          className="material-symbols-outlined"
          style={{ fontSize: size === "md" ? "14px" : "12px" }}
        >
          {config.icon}
        </span>
      )}
      {status}
    </span>
  );
}

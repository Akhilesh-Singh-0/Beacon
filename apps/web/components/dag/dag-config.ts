export type NodeStatus =
  | "PENDING"
  | "RUNNING"
  | "SUCCESS"
  | "ERROR"
  | "STUCK";

export type DagNodeData = {
  name: string;
  status: NodeStatus;
  duration?: string;
};

export type DagEdgeData = {
  status: NodeStatus;
  isBranch: boolean;
};

export const DAG_LAYOUT = {
  nodeWidth: 250,
  nodeHeight: 96,
  rankGap: 96,
  rowGap: 52,
} as const;

export const DAG_CANVAS = {
  surface: "#0a0a0a",

  background: {
    color: "#1a1a1f",
    gap: 24,
    size: 1,
  },

  zoom: {
    min: 0.3,
    max: 2.2,
    fitPadding: 0.12,
  },
} as const;

export const DAG_NODE = {
  width: 250,
  height: 96,

  paddingX: 24,
  paddingY: 18,

  background: "#0d0d10",

  borderRadius: 14,

  baseBorder:
    "rgba(255,255,255,0.08)",

  selectedBorder:
    "rgba(167,139,250,0.88)",

  shadow:
    "0 12px 32px rgba(0,0,0,0.28)",

  selectedShadow:
    "0 0 28px rgba(139,92,246,0.13)",

  topHighlight:
    "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",

  bottomGlow:
    "linear-gradient(90deg, transparent, rgba(139,92,246,0.11), transparent)",
} as const;

export const DAG_EDGE = {
  color: "#8B7CFF",
  activeColor: "#B19CFF",

  baseWidth: 1.35,
  activeWidth: 1.8,

  baseOpacity: 0.82,
  activeOpacity: 1,

  arrowSize: 6.2,

  branchLength: 42,
  borderRadius: 14,
  offset: 20,

  animationDuration: "1.3s",

  baseGlow:
    "drop-shadow(0 0 3px rgba(139,124,255,0.18))",

  activeGlow:
    "drop-shadow(0 0 6px rgba(177,156,255,0.52))",
} as const;

type StatusVisualConfig = {
  label: string;
  indicator: string;
  border: string;
  surface: string;
  glow: string;

  edge: {
    color: string;
    width: number;
    animated: boolean;
    glow: string;
  };
};

export const DAG_STATUS_CONFIG: Record<
  NodeStatus,
  StatusVisualConfig
> = {
  PENDING: {
    label: "Pending",
    indicator: "bg-zinc-500",

    border:
      "rgba(113,113,122,0.45)",

    surface:
      "radial-gradient(circle at 15% 12%, rgba(113,113,122,0.08), transparent 48%), linear-gradient(135deg, rgba(255,255,255,0.018), rgba(13,13,16,0.98) 62%)",

    glow:
      "shadow-[0_12px_32px_rgba(0,0,0,0.28)]",

    edge: {
      color: DAG_EDGE.color,
      width: DAG_EDGE.baseWidth,
      animated: false,
      glow: DAG_EDGE.baseGlow,
    },
  },

  RUNNING: {
    label: "Running",
    indicator: "bg-blue-400",

    border:
      "rgba(96,165,250,0.62)",

    surface:
      "radial-gradient(circle at 15% 12%, rgba(59,130,246,0.14), transparent 52%), linear-gradient(135deg, rgba(255,255,255,0.02), rgba(13,13,16,0.98) 62%)",

    glow:
      "shadow-[0_0_28px_rgba(59,130,246,0.10)]",

    edge: {
      color: DAG_EDGE.activeColor,
      width: DAG_EDGE.activeWidth,
      animated: true,
      glow: DAG_EDGE.activeGlow,
    },
  },

  SUCCESS: {
    label: "Success",
    indicator: "bg-emerald-400",

    border:
      "rgba(52,211,153,0.54)",

    surface:
      "radial-gradient(circle at 15% 12%, rgba(16,185,129,0.12), transparent 52%), linear-gradient(135deg, rgba(255,255,255,0.018), rgba(13,13,16,0.98) 62%)",

    glow:
      "shadow-[0_12px_32px_rgba(0,0,0,0.28)]",

    edge: {
      color: DAG_EDGE.color,
      width: DAG_EDGE.baseWidth,
      animated: false,
      glow: DAG_EDGE.baseGlow,
    },
  },

  ERROR: {
    label: "Error",
    indicator: "bg-red-400",

    border:
      "rgba(248,113,113,0.68)",

    surface:
      "radial-gradient(circle at 15% 12%, rgba(239,68,68,0.13), transparent 52%), linear-gradient(135deg, rgba(255,255,255,0.018), rgba(13,13,16,0.98) 62%)",

    glow:
      "shadow-[0_0_28px_rgba(239,68,68,0.10)]",

    edge: {
      color: DAG_EDGE.color,
      width: DAG_EDGE.baseWidth,
      animated: false,
      glow: DAG_EDGE.baseGlow,
    },
  },

  STUCK: {
    label: "Stuck",
    indicator: "bg-amber-400",

    border:
      "rgba(251,191,36,0.68)",

    surface:
      "radial-gradient(circle at 15% 12%, rgba(245,158,11,0.13), transparent 52%), linear-gradient(135deg, rgba(255,255,255,0.018), rgba(13,13,16,0.98) 62%)",

    glow:
      "shadow-[0_0_28px_rgba(245,158,11,0.10)]",

    edge: {
      color: DAG_EDGE.color,
      width: DAG_EDGE.baseWidth,
      animated: false,
      glow: DAG_EDGE.baseGlow,
    },
  },
};
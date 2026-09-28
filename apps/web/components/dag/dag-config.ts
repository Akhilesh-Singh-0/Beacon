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
  startTime?: string;
  endTime?: string | number | Date | null;
  totalTokens?: number | null;
};

export type DagEdgeData = {
  status: NodeStatus;
  isBranch: boolean;
};

export const DAG_LAYOUT = {
  nodeWidth: 210,
  nodeHeight: 86,
  rankGap: 72,
  rowGap: 28,
} as const;

export const DAG_CANVAS = {
  surface: "#08111A",

  background: {
    color:
      "rgba(96,165,250,0.12)",
    gap: 36,
    size: 1.15,
  },

  zoom: {
    min: 0.2,
    max: 1.9,
  },
} as const;

export const DAG_NODE = {
  width: 210,
  height: 86,

  paddingX: 20,
  paddingY: 16,

  background:
    "var(--app-surface)",

  borderRadius: 13,

  baseBorder:
    "var(--app-border)",

  selectedBorder:
    "rgba(96,165,250,0.92)",

  shadow:
    "0 18px 42px var(--app-shadow)",

  selectedShadow:
    "0 0 32px rgba(96,165,250,0.18), 0 18px 42px var(--app-shadow)",

  topHighlight:
    "linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent)",

  bottomGlow:
    "linear-gradient(90deg, transparent, rgba(96,165,250,0.12), transparent)",
} as const;

export const DAG_EDGE = {
  color: "#6675A8",
  activeColor: "#78A5F5",

  baseWidth: 2.2,
  activeWidth: 2.8,

  baseOpacity: 0.82,
  activeOpacity: 1,

  arrowSize: 5.5,

  branchLength: 30,
  borderRadius: 12,
  offset: 16,

  animationDuration:
    "2.15s",

  baseGlow:
    "drop-shadow(0 0 3px rgba(92,102,146,0.20))",

  activeGlow:
    "drop-shadow(0 0 7px rgba(96,165,250,0.45))",
} as const;

type StatusVisualConfig = {
  label: string;
  indicator: string;
  border: string;
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

    indicator:
      "bg-zinc-400",

    border:
      "rgba(148,163,184,0.42)",

    glow:
      "shadow-[0_16px_38px_var(--app-shadow)]",

    edge: {
      color: DAG_EDGE.color,
      width:
        DAG_EDGE.baseWidth,
      animated: false,
      glow:
        DAG_EDGE.baseGlow,
    },
  },

  RUNNING: {
    label: "Running",

    indicator:
      "bg-blue-400",

    border:
      "rgba(96,165,250,0.72)",

    glow:
      "shadow-[0_0_28px_rgba(59,130,246,0.12),0_16px_38px_var(--app-shadow)]",

    edge: {
      color:
        DAG_EDGE.activeColor,
      width:
        DAG_EDGE.activeWidth,
      animated: true,
      glow:
        DAG_EDGE.activeGlow,
    },
  },

  SUCCESS: {
    label: "Success",

    indicator:
      "bg-emerald-400",

    border:
      "rgba(52,211,153,0.58)",

    glow:
      "shadow-[0_0_22px_rgba(16,185,129,0.045),0_16px_38px_var(--app-shadow)]",

    edge: {
      color: DAG_EDGE.color,
      width:
        DAG_EDGE.baseWidth,
      animated: false,
      glow:
        DAG_EDGE.baseGlow,
    },
  },

  ERROR: {
    label: "Error",

    indicator:
      "bg-red-400",

    border:
      "rgba(248,113,113,0.72)",

    glow:
      "shadow-[0_0_28px_rgba(239,68,68,0.10),0_16px_38px_var(--app-shadow)]",

    edge: {
      color: DAG_EDGE.color,
      width:
        DAG_EDGE.baseWidth,
      animated: false,
      glow:
        DAG_EDGE.baseGlow,
    },
  },

  STUCK: {
    label: "Stuck",

    indicator:
      "bg-amber-400",

    border:
      "rgba(251,191,36,0.72)",

    glow:
      "shadow-[0_0_28px_rgba(245,158,11,0.09),0_16px_38px_var(--app-shadow)]",

    edge: {
      color: DAG_EDGE.color,
      width:
        DAG_EDGE.baseWidth,
      animated: false,
      glow:
        DAG_EDGE.baseGlow,
    },
  },
};
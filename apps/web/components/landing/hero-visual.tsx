type NodeColor = "blue" | "violet" | "green";

type GraphNode = {
  id: string;
  title: string;
  detail: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: NodeColor;
  delay: number;
  active?: boolean;
};

type GraphEdge = {
  path: string;
  delay: number;
  active?: boolean;
};

const COLORS = {
  blue: {
    stroke: "#2563EB",
    dot: "#60A5FA",
    glow: "#2563EB",
  },
  violet: {
    stroke: "#7C6CF2",
    dot: "#A78BFA",
    glow: "#7C6CF2",
  },
  green: {
    stroke: "#059669",
    dot: "#10B981",
    glow: "#059669",
  },
} as const;

const NODES: GraphNode[] = [
  {
    id: "request",
    title: "User request",
    detail: "analyze_repository",
    x: 150,
    y: 235,
    width: 190,
    height: 64,
    color: "violet",
    delay: 280,
  },
  {
    id: "agent",
    title: "Agent planner",
    detail: "orchestrate()",
    x: 380,
    y: 235,
    width: 190,
    height: 64,
    color: "blue",
    delay: 720,
    active: true,
  },
  {
    id: "search",
    title: "Web search",
    detail: "search_docs",
    x: 650,
    y: 105,
    width: 190,
    height: 58,
    color: "blue",
    delay: 1450,
  },
  {
    id: "retrieval",
    title: "Context retrieval",
    detail: "retrieve_context",
    x: 650,
    y: 190,
    width: 190,
    height: 58,
    color: "violet",
    delay: 1560,
  },
  {
    id: "llm",
    title: "LLM call",
    detail: "generate_response",
    x: 650,
    y: 275,
    width: 190,
    height: 58,
    color: "green",
    delay: 1670,
  },
  {
    id: "tool",
    title: "Tool execution",
    detail: "run_code",
    x: 650,
    y: 360,
    width: 190,
    height: 58,
    color: "blue",
    delay: 1780,
  },
  {
    id: "search-result",
    title: "Search result",
    detail: "3.1s · success",
    x: 930,
    y: 105,
    width: 190,
    height: 58,
    color: "green",
    delay: 2290,
  },
  {
    id: "retrieval-result",
    title: "Context result",
    detail: "230ms · success",
    x: 930,
    y: 190,
    width: 190,
    height: 58,
    color: "green",
    delay: 2400,
  },
  {
    id: "llm-result",
    title: "Generated response",
    detail: "1.8s · success",
    x: 930,
    y: 275,
    width: 190,
    height: 58,
    color: "green",
    delay: 2510,
  },
  {
    id: "tool-result",
    title: "Execution result",
    detail: "742ms · success",
    x: 930,
    y: 360,
    width: 190,
    height: 58,
    color: "green",
    delay: 2620,
  },
];

const EDGES: GraphEdge[] = [
  {
    path: "M245 235 C265 235 270 235 285 235",
    delay: 500,
    active: true,
  },
  {
    path: "M475 235 C515 235 535 105 555 105",
    delay: 940,
    active: true,
  },
  {
    path: "M475 235 C520 235 530 190 555 190",
    delay: 1040,
    active: true,
  },
  {
    path: "M475 235 C520 235 530 275 555 275",
    delay: 1140,
    active: true,
  },
  {
    path: "M475 235 C515 235 535 360 555 360",
    delay: 1240,
    active: true,
  },
  {
    path: "M745 105 C785 105 790 105 835 105",
    delay: 2040,
  },
  {
    path: "M745 190 C785 190 790 190 835 190",
    delay: 2140,
  },
  {
    path: "M745 275 C785 275 790 275 835 275",
    delay: 2240,
  },
  {
    path: "M745 360 C785 360 790 360 835 360",
    delay: 2340,
  },
];

const COMPACT_NODES: GraphNode[] = [
  {
    id: "request",
    title: "User request",
    detail: "analyze_repository",
    x: 110,
    y: 215,
    width: 160,
    height: 58,
    color: "violet",
    delay: 280,
  },
  {
    id: "agent",
    title: "Agent planner",
    detail: "orchestrate()",
    x: 320,
    y: 215,
    width: 160,
    height: 58,
    color: "blue",
    delay: 720,
    active: true,
  },
  {
    id: "search",
    title: "Web search",
    detail: "search_docs",
    x: 550,
    y: 110,
    width: 160,
    height: 54,
    color: "blue",
    delay: 1450,
  },
  {
    id: "retrieval",
    title: "Context retrieval",
    detail: "retrieve_context",
    x: 550,
    y: 180,
    width: 160,
    height: 54,
    color: "violet",
    delay: 1560,
  },
  {
    id: "llm",
    title: "LLM call",
    detail: "generate_response",
    x: 550,
    y: 250,
    width: 160,
    height: 54,
    color: "green",
    delay: 1670,
  },
  {
    id: "tool",
    title: "Tool execution",
    detail: "run_code",
    x: 550,
    y: 320,
    width: 160,
    height: 54,
    color: "blue",
    delay: 1780,
  },
  {
    id: "search-result",
    title: "Search result",
    detail: "3.1s · success",
    x: 800,
    y: 110,
    width: 150,
    height: 54,
    color: "green",
    delay: 2290,
  },
  {
    id: "retrieval-result",
    title: "Context result",
    detail: "230ms · success",
    x: 800,
    y: 180,
    width: 150,
    height: 54,
    color: "green",
    delay: 2400,
  },
  {
    id: "llm-result",
    title: "Generated response",
    detail: "1.8s · success",
    x: 800,
    y: 250,
    width: 150,
    height: 54,
    color: "green",
    delay: 2510,
  },
  {
    id: "tool-result",
    title: "Execution result",
    detail: "742ms · success",
    x: 800,
    y: 320,
    width: 150,
    height: 54,
    color: "green",
    delay: 2620,
  },
];

const COMPACT_EDGES: GraphEdge[] = [
  {
    path: "M190 215 C205 215 210 215 240 215",
    delay: 500,
    active: true,
  },
  {
    path: "M400 215 C430 215 450 110 470 110",
    delay: 940,
    active: true,
  },
  {
    path: "M400 215 C430 215 450 180 470 180",
    delay: 1040,
    active: true,
  },
  {
    path: "M400 215 C430 215 450 250 470 250",
    delay: 1140,
    active: true,
  },
  {
    path: "M400 215 C430 215 450 320 470 320",
    delay: 1240,
    active: true,
  },
  {
    path: "M630 110 C670 110 685 110 725 110",
    delay: 2040,
  },
  {
    path: "M630 180 C670 180 685 180 725 180",
    delay: 2140,
  },
  {
    path: "M630 250 C670 250 685 250 725 250",
    delay: 2240,
  },
  {
    path: "M630 320 C670 320 685 320 725 320",
    delay: 2340,
  },
];

function NodeCard({ node }: { node: GraphNode }) {
  const color = COLORS[node.color];

  return (
    <g
      style={{
        opacity: 0,
        animation:
          "beacon-hero-node-in 520ms cubic-bezier(.22,1,.36,1) forwards",
        animationDelay: `${node.delay}ms`,
      }}
    >
      {node.active && (
        <rect
          x={node.x - node.width / 2 - 8}
          y={node.y - node.height / 2 - 8}
          width={node.width + 16}
          height={node.height + 16}
          rx="16"
          fill={color.glow}
          className="opacity-[0.06] dark:opacity-[0.08]"
          filter="blur(12px)"
        />
      )}

      <rect
        x={node.x - node.width / 2}
        y={node.y - node.height / 2}
        width={node.width}
        height={node.height}
        rx="12"
        className="fill-[#F8F9FB] dark:fill-[#0D1117]"
        stroke={color.stroke}
        strokeOpacity={node.active ? 0.88 : 0.62}
        strokeWidth={node.active ? 1.6 : 1.15}
      />

      {node.active && (
        <rect
          x={node.x - node.width / 2}
          y={node.y - node.height / 2}
          width={node.width}
          height={node.height}
          rx="12"
          fill="none"
          stroke={color.stroke}
          strokeWidth="1"
        >
          <animate
            attributeName="stroke-opacity"
            values="0.3;0.8;0.3"
            dur="2.4s"
            repeatCount="indefinite"
          />
        </rect>
      )}

      <circle
        cx={node.x - node.width / 2 + 17}
        cy={node.y - 5}
        r="4"
        fill={color.dot}
      />

      <text
        x={node.x - node.width / 2 + 30}
        y={node.y - 1}
        className="fill-[#181819] dark:fill-zinc-200"
        fontSize="12"
        fontWeight="600"
        fontFamily="var(--font-geist-sans)"
      >
        {node.title}
      </text>

      <text
        x={node.x - node.width / 2 + 30}
        y={node.y + 17}
        className="fill-[#777675] dark:fill-zinc-500"
        fontSize="10"
        fontFamily="var(--font-geist-mono)"
      >
        {node.detail}
      </text>
    </g>
  );
}

function AnimatedEdge({ path, delay, active = false }: GraphEdge) {
  return (
    <g>
      <path
        d={path}
        fill="none"
        stroke={active ? "#6B9FF4" : "#B3BAC6"}
        strokeOpacity={active ? "0.78" : "0.62"}
        strokeWidth={active ? "2.1" : "1.4"}
        pathLength="1"
        strokeDasharray="1"
        strokeDashoffset="1"
        className="dark:[stroke:#60A5FA] dark:opacity-70"
        style={{
          animation:
            "beacon-hero-edge-draw 780ms cubic-bezier(.22,1,.36,1) forwards",
          animationDelay: `${delay}ms`,
        }}
      />

      <circle
        r={active ? 4 : 3}
        fill={active ? "#5B9AF8" : "#9B82F5"}
        style={{
          opacity: 0,
          animation: "beacon-hero-particle-in 260ms ease forwards",
          animationDelay: `${delay + 700}ms`,
        }}
      >
        <animateMotion
          path={path}
          dur={active ? "2.3s" : "2.8s"}
          begin={`${delay + 900}ms`}
          repeatCount="indefinite"
        />
      </circle>
    </g>
  );
}

function Graph({
  nodes,
  edges,
  viewBox,
}: {
  nodes: GraphNode[];
  edges: GraphEdge[];
  viewBox: string;
}) {
  return (
    <svg
      viewBox={viewBox}
      className="block h-full w-full"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      aria-hidden="true"
    >
      {edges.map((edge, index) => (
        <AnimatedEdge key={`edge-${index}`} {...edge} />
      ))}

      {nodes.map((node) => (
        <NodeCard key={node.id} node={node} />
      ))}
    </svg>
  );
}

function MobileNode({
  title,
  detail,
  y,
  color,
  delay,
}: {
  title: string;
  detail: string;
  y: number;
  color: NodeColor;
  delay: number;
}) {
  const config = COLORS[color];

  return (
    <g
      style={{
        opacity: 0,
        animation:
          "beacon-hero-node-in 520ms cubic-bezier(.22,1,.36,1) forwards",
        animationDelay: `${delay}ms`,
      }}
    >
      <rect
        x="145"
        y={y - 29}
        width="470"
        height="58"
        rx="12"
        className="fill-[#F8F9FB] dark:fill-[#0D1117]"
        stroke={config.stroke}
        strokeOpacity="0.65"
        strokeWidth="1.15"
      />

      <circle
        cx="169"
        cy={y - 2}
        r="4"
        fill={config.dot}
      />

      <text
        x="184"
        y={y + 2}
        className="fill-[#181819] dark:fill-zinc-200"
        fontSize="12"
        fontWeight="600"
        fontFamily="var(--font-geist-sans)"
      >
        {title}
      </text>

      <text
        x="184"
        y={y + 19}
        className="fill-[#777675] dark:fill-zinc-500"
        fontSize="9.5"
        fontFamily="var(--font-geist-mono)"
      >
        {detail}
      </text>
    </g>
  );
}

function MobileGraph() {
  return (
    <svg
      viewBox="0 0 760 640"
      className="block h-full w-full"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      aria-hidden="true"
    >
      <AnimatedEdge path="M380 97 V166" delay={500} active />
      <AnimatedEdge path="M380 224 V291" delay={950} />
      <AnimatedEdge path="M380 349 V416" delay={1400} />
      <AnimatedEdge path="M380 474 V541" delay={1850} />

      <MobileNode
        title="User request"
        detail="analyze_repository"
        y={68}
        color="violet"
        delay={250}
      />

      <MobileNode
        title="Agent planner"
        detail="orchestrate()"
        y={195}
        color="blue"
        delay={720}
      />

      <MobileNode
        title="LLM call"
        detail="generate_response"
        y={322}
        color="green"
        delay={1170}
      />

      <MobileNode
        title="Tool execution"
        detail="run_code"
        y={449}
        color="blue"
        delay={1620}
      />

      <MobileNode
        title="Generated response"
        detail="success · 1.8s"
        y={576}
        color="green"
        delay={2070}
      />
    </svg>
  );
}

export default function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[1180px]">
      <style>{`
        .beacon-hero-graph {
          width: 100%;
          aspect-ratio: 760 / 640;
          overflow: hidden;
        }

        @media (min-width: 768px) {
          .beacon-hero-graph {
            aspect-ratio: 960 / 430;
          }
        }

        @media (min-width: 1280px) {
          .beacon-hero-graph {
            aspect-ratio: 1080 / 450;
          }
        }

        @keyframes beacon-hero-edge-draw {
          from {
            stroke-dashoffset: 1;
          }

          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes beacon-hero-node-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes beacon-hero-particle-in {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .beacon-hero-motion,
          .beacon-hero-motion * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>

      <div
        aria-hidden="true"
        className="absolute -inset-12 rounded-[70px] bg-blue-500/[0.025] blur-3xl dark:bg-blue-500/[0.04]"
      />

      <div
        className="
          relative overflow-hidden rounded-[24px]

          border border-[#D8DADD]
          bg-[#EEF0F3]
          shadow-[0_24px_60px_rgba(24,24,24,0.09)]

          dark:border-white/[0.08]
          dark:bg-[#0A0F15]
          dark:shadow-[0_30px_100px_rgba(0,0,0,0.42)]
        "
      >
        {/* Light-mode grid */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-100 dark:hidden"
          style={{
            backgroundImage:
              "linear-gradient(rgba(110,118,132,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(110,118,132,0.055) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />

        {/* Dark-mode atmosphere */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none absolute inset-0 hidden
            dark:block
            dark:bg-[radial-gradient(circle_at_50%_45%,rgba(37,99,235,0.10),transparent_38%)]
          "
        />

        {/* Dark-mode grid */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden opacity-50 dark:block"
          style={{
            backgroundImage:
              "linear-gradient(rgba(96,165,250,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(96,165,250,0.04) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />

        {/* Header */}
        <div
          className="
            relative
            border-b border-[#D5D7DA]
            bg-[#E8EAED]/80

            dark:border-white/[0.06]
            dark:bg-[#0B1017]/55
          "
        >
          <div className="flex min-h-[64px] items-center justify-between px-4 sm:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <div
                className="
                  flex h-8 w-8 shrink-0 items-center justify-center rounded-lg
                  border border-blue-500/25
                  bg-blue-500/[0.08]
                  dark:border-blue-400/20
                  dark:bg-blue-400/[0.06]
                "
              >
                <span className="h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.65)]" />
              </div>

              <div className="min-w-0">
                <p className="text-[11px] font-medium text-[#55585D] sm:text-[12px] dark:text-zinc-400">
                  Live execution
                </p>

                <p className="mt-0.5 truncate font-mono text-[9px] text-[#858990] sm:text-[10px] dark:text-zinc-600">
                  run_01f8c2e7
                </p>
              </div>
            </div>

            <div
              className="
                flex shrink-0 items-center gap-2 rounded-full
                border border-emerald-500/25
                bg-emerald-500/[0.07]
                px-3 py-1.5

                dark:border-emerald-400/15
                dark:bg-emerald-400/[0.05]
              "
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.65)]" />

              <span className="text-[10px] font-medium text-emerald-600 sm:text-[11px] dark:text-emerald-300">
                Streaming
              </span>
            </div>
          </div>
        </div>

        {/* Graph */}
        <div className="beacon-hero-graph relative beacon-hero-motion">
          <div className="hidden h-full w-full xl:block">
            <Graph
              nodes={NODES}
              edges={EDGES}
              viewBox="0 0 1080 450"
            />
          </div>

          <div className="hidden h-full w-full md:block xl:hidden">
            <Graph
              nodes={COMPACT_NODES}
              edges={COMPACT_EDGES}
              viewBox="0 0 960 430"
            />
          </div>

          <div className="block h-full w-full md:hidden">
            <MobileGraph />
          </div>
        </div>

        {/* Footer */}
        <div
          className="
            relative
            border-t border-[#D5D7DA]
            bg-[#E8EAED]/80

            dark:border-white/[0.06]
            dark:bg-[#0B1017]/55
          "
        >
          <div className="grid sm:grid-cols-[minmax(0,1fr)_auto]">
            <div className="min-w-0 px-4 py-5 sm:px-8">
              <div className="flex min-w-0 items-center gap-3">
                <span className="shrink-0 font-mono text-[9px] text-[#858990] dark:text-zinc-600">
                  10:24:01
                </span>

                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />

                <span className="truncate font-mono text-[10px] text-[#5F6369] dark:text-zinc-400">
                  planner selected 4 execution paths
                </span>
              </div>

              <div className="mt-2 flex min-w-0 items-center gap-3">
                <span className="shrink-0 font-mono text-[9px] text-[#858990] dark:text-zinc-600">
                  10:24:03
                </span>

                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />

                <span className="truncate font-mono text-[10px] text-[#73777D] dark:text-zinc-500">
                  llm call completed successfully
                </span>
              </div>
            </div>

            <div
              className="
                grid min-w-0 grid-cols-3
                border-t border-[#D5D7DA]
                sm:border-l sm:border-t-0

                dark:border-white/[0.06]
              "
            >
              <div className="min-w-0 px-4 py-5 sm:px-5">
                <p className="truncate text-[9px] uppercase tracking-[0.12em] text-[#858990] dark:text-zinc-600">
                  Nodes
                </p>

                <p className="mt-1 text-[16px] font-medium tabular-nums text-[#24262A] sm:text-[18px] dark:text-zinc-300">
                  10
                </p>
              </div>

              <div className="min-w-0 border-l border-[#D5D7DA] px-4 py-5 sm:px-5 dark:border-white/[0.06]">
                <p className="truncate text-[9px] uppercase tracking-[0.12em] text-[#858990] dark:text-zinc-600">
                  Edges
                </p>

                <p className="mt-1 text-[16px] font-medium tabular-nums text-[#24262A] sm:text-[18px] dark:text-zinc-300">
                  9
                </p>
              </div>

              <div className="min-w-0 border-l border-[#D5D7DA] px-4 py-5 sm:px-5 dark:border-white/[0.06]">
                <p className="truncate text-[9px] uppercase tracking-[0.12em] text-[#858990] dark:text-zinc-600">
                  Latency
                </p>

                <p className="mt-1 whitespace-nowrap text-[16px] font-medium tabular-nums text-[#24262A] sm:text-[18px] dark:text-zinc-300">
                  842ms
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
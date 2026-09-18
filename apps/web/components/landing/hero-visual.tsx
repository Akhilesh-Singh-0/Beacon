type GraphNode = {
    id: string;
    title: string;
    detail: string;
    x: number;
    y: number;
    width: number;
    height: number;
    color: "blue" | "violet" | "green";
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
      title: "Incoming request",
      detail: "POST /otel",
      x: 150,
      y: 235,
      width: 190,
      height: 64,
      color: "violet",
      delay: 280,
    },
    {
      id: "planner",
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
      id: "vector",
      title: "Vector database",
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
      detail: "gpt-4.1",
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
      title: "Fetch result",
      detail: "3.1s · success",
      x: 930,
      y: 105,
      width: 190,
      height: 58,
      color: "green",
      delay: 2290,
    },
    {
      id: "vector-result",
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
  
  const EDGES = [
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
  ] as const;
  
  const COMPACT_NODES: GraphNode[] = [
    {
      id: "compact-request",
      title: "Incoming request",
      detail: "POST /otel",
      x: 110,
      y: 215,
      width: 160,
      height: 58,
      color: "violet",
      delay: 280,
    },
    {
      id: "compact-planner",
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
      id: "compact-search",
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
      id: "compact-vector",
      title: "Vector database",
      detail: "retrieve_context",
      x: 550,
      y: 180,
      width: 160,
      height: 54,
      color: "violet",
      delay: 1560,
    },
    {
      id: "compact-llm",
      title: "LLM call",
      detail: "gpt-4.1",
      x: 550,
      y: 250,
      width: 160,
      height: 54,
      color: "green",
      delay: 1670,
    },
    {
      id: "compact-tool",
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
      id: "compact-search-result",
      title: "Fetch result",
      detail: "3.1s · success",
      x: 800,
      y: 110,
      width: 150,
      height: 54,
      color: "green",
      delay: 2290,
    },
    {
      id: "compact-vector-result",
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
      id: "compact-llm-result",
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
      id: "compact-tool-result",
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
  
  const COMPACT_EDGES = [
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
  ] as const;
  
  function NodeCard({
    node,
  }: {
    node: GraphNode;
  }) {
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
            x={node.x - node.width / 2 - 10}
            y={node.y - node.height / 2 - 10}
            width={node.width + 20}
            height={node.height + 20}
            rx="18"
            fill={color.glow}
            opacity="0.08"
            filter="blur(14px)"
          />
        )}
  
        <rect
          x={node.x - node.width / 2}
          y={node.y - node.height / 2}
          width={node.width}
          height={node.height}
          rx="12"
          fill="#0D1117"
          stroke={color.stroke}
          strokeOpacity={
            node.active ? 0.68 : 0.44
          }
          strokeWidth={
            node.active ? 1.4 : 1
          }
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
            strokeOpacity="0.55"
            strokeWidth="1"
          >
            <animate
              attributeName="stroke-opacity"
              values="0.25;0.7;0.25"
              dur="2.4s"
              repeatCount="indefinite"
            />
          </rect>
        )}
  
        <circle
          cx={
            node.x -
            node.width / 2 +
            17
          }
          cy={node.y - 5}
          r="4"
          fill={color.dot}
        />
  
        <text
          x={
            node.x -
            node.width / 2 +
            30
          }
          y={node.y - 1}
          fill="#E4E4E7"
          fontSize="12"
          fontWeight="600"
          fontFamily="inherit"
        >
          {node.title}
        </text>
  
        <text
          x={
            node.x -
            node.width / 2 +
            30
          }
          y={node.y + 17}
          fill="#52525B"
          fontSize="10"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
        >
          {node.detail}
        </text>
      </g>
    );
  }
  
  function AnimatedEdge({
    path,
    delay,
    active = false,
  }: {
    path: string;
    delay: number;
    active?: boolean;
  }) {
    return (
      <g>
        <path
          d={path}
          fill="none"
          stroke={
            active
              ? "#60A5FA"
              : "#6470B4"
          }
          strokeOpacity={
            active ? "0.42" : "0.28"
          }
          strokeWidth={
            active ? "2" : "1.4"
          }
          pathLength="1"
          strokeDasharray="1"
          strokeDashoffset="1"
          style={{
            animation:
              "beacon-hero-edge-draw 780ms cubic-bezier(.22,1,.36,1) forwards",
            animationDelay: `${delay}ms`,
          }}
        />
  
        <circle
          r={active ? 4 : 3}
          fill={
            active
              ? "#60A5FA"
              : "#A78BFA"
          }
          style={{
            opacity: 0,
            animation:
              "beacon-hero-particle-in 260ms ease forwards",
            animationDelay: `${
              delay + 700
            }ms`,
          }}
        >
          <animateMotion
            path={path}
            dur={
              active
                ? "2.3s"
                : "2.8s"
            }
            begin={`${
              delay + 900
            }ms`}
            repeatCount="indefinite"
          />
        </circle>
      </g>
    );
  }
  
  function DesktopGraph() {
    return (
      <svg
        viewBox="0 0 1080 450"
        className="block h-full w-full"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
        aria-hidden="true"
      >
        {EDGES.map((edge, index) => (
          <AnimatedEdge
            key={index}
            path={edge.path}
            delay={edge.delay}
            active={edge.active}
          />
        ))}
  
        {NODES.map((node) => (
          <NodeCard
            key={node.id}
            node={node}
          />
        ))}
      </svg>
    );
  }
  
  function CompactGraph() {
    return (
      <svg
        viewBox="0 0 960 430"
        className="block h-full w-full"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
        aria-hidden="true"
      >
        {COMPACT_EDGES.map(
          (edge, index) => (
            <AnimatedEdge
              key={index}
              path={edge.path}
              delay={edge.delay}
              active={edge.active}
            />
          ),
        )}
  
        {COMPACT_NODES.map((node) => (
          <NodeCard
            key={node.id}
            node={node}
          />
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
    color: keyof typeof COLORS;
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
          fill="#0D1117"
          stroke={config.stroke}
          strokeOpacity="0.48"
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
          fill="#E4E4E7"
          fontSize="12"
          fontWeight="600"
        >
          {title}
        </text>
  
        <text
          x="184"
          y={y + 19}
          fill="#52525B"
          fontSize="9.5"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
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
        <AnimatedEdge
          path="M380 97 V166"
          delay={500}
          active
        />
  
        <AnimatedEdge
          path="M380 224 V291"
          delay={950}
        />
  
        <AnimatedEdge
          path="M380 349 V416"
          delay={1400}
        />
  
        <AnimatedEdge
          path="M380 474 V541"
          delay={1850}
        />
  
        <MobileNode
          title="Incoming request"
          detail="POST /otel"
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
          detail="gpt-4.1"
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
  
        <div className="absolute -inset-16 rounded-[80px] bg-blue-500/[0.04] blur-3xl" />
  
        <div className="relative overflow-hidden rounded-[24px] border border-white/[0.08] bg-[#0A0F15] shadow-[0_30px_100px_rgba(0,0,0,0.42)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(37,99,235,0.10),transparent_38%)]" />
  
          <div
            className="absolute inset-0 opacity-50"
            style={{
              backgroundImage:
                "linear-gradient(rgba(96,165,250,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(96,165,250,0.04) 1px, transparent 1px)",
              backgroundSize: "36px 36px",
            }}
          />
  
          {/* Header */}
          <div className="relative border-b border-white/[0.06]">
            <div
              className="flex min-h-[64px] items-center justify-between"
              style={{
                paddingLeft: "32px",
                paddingRight: "32px",
                boxSizing: "border-box",
              }}
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-blue-400/20 bg-blue-400/[0.06]">
                  <span className="h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.65)]" />
                </div>
  
                <div className="min-w-0">
                  <p className="text-[11px] font-medium text-zinc-400 sm:text-[12px]">
                    Live execution
                  </p>
  
                  <p className="mt-0.5 truncate font-mono text-[9px] text-zinc-600 sm:text-[10px]">
                    trace_01f8c2e7
                  </p>
                </div>
              </div>
  
              <div
                className="flex shrink-0 items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[0.05]"
                style={{
                  paddingLeft: "12px",
                  paddingRight: "12px",
                  paddingTop: "6px",
                  paddingBottom: "6px",
                }}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.65)]" />
  
                <span className="text-[10px] font-medium text-emerald-300 sm:text-[11px]">
                  Streaming
                </span>
              </div>
            </div>
          </div>
  
          {/* Responsive graph */}
          <div className="beacon-hero-graph relative beacon-hero-motion">
            <div className="hidden h-full w-full xl:block">
              <DesktopGraph />
            </div>
  
            <div className="hidden h-full w-full md:block xl:hidden">
              <CompactGraph />
            </div>
  
            <div className="block h-full w-full md:hidden">
              <MobileGraph />
            </div>
          </div>
  
          {/* Footer */}
          <div className="relative border-t border-white/[0.06]">
            <div className="grid sm:grid-cols-[minmax(0,1fr)_auto]">
              <div
                className="min-w-0"
                style={{
                  padding: "20px 32px",
                }}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="shrink-0 font-mono text-[9px] text-zinc-600">
                    10:24:01
                  </span>
  
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
  
                  <span className="truncate font-mono text-[10px] text-zinc-400">
                    planner selected 4 execution paths
                  </span>
                </div>
  
                <div className="mt-2 flex min-w-0 items-center gap-3">
                  <span className="shrink-0 font-mono text-[9px] text-zinc-600">
                    10:24:03
                  </span>
  
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
  
                  <span className="truncate font-mono text-[10px] text-zinc-500">
                    llm call completed successfully
                  </span>
                </div>
              </div>
  
              <div
                className="grid min-w-0 grid-cols-3 border-t border-white/[0.06] sm:border-l sm:border-t-0"
                style={{
                  marginRight: "16px",
                }}
              >
                <div
                  className="min-w-0"
                  style={{
                    padding: "20px 20px",
                  }}
                >
                  <p className="truncate text-[9px] uppercase tracking-[0.12em] text-zinc-600">
                    Nodes
                  </p>
  
                  <p className="mt-1 text-[16px] font-medium tabular-nums text-zinc-300 sm:text-[18px]">
                    12
                  </p>
                </div>
  
                <div
                  className="min-w-0 border-l border-white/[0.06]"
                  style={{
                    padding: "20px 20px",
                  }}
                >
                  <p className="truncate text-[9px] uppercase tracking-[0.12em] text-zinc-600">
                    Edges
                  </p>
  
                  <p className="mt-1 text-[16px] font-medium tabular-nums text-zinc-300 sm:text-[18px]">
                    11
                  </p>
                </div>
  
                <div
                  className="min-w-0 border-l border-white/[0.06]"
                  style={{
                    padding: "20px 24px 20px 20px",
                  }}
                >
                  <p className="truncate text-[9px] uppercase tracking-[0.12em] text-zinc-600">
                    Latency
                  </p>
  
                  <p className="mt-1 whitespace-nowrap text-[16px] font-medium tabular-nums text-zinc-300 sm:text-[18px]">
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
"use client";

import Image from "next/image";

import beaconIcon from "@/app/icon.png";

const STREAMS = [
  {
    color: "#3b82f6",
    path: "M82 68 C135 68 195 40 270 40",
    duration: "2.8s",
    delay: "0s",
  },
  {
    color: "#8b5cf6",
    path: "M82 90 C145 90 205 90 270 90",
    duration: "3.1s",
    delay: "0.5s",
  },
  {
    color: "#ec4899",
    path: "M82 112 C135 112 195 140 270 140",
    duration: "2.9s",
    delay: "1s",
  },
];

export default function LiveObservability() {
  return (
    <div className="relative h-[180px] w-[390px] shrink-0">
      <div className="pointer-events-none absolute left-[14%] top-1/2 h-[120px] w-[120px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/[0.05] blur-3xl dark:bg-blue-500/[0.08]" />

      <div className="absolute left-[14%] top-1/2 z-10 flex h-[72px] w-[72px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[18px] border border-[#d7d7d4] bg-[#f8f8f6] shadow-[0_16px_40px_rgba(37,99,235,0.08)] dark:border-[#202021] dark:bg-[#0b0d12] dark:shadow-[0_16px_40px_rgba(0,0,0,0.3)]">
        <div className="absolute inset-[-9px] rounded-[24px] border border-[#d7d7d4] dark:border-[#202021]" />

        <div className="relative h-11 w-11 overflow-hidden rounded-md">
          <Image
            src={beaconIcon}
            alt="Beacon"
            fill
            sizes="44px"
            className="object-cover"
          />
        </div>
      </div>

      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 h-full w-full"
        viewBox="0 0 390 180"
        fill="none"
      >
        {STREAMS.map((stream) => (
          <g key={stream.color}>
            <path
              d={stream.path}
              stroke={stream.color}
              strokeWidth="1.2"
              strokeOpacity="0.28"
              strokeDasharray="4 8"
              strokeLinecap="round"
            />

            <circle
              r="3"
              fill={stream.color}
            >
              <animateMotion
                dur={stream.duration}
                begin={stream.delay}
                repeatCount="indefinite"
                path={stream.path}
              />
            </circle>

            <circle
              r="7"
              fill={stream.color}
              opacity="0.08"
            >
              <animateMotion
                dur={stream.duration}
                begin={stream.delay}
                repeatCount="indefinite"
                path={stream.path}
              />
            </circle>
          </g>
        ))}
      </svg>

      <div className="absolute right-0 top-[20px] z-10 flex h-10 w-[120px] items-center gap-3 rounded-xl border border-[#d7d7d4] bg-[#f8f8f6] px-3.5 shadow-[0_8px_24px_rgba(24,24,24,0.04)] dark:border-[#202021] dark:bg-[#090b10] dark:shadow-[0_8px_24px_rgba(0,0,0,0.2)]">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-500/10">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
        </span>

        <span className="text-[11px] font-semibold">
          Traces
        </span>
      </div>

      <div className="absolute right-0 top-1/2 z-10 flex h-10 w-[120px] -translate-y-1/2 items-center gap-3 rounded-xl border border-[#d7d7d4] bg-[#f8f8f6] px-3.5 shadow-[0_8px_24px_rgba(24,24,24,0.04)] dark:border-[#202021] dark:bg-[#090b10] dark:shadow-[0_8px_24px_rgba(0,0,0,0.2)]">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-violet-500/10">
          <span className="h-1.5 w-1.5 rounded-full bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
        </span>

        <span className="text-[11px] font-semibold">
          Spans
        </span>
      </div>

      <div className="absolute bottom-[20px] right-0 z-10 flex h-10 w-[120px] items-center gap-3 rounded-xl border border-[#d7d7d4] bg-[#f8f8f6] px-3.5 shadow-[0_8px_24px_rgba(24,24,24,0.04)] dark:border-[#202021] dark:bg-[#090b10] dark:shadow-[0_8px_24px_rgba(0,0,0,0.2)]">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-pink-500/10">
          <span className="h-1.5 w-1.5 rounded-full bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.8)]" />
        </span>

        <span className="text-[11px] font-semibold">
          Metrics
        </span>
      </div>
    </div>
  );
}
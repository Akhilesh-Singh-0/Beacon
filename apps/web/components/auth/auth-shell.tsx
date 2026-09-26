"use client";

import Image from "next/image";
import Link from "next/link";

import beaconIcon from "@/app/icon.png";

type AuthShellProps = {
  children: React.ReactNode;
  mode: "sign-in" | "sign-up";
};

const FEATURES = [
  {
    icon: "✦",
    label: "Get started in minutes",
    className:
      "bg-blue-500/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-300",
  },
  {
    icon: "▥",
    label: "Works with your stack",
    className:
      "bg-violet-500/10 text-violet-600 dark:bg-violet-400/10 dark:text-violet-300",
  },
  {
    icon: "●",
    label: "Secure and open source",
    className:
      "bg-pink-500/10 text-pink-600 dark:bg-pink-400/10 dark:text-pink-300",
  },
];

export default function AuthShell({ children, mode }: AuthShellProps) {
  const isSignIn = mode === "sign-in";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f8f9fb] text-[#101522] dark:bg-[#050609] dark:text-[#e2e2e4]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute inset-0 opacity-[0.55] dark:opacity-[0.18] [background-image:radial-gradient(circle,color-mix(in_srgb,var(--beacon-primary)_28%,transparent)_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_78%)]" />

        <div className="absolute -left-[320px] bottom-[-420px] h-[850px] w-[850px] rounded-full bg-blue-400/[0.10] blur-[2px] dark:hidden" />

        <div className="absolute -right-[240px] -top-[300px] h-[680px] w-[680px] rounded-full bg-violet-400/[0.10] blur-[2px] dark:hidden" />

        <div className="absolute -right-[360px] bottom-[-300px] h-[650px] w-[650px] rounded-full bg-fuchsia-300/[0.07] blur-[4px] dark:hidden" />

        <div className="absolute left-[31%] top-[-220px] h-[420px] w-[420px] rounded-full bg-blue-300/[0.035] blur-[100px] dark:hidden" />
      </div>

      <div className="absolute left-6 top-6 z-20 sm:left-10 sm:top-8 lg:left-16 lg:top-12">
        <Link
          href="/"
          className="group inline-flex items-center gap-3"
          aria-label="Beacon home"
        >
          <div className="relative h-11 w-11 overflow-hidden rounded-xl border border-blue-500/25 bg-[#071c55] shadow-[0_8px_30px_rgba(37,99,235,0.15)]">
            <Image
              src={beaconIcon}
              alt="Beacon"
              fill
              sizes="44px"
              className="object-cover"
              priority
            />
          </div>

          <span className="text-[20px] font-semibold tracking-[-0.035em]">
            Beacon
          </span>
        </Link>
      </div>

      <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-[1500px] grid-cols-1 items-center gap-12 px-5 pb-12 pt-28 sm:px-8 lg:grid-cols-[0.72fr_1fr_0.72fr] lg:gap-12 lg:px-16 lg:py-16">
        <section className="hidden lg:flex lg:flex-col lg:justify-center lg:pl-2">
          <div className="max-w-[270px]">
            <p className="text-[24px] font-medium leading-[1.22] tracking-[-0.035em]">
              Observability
              <br />
              for AI agents.
            </p>

            <p className="mt-4 text-[15px] leading-[1.6] text-[#667085] dark:text-[#9aa5bb]">
              Capture, visualize, and debug every step of your agent&apos;s
              execution.
            </p>
          </div>

          <div className="mt-28 space-y-5">
            {FEATURES.map((feature) => (
              <div key={feature.label} className="flex items-center gap-4">
                <span
                  className={[
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[15px] font-semibold",
                    feature.className,
                  ].join(" ")}
                >
                  {feature.icon}
                </span>

                <span className="text-[14px] font-medium text-[#374151] dark:text-[#c7cfdf]">
                  {feature.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="flex justify-center">
          <div className="w-full max-w-[570px]">
            <div className="relative">
              <div
                aria-hidden="true"
                className="absolute -inset-8 rounded-[36px] bg-blue-500/[0.035] blur-3xl dark:hidden"
              />

              <div className="relative">{children}</div>
            </div>
          </div>
        </section>

        <section className="hidden lg:flex lg:items-center lg:justify-end">
          <div className="w-full max-w-[335px] rounded-[22px] border border-violet-300/25 bg-gradient-to-br from-violet-100/80 to-fuchsia-50/70 p-7 shadow-[0_20px_70px_rgba(124,58,237,0.08)] backdrop-blur-sm dark:border-violet-400/20 dark:from-violet-500/[0.10] dark:to-fuchsia-500/[0.06] dark:shadow-[0_20px_70px_rgba(0,0,0,0.18)]">
            <div className="text-[42px] font-semibold leading-none text-violet-500/70 dark:text-violet-300/70">
              “
            </div>

            <p className="mt-3 text-[19px] leading-[1.5] tracking-[-0.025em] text-[#161b2a] dark:text-[#eef2ff]">
              Beacon has become an essential part of our agent development
              workflow.
            </p>

            <div className="mt-7 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-200 text-[17px] font-semibold text-pink-700 dark:bg-pink-400/20 dark:text-pink-200">
                C
              </div>

              <div>
                <p className="text-[14px] font-semibold">Clay</p>
                <p className="mt-0.5 text-[13px] text-[#667085] dark:text-[#9aa5bb]">
                  Engineering Lead
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="relative z-10 mx-auto mb-8 flex max-w-[570px] flex-col px-5 lg:hidden">
        <p className="text-center text-[14px] leading-6 text-[#667085] dark:text-[#9aa5bb]">
          Observability for AI agents. Capture, visualize, and debug every
          step of your agent&apos;s execution.
        </p>
      </div>
    </main>
  );
}
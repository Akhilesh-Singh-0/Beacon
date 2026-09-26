"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";

import AppThemeToggle from "@/components/theme/app-theme-toggle";
import beaconIcon from "@/app/icon.png";

type MeResponse = {
  workspace: {
    id: string;
    name: string;
    slug: string;
  };
  apiKey: string;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:3001";

function CopyIcon() {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
    >
      <rect
        x="8"
        y="8"
        width="11"
        height="12"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M5 12h13M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg
      aria-hidden="true"
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M5 4.5A2.5 2.5 0 0 1 7.5 2H20v17H7.5A2.5 2.5 0 0 0 5 21.5v-17Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M5 19.5A2.5 2.5 0 0 1 7.5 17H20"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function StepNumber({
  number,
  variant,
}: {
  number: number;
  variant: "blue" | "violet";
}) {
  return (
    <div
      className={[
        "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white transition-transform duration-200 group-hover:scale-[1.04]",
        variant === "blue"
          ? "bg-blue-500 shadow-[0_8px_24px_rgba(37,99,235,0.24)]"
          : "bg-violet-500 shadow-[0_8px_24px_rgba(124,58,237,0.20)]",
      ].join(" ")}
    >
      {number}
    </div>
  );
}

export default function OnboardingPage() {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  const [data, setData] =
    useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] =
    useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadUser() {
      if (!isLoaded) return;

      if (!isSignedIn) {
        setError("You must be signed in.");
        setLoading(false);
        return;
      }

      try {
        const token = await getToken();

        if (!token) {
          throw new Error("Could not get Clerk token");
        }

        const response = await fetch(
          `${API_URL}/api/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error(
            "Failed to load your Beacon account",
          );
        }

        const result =
          (await response.json()) as MeResponse;

        setData(result);
      } catch (error) {
        console.error(error);
        setError(
          "We couldn't load your workspace details.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [getToken, isLoaded, isSignedIn]);

  async function copyApiKey() {
    if (!data) return;

    await navigator.clipboard.writeText(data.apiKey);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--app-bg)] text-[var(--app-text)]">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-blue-500/20 border-t-blue-500" />

          <p className="mt-4 text-sm text-[var(--app-text-secondary)]">
            Setting up your Beacon workspace...
          </p>
        </div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--app-bg)] px-6 text-[var(--app-text)]">
        <div className="w-full max-w-md rounded-2xl border border-red-400/20 bg-[var(--app-surface)] p-8 text-center">
          <h1 className="text-xl font-semibold">
            Something went wrong
          </h1>

          <p className="mt-3 text-sm text-red-500">
            {error ?? "Unable to load your account."}
          </p>

          <Link
            href="/"
            className="mt-6 inline-flex rounded-lg border border-[var(--app-border)] px-4 py-2 text-sm transition hover:bg-[var(--app-surface-raised)]"
          >
            Back to Beacon
          </Link>
        </div>
      </main>
    );
  }

  const envExample =
    `BEACON_API_KEY=${data.apiKey}`;

  return (
    <main className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] transition-colors duration-200">
      <header className="flex h-[76px] items-center justify-between border-b border-[var(--app-border)] px-5 sm:px-8">
        <Link
          href="/"
          className="group flex items-center gap-3"
        >
          <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-blue-500/25 bg-[#071c55] shadow-[0_8px_30px_rgba(37,99,235,0.12)] transition-transform duration-200 group-hover:scale-[1.03]">
            <Image
              src={beaconIcon}
              alt="Beacon"
              fill
              sizes="40px"
              className="object-cover"
              priority
            />
          </div>

          <span className="text-[18px] font-semibold tracking-[-0.03em]">
            Beacon
          </span>
        </Link>

        <AppThemeToggle />
      </header>

      <div className="mx-auto w-full max-w-[1380px] px-6 py-10 sm:px-8 lg:px-12 lg:py-12">
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_430px]">
          <div className="min-w-0">
            <div className="mb-8">
              <p className="font-mono text-[10px] font-medium uppercase tracking-[0.28em] text-blue-600 dark:text-blue-300">
                Onboarding
              </p>

              <h1 className="mt-3 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
                Your workspace is{" "}
                <span className="bg-gradient-to-r from-blue-500 via-violet-500 to-pink-500 bg-clip-text text-transparent">
                  ready.
                </span>
              </h1>

              <p className="mt-4 max-w-2xl text-[15px] leading-7 text-[var(--app-text-secondary)] sm:text-base">
                Connect your OpenTelemetry traces to
                Beacon and start seeing your AI agent
                execution in real time.
              </p>
            </div>

            <section className="rounded-2xl border border-blue-200/60 bg-gradient-to-br from-blue-50/80 via-white to-violet-50/70 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300/70 hover:shadow-[0_16px_40px_rgba(37,99,235,0.08)] dark:border-white/[0.08] dark:bg-[linear-gradient(135deg,rgba(17,24,39,0.96),rgba(15,18,30,0.96))] dark:hover:border-blue-400/20 dark:hover:shadow-[0_18px_45px_rgba(0,0,0,0.20)] sm:p-6">
              <div>
                <p className="text-[12px] text-[var(--app-text-secondary)]">
                  Workspace
                </p>

                <h2 className="mt-1 truncate text-[18px] font-semibold tracking-[-0.02em]">
                  {data.workspace.name}
                </h2>

                <p className="mt-1 truncate font-mono text-[11px] text-[var(--app-text-muted)]">
                  {data.workspace.slug}
                </p>
              </div>
            </section>

            <div className="mt-8 space-y-7">
              <section>
                <h2 className="text-[14px] font-semibold">
                  Your API key
                </h2>

                <p className="mt-1 text-[12px] text-[var(--app-text-secondary)]">
                  Keep this key private. You can always
                  create a new one from settings.
                </p>

                <div className="mt-3 flex overflow-hidden rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] transition-colors hover:border-blue-500/20">
                  <div className="min-w-0 flex-1 overflow-x-auto px-4 py-3.5">
                    <code className="whitespace-nowrap font-mono text-[12px] text-[var(--app-text)]">
                      {data.apiKey}
                    </code>
                  </div>

                  <button
                    type="button"
                    onClick={copyApiKey}
                    className="flex shrink-0 items-center gap-2 border-l border-[var(--app-border)] bg-[var(--app-surface-raised)] px-4 text-[12px] font-medium text-[var(--app-text-secondary)] transition hover:text-[var(--app-text)]"
                  >
                    <CopyIcon />
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
              </section>

              <section>
                <h2 className="text-[14px] font-semibold">
                  Add it to your environment
                </h2>

                <p className="mt-1 text-[12px] text-[var(--app-text-secondary)]">
                  Create a `.env` file in your agent
                  project and add:
                </p>

                <div className="mt-3 flex overflow-hidden rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] transition-colors hover:border-violet-500/20">
                  <div className="min-w-0 flex-1 overflow-x-auto px-4 py-3.5">
                    <code className="whitespace-nowrap font-mono text-[12px] text-[var(--app-text)]">
                      {envExample}
                    </code>
                  </div>

                  <button
                    type="button"
                    onClick={async () => {
                      await navigator.clipboard.writeText(
                        envExample,
                      );
                    }}
                    className="flex shrink-0 items-center gap-2 border-l border-[var(--app-border)] bg-[var(--app-surface-raised)] px-4 text-[12px] font-medium text-[var(--app-text-secondary)] transition hover:text-[var(--app-text)]"
                  >
                    <CopyIcon />
                    Copy
                  </button>
                </div>
              </section>

              <section>
                <h2 className="text-[14px] font-semibold">
                  OTLP endpoint
                </h2>

                <p className="mt-1 text-[12px] text-[var(--app-text-secondary)]">
                  Send OpenTelemetry traces to Beacon
                  using the OTLP HTTP endpoint.
                </p>

                <div className="mt-3 flex overflow-hidden rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] transition-colors hover:border-pink-500/20">
                  <div className="min-w-0 flex-1 overflow-x-auto px-4 py-3.5">
                    <code className="whitespace-nowrap font-mono text-[12px] text-[var(--app-text)]">
                      {API_URL}/v1/traces
                    </code>
                  </div>

                  <button
                    type="button"
                    onClick={async () => {
                      await navigator.clipboard.writeText(
                        `${API_URL}/v1/traces`,
                      );
                    }}
                    className="flex shrink-0 items-center gap-2 border-l border-[var(--app-border)] bg-[var(--app-surface-raised)] px-4 text-[12px] font-medium text-[var(--app-text-secondary)] transition hover:text-[var(--app-text)]"
                  >
                    <CopyIcon />
                    Copy
                  </button>
                </div>
              </section>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                {
                  title: "Works with any stack",
                  text: "Use Beacon with Python, TypeScript, LangChain, LlamaIndex, or any OpenTelemetry-compatible setup.",
                  icon: "✦",
                  className:
                    "border-blue-200/60 bg-gradient-to-br from-blue-50/80 via-white to-blue-50/40 dark:border-blue-400/10 dark:bg-[linear-gradient(135deg,rgba(18,28,44,0.96),rgba(12,18,28,0.96))]",
                  iconClass:
                    "bg-blue-500/[0.08] text-blue-600 dark:bg-blue-400/[0.09] dark:text-blue-300",
                },
                {
                  title: "Real-time visibility",
                  text: "See agent executions, tool calls, prompts, and responses as they happen.",
                  icon: "◆",
                  className:
                    "border-violet-200/60 bg-gradient-to-br from-violet-50/70 via-white to-violet-50/40 dark:border-violet-400/10 dark:bg-[linear-gradient(135deg,rgba(25,20,42,0.96),rgba(15,16,28,0.96))]",
                  iconClass:
                    "bg-violet-500/[0.08] text-violet-600 dark:bg-violet-400/[0.09] dark:text-violet-300",
                },
                {
                  title: "Debug with confidence",
                  text: "Find and fix issues in complex workflows with complete traces and metadata.",
                  icon: "◇",
                  className:
                    "border-pink-200/60 bg-gradient-to-br from-pink-50/70 via-white to-pink-50/40 dark:border-pink-400/10 dark:bg-[linear-gradient(135deg,rgba(38,20,32,0.96),rgba(17,15,25,0.96))]",
                  iconClass:
                    "bg-pink-500/[0.08] text-pink-600 dark:bg-pink-400/[0.09] dark:text-pink-300",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className={[
                    "group rounded-xl border p-5 transition-all duration-200",
                    "hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)]",
                    "dark:hover:shadow-[0_18px_45px_rgba(0,0,0,0.20)]",
                    item.className,
                  ].join(" ")}
                >
                  <div
                    className={[
                      "flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-transform duration-200 group-hover:scale-105",
                      item.iconClass,
                    ].join(" ")}
                  >
                    {item.icon}
                  </div>

                  <h3 className="mt-4 text-[13px] font-semibold">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-[11px] leading-5 text-[var(--app-text-secondary)]">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <aside className="xl:pt-[258px]">
            <section className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-5 transition-all duration-200 hover:border-blue-500/15 hover:shadow-[0_18px_45px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_18px_45px_rgba(0,0,0,0.20)] sm:p-6">
              <div className="flex items-center gap-3 border-b border-[var(--app-border)] pb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/[0.08] text-blue-500 dark:bg-blue-400/[0.09] dark:text-blue-300">
                  <BookIcon />
                </div>

                <h2 className="text-[17px] font-semibold">
                  Follow these steps
                </h2>
              </div>

              <div className="relative">
                <div className="pointer-events-none absolute left-5 top-5 bottom-5 w-px bg-gradient-to-b from-blue-400 via-violet-400 to-violet-500 opacity-60" />

                <div className="group relative flex gap-4 border-b border-[var(--app-border)] py-6">
                  <StepNumber
                    number={1}
                    variant="blue"
                  />

                  <div className="min-w-0 pt-1">
                    <h3 className="text-[14px] font-semibold">
                      Configure OpenTelemetry
                    </h3>

                    <p className="mt-2 text-[12px] leading-5 text-[var(--app-text-secondary)]">
                      Set up your agent or application
                      to export traces to Beacon using
                      OTLP.
                    </p>

                    <button
                      type="button"
                      className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[var(--app-border)] bg-[var(--app-surface-raised)] px-3.5 py-2 text-[11px] font-medium transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-500/30 hover:text-blue-500"
                    >
                      View documentation
                      <ArrowRightIcon />
                    </button>
                  </div>
                </div>

                <div className="group relative flex gap-4 border-b border-[var(--app-border)] py-6">
                  <StepNumber
                    number={2}
                    variant="violet"
                  />

                  <div className="min-w-0 pt-1">
                    <h3 className="text-[14px] font-semibold">
                      Run your agent
                    </h3>

                    <p className="mt-2 text-[12px] leading-5 text-[var(--app-text-secondary)]">
                      Start your agent or application.
                      Beacon will receive traces and
                      build the execution graph in real
                      time.
                    </p>
                  </div>
                </div>

                <div className="group relative flex gap-4 pt-6">
                  <StepNumber
                    number={3}
                    variant="violet"
                  />

                  <div className="min-w-0 pt-1">
                    <h3 className="text-[14px] font-semibold">
                      Open the dashboard
                    </h3>

                    <p className="mt-2 text-[12px] leading-5 text-[var(--app-text-secondary)]">
                      Once traces start arriving,
                      you'll see live executions,
                      spans, and logs in your
                      workspace.
                    </p>

                    <Link
                      href="/runs"
                      className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#756DC4] px-4 py-2.5 text-[12px] font-medium text-white shadow-[0_10px_28px_rgba(117,109,196,0.32)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#6961B7] hover:shadow-[0_12px_32px_rgba(117,109,196,0.40)]"
                    >
                      Go to dashboard
                      <ArrowRightIcon />
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
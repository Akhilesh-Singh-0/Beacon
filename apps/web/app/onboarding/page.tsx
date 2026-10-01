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

type Stack = "node" | "python";

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

function NodeIcon() {
  return (
    <svg
      aria-hidden="true"
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M8 4h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M9 8h6M9 12h6M9 16h4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PythonIcon() {
  return (
    <svg
      aria-hidden="true"
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M12 3c-3.5 0-4 1.5-4 3.5V9h4.5v1H7.5C5 10 3 11.5 3 15s2 4 4.5 4H10v-2.5C10 14 11.5 13 14 13h3c2 0 4-1.5 4-4V7c0-2.5-2-4-4.5-4H12Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M12 21c3.5 0 4-1.5 4-3.5V15h-4.5v-1h5c2.5 0 4.5-1.5 4.5-5s-2-4-4.5-4H14v2.5C14 10 12.5 11 10 11H7c-2 0-4 1.5-4 4v2c0 2.5 2 4 4.5 4H12Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle
        cx="10"
        cy="6.5"
        r="0.8"
        fill="currentColor"
      />
      <circle
        cx="14"
        cy="17.5"
        r="0.8"
        fill="currentColor"
      />
    </svg>
  );
}

export default function OnboardingPage() {
  const { getToken, isLoaded, isSignedIn } =
    useAuth();

  const [data, setData] =
    useState<MeResponse | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [copied, setCopied] =
    useState<string | null>(null);

  const [regenerating, setRegenerating] =
    useState(false);

  const [showRegenerateConfirm, setShowRegenerateConfirm] =
    useState(false);

  const [stack, setStack] =
    useState<Stack>("node");

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
          throw new Error(
            "Could not get Clerk token",
          );
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
  }, [
    getToken,
    isLoaded,
    isSignedIn,
  ]);

  async function copyText(
    id: string,
    text: string,
  ) {
    await navigator.clipboard.writeText(text);

    setCopied(id);

    setTimeout(() => {
      setCopied(null);
    }, 2000);
  }

  async function handleRegenerateApiKey() {
    if (regenerating) return false;

    setRegenerating(true);

    try {
      const token = await getToken();

      if (!token) {
        throw new Error("Could not get Clerk token");
      }

      const response = await fetch(
        `${API_URL}/api/me/api-key/regenerate`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(
          "Failed to regenerate API key",
        );
      }

      const result =
        (await response.json()) as {
          apiKey: string;
        };

      setData((current) =>
        current
          ? {
              ...current,
              apiKey: result.apiKey,
            }
          : current,
      );

      return true;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      setRegenerating(false);
    }
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
            {error ??
              "Unable to load your account."}
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

  const apiKey = data.apiKey;

  const endpoint =
    `${API_URL}/v1/traces`;

  const nodeInstall =
    "npm install @opentelemetry/api @opentelemetry/auto-instrumentations-node";

  const nodeRun = `OTEL_TRACES_EXPORTER=otlp \\
OTEL_EXPORTER_OTLP_TRACES_ENDPOINT="${endpoint}" \\
OTEL_EXPORTER_OTLP_TRACES_PROTOCOL="http/protobuf" \\
OTEL_EXPORTER_OTLP_TRACES_HEADERS="x-api-key=${apiKey}" \\
OTEL_SERVICE_NAME="my-agent" \\
NODE_OPTIONS="--require @opentelemetry/auto-instrumentations-node/register" \\
npm run dev`;

  const pythonInstall =
    "pip install opentelemetry-distro opentelemetry-exporter-otlp";

  const pythonRun = `OTEL_TRACES_EXPORTER="otlp" \\
OTEL_METRICS_EXPORTER="none" \\
OTEL_LOGS_EXPORTER="none" \\
OTEL_EXPORTER_OTLP_TRACES_ENDPOINT="${endpoint}" \\
OTEL_EXPORTER_OTLP_TRACES_PROTOCOL="http/protobuf" \\
OTEL_EXPORTER_OTLP_TRACES_HEADERS="x-api-key=${apiKey}" \\
OTEL_SERVICE_NAME="my-agent" \\
opentelemetry-instrument python app.py`;

  const installCommand =
    stack === "node"
      ? nodeInstall
      : pythonInstall;

  const runCommand =
    stack === "node"
      ? nodeRun
      : pythonRun;

  const stackLabel =
    stack === "node"
      ? "Node.js"
      : "Python";

  const stackIcon =
    stack === "node"
      ? <NodeIcon />
      : <PythonIcon />;

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
                Connect an OpenTelemetry-instrumented application to Beacon and visualize its execution in real time.
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
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-[14px] font-semibold">
                      Your API key
                    </h2>

                    <p className="mt-1 text-[12px] text-[var(--app-text-secondary)]">
                      Keep this key private. You can always
                      create a new one from settings.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setShowRegenerateConfirm(true)
                    }
                    disabled={regenerating}
                    className="shrink-0 text-[11px] font-medium text-[var(--app-text-secondary)] transition hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Regenerate
                  </button>
                </div>

                <div className="mt-3 flex overflow-hidden rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] transition-colors hover:border-blue-500/20">
                  <div className="min-w-0 flex-1 overflow-x-auto px-4 py-3.5">
                    <code className="whitespace-nowrap font-mono text-[12px] text-[var(--app-text)]">
                      {apiKey}
                    </code>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      copyText(
                        "api-key",
                        apiKey,
                      )
                    }
                    className="flex shrink-0 items-center gap-2 border-l border-[var(--app-border)] bg-[var(--app-surface-raised)] px-4 text-[12px] font-medium text-[var(--app-text-secondary)] transition hover:text-[var(--app-text)]"
                  >
                    <CopyIcon />
                    {copied === "api-key"
                      ? "Copied"
                      : "Copy"}
                  </button>
                </div>

                {showRegenerateConfirm && (
                  <div className="mt-3 rounded-xl border border-red-500/20 bg-red-500/[0.04] p-4">
                    <p className="text-[12px] font-semibold">
                      Regenerate this API key?
                    </p>

                    <p className="mt-1.5 text-[11px] leading-5 text-[var(--app-text-secondary)]">
                      This will immediately invalidate your
                      current key. Any project using it will
                      stop sending traces until you update its
                      configuration.
                    </p>

                    <div className="mt-3 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setShowRegenerateConfirm(false)
                        }
                        disabled={regenerating}
                        className="rounded-lg px-3 py-2 text-[11px] font-medium text-[var(--app-text-secondary)] transition hover:bg-[var(--app-surface-raised)] hover:text-[var(--app-text)] disabled:opacity-50"
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        onClick={async () => {
                          const success =
                            await handleRegenerateApiKey();

                          if (success) {
                            setShowRegenerateConfirm(false);
                          }
                        }}
                        disabled={regenerating}
                        className="rounded-lg bg-red-500 px-3 py-2 text-[11px] font-medium text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {regenerating
                          ? "Regenerating..."
                          : "Regenerate key"}
                      </button>
                    </div>
                  </div>
                )}
              </section>

              <section>
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <h2 className="text-[14px] font-semibold">
                      Connect your application
                    </h2>

                    <p className="mt-1 text-[12px] text-[var(--app-text-secondary)]">
                      Choose Node.js or Python and configure your application to send OpenTelemetry traces to Beacon.
                    </p>
                  </div>

                  <div className="hidden rounded-full border border-[var(--app-border)] bg-[var(--app-surface)] px-3 py-1.5 text-[10px] font-medium text-[var(--app-text-muted)] sm:block">
                    No Beacon SDK required
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-1">
                  <button
                    type="button"
                    onClick={() =>
                      setStack("node")
                    }
                    className={[
                      "flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-[12px] font-medium transition-all",
                      stack === "node"
                        ? "bg-blue-500/[0.10] text-blue-600 shadow-sm dark:bg-blue-400/[0.10] dark:text-blue-300"
                        : "text-[var(--app-text-secondary)] hover:bg-[var(--app-surface-raised)] hover:text-[var(--app-text)]",
                    ].join(" ")}
                  >
                    <NodeIcon />
                    Node.js
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setStack("python")
                    }
                    className={[
                      "flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-[12px] font-medium transition-all",
                      stack === "python"
                        ? "bg-violet-500/[0.10] text-violet-600 shadow-sm dark:bg-violet-400/[0.10] dark:text-violet-300"
                        : "text-[var(--app-text-secondary)] hover:bg-[var(--app-surface-raised)] hover:text-[var(--app-text)]",
                    ].join(" ")}
                  >
                    <PythonIcon />
                    Python
                  </button>
                </div>

                <div className="mt-5 space-y-5">
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <div>
                        <p className="text-[12px] font-semibold">
                          1. Install OpenTelemetry
                        </p>

                        <p className="mt-0.5 text-[11px] text-[var(--app-text-muted)]">
                          Install the OpenTelemetry packages required by your application.
                        </p>
                      </div>
                    </div>

                    <div className="flex overflow-hidden rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)]">
                      <div className="min-w-0 flex-1 overflow-x-auto px-4 py-3.5">
                        <code className="whitespace-nowrap font-mono text-[11px] text-[var(--app-text)]">
                          {installCommand}
                        </code>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          copyText(
                            "install",
                            installCommand,
                          )
                        }
                        className="flex shrink-0 items-center gap-2 border-l border-[var(--app-border)] bg-[var(--app-surface-raised)] px-4 text-[12px] font-medium text-[var(--app-text-secondary)] transition hover:text-[var(--app-text)]"
                      >
                        <CopyIcon />
                        {copied === "install"
                          ? "Copied"
                          : "Copy"}
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="mb-2">
                      <p className="text-[12px] font-semibold">
                        2. Configure your OTLP exporter
                      </p>

                      <p className="mt-0.5 text-[11px] text-[var(--app-text-muted)]">
                        Configure your application to send OpenTelemetry traces to your Beacon workspace.
                      </p>
                    </div>

                    <div className="overflow-hidden rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)]">
                      <div className="flex items-center justify-between border-b border-[var(--app-border)] bg-[var(--app-surface-raised)] px-4 py-2">
                        <div className="flex items-center gap-2 text-[10px] font-medium text-[var(--app-text-muted)]">
                          {stackIcon}
                          {stackLabel}
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            copyText(
                              "run",
                              runCommand,
                            )
                          }
                          className="flex items-center gap-2 text-[11px] font-medium text-[var(--app-text-secondary)] transition hover:text-[var(--app-text)]"
                        >
                          <CopyIcon />
                          {copied === "run"
                            ? "Copied"
                            : "Copy"}
                        </button>
                      </div>

                      <pre className="max-h-[230px] overflow-auto px-4 py-4 text-[11px] leading-6 text-[var(--app-text)]">
                        <code>
                          {runCommand}
                        </code>
                      </pre>
                    </div>
                  </div>

                  <div className="rounded-xl border border-violet-400/15 bg-violet-500/[0.04] px-4 py-3.5 dark:bg-violet-400/[0.04]">
                    <p className="text-[11px] leading-5 text-[var(--app-text-secondary)]">
                      Beacon receives OpenTelemetry traces from your application. If your libraries support OpenTelemetry auto-instrumentation, you can capture telemetry without changing your application code.
                    </p>
                  </div>
                  <div className="mt-4 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-raised)] px-4 py-3.5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--app-text-secondary)]">
                      How Beacon connects
                    </p>

                    <p className="mt-1.5 text-[11px] leading-5 text-[var(--app-text-muted)]">
                      Beacon works with applications and workflows that emit OpenTelemetry traces. It does not directly connect to ChatGPT, Claude, or Codex.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-[14px] font-semibold">
                  Beacon endpoint
                </h2>

                <p className="mt-1 text-[12px] text-[var(--app-text-secondary)]">
                  This is where your OpenTelemetry
                  traces are sent.
                </p>

                <div className="mt-3 flex overflow-hidden rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] transition-colors hover:border-pink-500/20">
                  <div className="min-w-0 flex-1 overflow-x-auto px-4 py-3.5">
                    <code className="whitespace-nowrap font-mono text-[12px] text-[var(--app-text)]">
                      {endpoint}
                    </code>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      copyText(
                        "endpoint",
                        endpoint,
                      )
                    }
                    className="flex shrink-0 items-center gap-2 border-l border-[var(--app-border)] bg-[var(--app-surface-raised)] px-4 text-[12px] font-medium text-[var(--app-text-secondary)] transition hover:text-[var(--app-text)]"
                  >
                    <CopyIcon />
                    {copied === "endpoint"
                      ? "Copied"
                      : "Copy"}
                  </button>
                </div>
              </section>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                {
                  title: "OpenTelemetry compatible",
                  text: "Use Beacon with Node.js, Python, TypeScript, or any workflow that can emit OpenTelemetry traces.",
                  icon: "✦",
                  className:
                    "border-blue-200/60 bg-gradient-to-br from-blue-50/80 via-white to-blue-50/40 dark:border-blue-400/10 dark:bg-[linear-gradient(135deg,rgba(18,28,44,0.96),rgba(12,18,28,0.96))]",
                  iconClass:
                    "bg-blue-500/[0.08] text-blue-600 dark:bg-blue-400/[0.09] dark:text-blue-300",
                },
                {
                  title: "Real-time execution",
                  text: "See execution steps and supported tool operations as they happen.",
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
                      Connect your application
                    </h3>

                    <p className="mt-2 text-[12px] leading-5 text-[var(--app-text-secondary)]">
                      Choose Node.js or Python and configure your application to send OpenTelemetry traces.
                    </p>
                  </div>
                </div>

                <div className="group relative flex gap-4 border-b border-[var(--app-border)] py-6">
                  <StepNumber
                    number={2}
                    variant="violet"
                  />

                  <div className="min-w-0 pt-1">
                    <h3 className="text-[14px] font-semibold">
                      Run your application
                    </h3>

                    <p className="mt-2 text-[12px] leading-5 text-[var(--app-text-secondary)]">
                      Start your application normally. Beacon will receive its OpenTelemetry traces.
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
                      Once traces arrive, you'll see the execution appear in Run History.
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
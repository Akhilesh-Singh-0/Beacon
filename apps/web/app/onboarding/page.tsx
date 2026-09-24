"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";

import beaconIcon from "@/app/beacon-icon.svg";

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

export default function OnboardingPage() {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  const [data, setData] = useState<MeResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(
    null,
  );
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
      <main className="flex min-h-screen items-center justify-center bg-[#020A11] px-6 text-white">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-blue-400/20 border-t-blue-400" />
          <p className="mt-4 text-sm text-blue-100/60">
            Setting up your Beacon workspace...
          </p>
        </div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#020A11] px-6 text-white">
        <div className="w-full max-w-md rounded-2xl border border-red-400/20 bg-[#06131D] p-8 text-center">
          <h1 className="text-xl font-semibold">
            Something went wrong
          </h1>

          <p className="mt-3 text-sm text-red-200/70">
            {error ??
              "Unable to load your account."}
          </p>

          <Link
            href="/"
            className="mt-6 inline-flex rounded-lg border border-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/5"
          >
            Back to Beacon
          </Link>
        </div>
      </main>
    );
  }

  const envExample = `BEACON_API_KEY=${data.apiKey}`;

  return (
    <main className="min-h-screen bg-[#020A11] px-5 py-12 text-white sm:px-8 lg:px-10">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-blue-400/20 bg-blue-400/[0.06] shadow-[0_0_30px_rgba(22,131,255,0.12)]">
            <Image
              src={beaconIcon}
              alt="Beacon"
              width={48}
              height={48}
              priority
              unoptimized
            />
          </div>

          <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.28em] text-blue-300/70">
            Beacon setup
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
            Your workspace is ready.
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-blue-100/60 sm:text-base">
            Connect your OpenTelemetry traces to
            Beacon and start seeing your AI agent
            execution in real time.
          </p>
        </div>

        <section className="rounded-2xl border border-blue-400/20 bg-[#06131D]/80 p-6 shadow-[0_30px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-8">
          <div className="flex flex-col gap-2 border-b border-white/[0.06] pb-6">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-blue-300/60">
              Workspace
            </span>

            <h2 className="text-xl font-medium">
              {data.workspace.name}
            </h2>

            <p className="font-mono text-xs text-white/35">
              {data.workspace.slug}
            </p>
          </div>

          <div className="pt-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-white">
                  Your API key
                </p>

                <p className="mt-1 text-xs text-white/40">
                  Keep this key private.
                </p>
              </div>

              <button
                type="button"
                onClick={copyApiKey}
                className="shrink-0 rounded-lg border border-blue-400/30 px-3 py-2 text-xs font-medium text-blue-300 transition hover:bg-blue-400/10"
              >
                {copied ? "Copied" : "Copy"}
              </button>
            </div>

            <div className="mt-4 overflow-x-auto rounded-xl border border-white/[0.08] bg-black/30 px-4 py-4">
              <code className="whitespace-nowrap font-mono text-sm text-blue-100/80">
                {data.apiKey}
              </code>
            </div>
          </div>

          <div className="mt-10">
            <p className="text-sm font-medium text-white">
              Add it to your environment
            </p>

            <p className="mt-1 text-xs leading-5 text-white/40">
              Create a `.env` file in your agent
              project and add:
            </p>

            <div className="mt-4 overflow-x-auto rounded-xl border border-white/[0.08] bg-black/30 p-4">
              <code className="whitespace-nowrap font-mono text-sm text-white/75">
                {envExample}
              </code>
            </div>
          </div>

          <div className="mt-8 rounded-xl border border-blue-400/10 bg-blue-400/[0.03] p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-blue-300/55">
              OTLP endpoint
            </p>

            <p className="mt-3 overflow-x-auto font-mono text-sm text-blue-100/80">
              {API_URL}/v1/traces
            </p>

            <p className="mt-2 text-xs leading-5 text-white/40">
              Send OpenTelemetry traces to Beacon using
              the OTLP HTTP endpoint.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-blue-300/55">
                Step 01
              </p>

              <h3 className="mt-3 text-sm font-medium">
                Configure OpenTelemetry
              </h3>

              <p className="mt-2 text-xs leading-5 text-white/40">
                Configure your agent to export
                traces to Beacon using OTLP.
              </p>
            </div>

            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-blue-300/55">
                Step 02
              </p>

              <h3 className="mt-3 text-sm font-medium">
                Run your agent
              </h3>

              <p className="mt-2 text-xs leading-5 text-white/40">
                Beacon receives your traces and
                streams the execution graph in
                real time.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 border-t border-white/[0.06] pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-white/35">
              Ready to explore your agent runs?
            </p>

            <Link
              href="/runs"
              className="inline-flex items-center justify-center rounded-lg bg-[#1683FF] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#0877F5]"
            >
              Open dashboard
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
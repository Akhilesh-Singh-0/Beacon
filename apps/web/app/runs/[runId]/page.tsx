"use client";

import { use } from "react";

import RunDetailClient from "@/components/runs/run-detail-client";

type RunDetailPageProps = {
  params: Promise<{
    runId: string;
  }>;
};

const PAGE_STYLES = {
  page:
    "flex h-screen w-screen flex-col overflow-hidden bg-[#0a0a0a] text-zinc-100",

  header:
    "flex h-16 shrink-0 items-center justify-between border-b border-zinc-800/80 bg-zinc-950/80 px-6 backdrop-blur-md",

  headerLeft:
    "flex min-w-0 items-center gap-4",

  back:
    "text-sm text-zinc-500 transition-colors hover:text-zinc-200",

  divider:
    "h-5 w-px bg-zinc-800",

  runInfo:
    "flex min-w-0 items-center gap-3",

  runLabel:
    "text-sm font-medium text-zinc-300",

  runId:
    "max-w-[220px] truncate font-mono text-xs text-zinc-500",

} as const;

export default function RunDetailPage({
  params,
}: RunDetailPageProps) {
  const { runId } = use(params);

  return (
    <main className={PAGE_STYLES.page}>
      <header className={PAGE_STYLES.header}>
        <div className={PAGE_STYLES.headerLeft}>
          <a
            href="/runs"
            className={PAGE_STYLES.back}
          >
            ← Runs
          </a>

          <div className={PAGE_STYLES.divider} />

          <div className={PAGE_STYLES.runInfo}>
            <span className={PAGE_STYLES.runLabel}>
              Run
            </span>

            <span className={PAGE_STYLES.runId}>
              {runId}
            </span>
          </div>
        </div>
      </header>

      <div className="flex-1 min-h-0">
        <RunDetailClient runId={runId} />
      </div>
    </main>
  );
}
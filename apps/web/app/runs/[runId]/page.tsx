import RunDetailClient from "@/components/runs/run-detail-client";

type RunDetailPageProps = {
  params: Promise<{
    runId: string;
  }>;
};

export default async function RunDetailPage({
  params,
}: RunDetailPageProps) {
  const { runId } = await params;

  return (
    <div className="h-screen overflow-y-auto bg-[var(--app-bg)]">
      <RunDetailClient runId={runId} />
    </div>
  );
}
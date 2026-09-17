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
    <div className="h-screen w-screen overflow-hidden bg-[#0a0a0a]">
      <RunDetailClient runId={runId} />
    </div>
  );
}
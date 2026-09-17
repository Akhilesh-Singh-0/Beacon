import DagCanvas from "@/components/dag/dag-canvas";

export default async function RunDetailPage({
  params,
}: {
  params: Promise<{ runId: string }>;
}) {
  const { runId } = await params;

  return (
    <div className="w-screen h-screen bg-[#0a0a0a]">
      <DagCanvas />
    </div>
  );
}
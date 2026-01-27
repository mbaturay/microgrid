import ExecutiveProject from "@/components/executive/executive-project";

export default async function ExecutiveProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const resolved = await params;
  return <ExecutiveProject projectId={resolved.projectId} />;
}

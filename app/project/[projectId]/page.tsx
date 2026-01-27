import PractitionerHub from "@/components/practitioner/practitioner-hub";

export default async function ProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string }>;
  searchParams?: Promise<{ lens?: string }>;
}) {
  const resolved = await params;
  const resolvedSearch = await searchParams;
  const lens = resolvedSearch?.lens === "executive" ? "executive" : "practitioner";

  return <PractitionerHub projectId={resolved.projectId} mode={lens} />;
}

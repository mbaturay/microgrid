import PractitionerHub from "@/components/practitioner/practitioner-hub";

export default async function PractitionerProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const resolved = await params;
  return <PractitionerHub projectId={resolved.projectId} />;
}

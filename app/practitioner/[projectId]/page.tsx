import { redirect } from "next/navigation";

export default async function PractitionerProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const resolved = await params;
  redirect(`/project/${resolved.projectId}?lens=practitioner`);
}

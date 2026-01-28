import ExecutiveDashboard from "@/components/executive/executive-dashboard";

export default async function HomePage({
  searchParams,
}: {
  searchParams?: Promise<{ lens?: string }>;
}) {
  const resolved = await searchParams;
  const lens = resolved?.lens === "practitioner" ? "practitioner" : "executive";

  return <ExecutiveDashboard lens={lens} />;
}

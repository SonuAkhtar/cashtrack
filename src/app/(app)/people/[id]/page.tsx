import { PersonDetail } from "@/features/people/PersonDetail/PersonDetail";

export default async function PersonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PersonDetail personId={id} />;
}

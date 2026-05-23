import { BorrowerDetailView } from "@/features/BorrowerDetailView/BorrowerDetailView";

export default function BorrowerDetailPage({ params }: { params: { id: string } }) {
  return <BorrowerDetailView borrowerId={params.id} />;
}

import { TransactionDetailView } from "@/features/TransactionDetailView/TransactionDetailView";

export default function TransactionDetailPage({ params }: { params: { id: string } }) {
  return <TransactionDetailView transactionId={params.id} />;
}

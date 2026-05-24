import { Suspense } from "react";
import { EntryFormView } from "@/features/EntryFormView/EntryFormView";
import { LoadingScreen } from "@/components/LoadingScreen/LoadingScreen";

export default function AddPage() {
  return (
    <Suspense fallback={<LoadingScreen compact />}>
      <EntryFormView />
    </Suspense>
  );
}

import { Suspense } from "react";
import { EntryFormView } from "@/features/EntryFormView/EntryFormView";

export default function AddPage() {
  return (
    <Suspense fallback={null}>
      <EntryFormView />
    </Suspense>
  );
}

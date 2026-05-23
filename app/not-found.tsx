import Link from "next/link";
import { Button } from "@/components/Button/Button";
import { EmptyState } from "@/components/EmptyState/EmptyState";

export default function NotFound() {
  return (
    <EmptyState
      title="Page not found"
      description="The page you were looking for does not exist."
      action={
        <Link href="/">
          <Button>Back to dashboard</Button>
        </Link>
      }
    />
  );
}

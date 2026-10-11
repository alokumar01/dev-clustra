import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center text-foreground">
      <p className="text-sm font-semibold uppercase tracking-wide text-primary">404 · Not found</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">We couldn’t find that page</h1>
      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        The link may be outdated, or the page may have moved.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button asChild>
          <Link href="/">
            <Home className="size-4" />
            Go to home
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/chat">
            <ArrowLeft className="size-4" />
            Open workspace
          </Link>
        </Button>
      </div>
    </main>
  );
}

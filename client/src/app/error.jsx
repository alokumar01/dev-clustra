"use client";

import { useEffect } from "react";
import { logger } from "@/lib/logger";
import { Button } from "@/components/ui/button";

export default function RouteError({ error, reset }) {
  useEffect(() => {
    logger.error("runtime.route_error", { area: "route_boundary" }, error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-2xl font-semibold">Something went wrong</h1>
      <p className="max-w-md text-muted-foreground">
        An unexpected error occurred. Please try again.
      </p>
      <Button onClick={reset}>Try again</Button>
    </main>
  );
}

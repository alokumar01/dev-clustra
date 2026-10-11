"use client";

import { useEffect } from "react";
import { logger } from "@/lib/logger";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    logger.error("runtime.global_error", { area: "global_boundary" }, error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center font-sans">
          <h1 className="text-2xl font-semibold">Something went wrong</h1>
          <p className="max-w-md text-muted-foreground">
            An unexpected application error occurred. Please try again.
          </p>
          <button
            type="button"
            onClick={reset}
            className="rounded-lg bg-primary px-4 py-2 text-primary-foreground"
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}


"use client";

export default function AppLoadingScreen() {
  return (
    <main
      className="relative flex min-h-screen flex-col items-center justify-center bg-background px-6 text-foreground"
      aria-busy="true"
    >
      <div
        role="status"
        aria-live="polite"
        className="flex w-full max-w-xs flex-col items-center"
      >
        {/* Dev-Clustra branding */}
        <div className="mb-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path
                d="M5 7h14M5 12h9M5 17h14"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <circle cx="17" cy="12" r="2" fill="#7AA2F7" />
            </svg>
          </div>

          <span className="text-lg font-semibold tracking-tight">
            dev-clustra
          </span>
        </div>

        {/* Progress bar — no spinner */}
        <div
          className="mb-6 h-1 w-2/5 overflow-hidden rounded-full bg-border"
          aria-hidden="true"
        >
          <div className="h-full w-2/5 animate-progress rounded-full bg-[#7AA2F7] motion-reduce:animate-none motion-reduce:w-full" />
        </div>

        <p className="text-sm font-medium">Getting things ready</p>

        <p className="mt-2 text-xs text-muted-foreground">
          Preparing your workspace
        </p>
      </div>

      <div className="absolute bottom-8 flex items-center gap-2 text-xs text-muted-foreground/70">
        <span className="h-1.5 w-1.5 rounded-full bg-[#8BC7A1]" />
        <span>Dev-Clustra</span>
      </div>

      <style jsx>{`
        @keyframes progress {
          0% {
            transform: translateX(-110%);
          }
          100% {
            transform: translateX(250%);
          }
        }

        .animate-progress {
          animation: progress 1.5s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-progress {
            animation: none;
            transform: translateX(0);
          }
        }
      `}</style>
    </main>
  );
}

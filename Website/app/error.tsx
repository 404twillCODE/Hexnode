"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error for debugging — replace with error reporting service later
    console.error("[Nodexity] Unhandled error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h2 className="font-mono text-2xl font-semibold text-text-primary sm:text-3xl">
        SOMETHING WENT WRONG
      </h2>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-text-secondary sm:text-base">
        An unexpected error occurred. You can try again or head back to the
        homepage.
      </p>
      <div className="mt-8 flex gap-4">
        <button
          type="button"
          onClick={reset}
          className="btn-primary"
        >
          <span className="relative z-20 font-mono">TRY AGAIN</span>
        </button>
        <a href="/" className="btn-secondary">
          <span className="relative z-20 font-mono">GO HOME</span>
        </a>
      </div>
      {error.digest && (
        <p className="mt-6 font-mono text-xs text-text-muted">
          Error ID: {error.digest}
        </p>
      )}
    </div>
  );
}

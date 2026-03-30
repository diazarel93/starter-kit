"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-sm text-center space-y-4">
        <h1 className="text-2xl font-bold">Une erreur est survenue</h1>
        <p className="text-foreground/60 text-sm">{error.message}</p>
        <button
          onClick={reset}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Reessayer
        </button>
      </div>
    </main>
  );
}

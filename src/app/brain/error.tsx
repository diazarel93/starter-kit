"use client";

export default function BrainError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex h-64 flex-col items-center justify-center gap-4">
      <p className="text-sm text-white/40">Erreur lors du chargement de la section</p>
      <p className="font-mono text-xs text-white/20">{error.message}</p>
      <button
        onClick={reset}
        className="rounded border border-white/10 px-3 py-1.5 text-xs text-white/30 transition-colors hover:text-white/60"
      >
        Réessayer
      </button>
    </div>
  );
}

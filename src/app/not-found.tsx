import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-sm text-center space-y-4">
        <h1 className="font-display text-8xl text-primary">404</h1>
        <p className="text-foreground/60 text-sm">Cette page n&apos;existe pas.</p>
        <Link
          href="/"
          className="inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Retour a l&apos;accueil
        </Link>
      </div>
    </main>
  );
}

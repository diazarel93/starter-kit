import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-sm space-y-4 text-center">
        <h1 className="font-display text-primary text-8xl">404</h1>
        <p className="text-foreground/60 text-sm">Cette page n&apos;existe pas.</p>
        <Link
          href="/"
          className="bg-primary text-primary-foreground inline-block rounded-lg px-4 py-2 text-sm font-medium"
        >
          Retour a l&apos;accueil
        </Link>
      </div>
    </main>
  );
}

# [NOM DU PROJET]

## Stack

- Framework : [Next.js / React / etc.]
- Language : TypeScript (strict mode)
- Database : [Supabase / Prisma / etc.]
- Deploy : [Vercel / etc.]
- Style : [Tailwind CSS 4 / etc.]
- Tests : [Vitest + Playwright / etc.]

## Commands

- `npm run dev` — serveur local
- `npm run build` — build production
- `npm run lint` — verifier le code
- `npm test` — lancer les tests

## Architecture

- `src/app/` — pages et routes
- `src/components/` — composants reutilisables
- `src/lib/` — logique metier, utilitaires
- `src/hooks/` — hooks React custom

## Conventions

- Commits : conventional commits (`feat/fix/refactor/chore`)
- Branches : `feature/`, `fix/`, `chore/` -> PR -> main
- TypeScript strict, pas de `any`
- Toujours lire un fichier avant de le modifier
- Verifier build + tests avant push

## Rules

- JAMAIS push sur main directement
- JAMAIS commit des fichiers .env
- JAMAIS skip les hooks (`--no-verify`)
- TOUJOURS verifier build + tests avant push
- TOUJOURS lire un fichier avant de le modifier
- TOUJOURS formater avec Prettier avant de commit
- Pas de refactoring non demande
- Pas de features bonus non demandees

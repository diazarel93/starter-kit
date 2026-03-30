# [NOM DU PROJET]

## Langue
Reponds toujours en francais sauf si le code ou la doc l'exige en anglais.

## Stack

- Framework : Next.js 16 (App Router)
- Language : TypeScript (strict mode)
- Database : Supabase (PostgreSQL + Auth + RLS)
- Deploy : Vercel
- Style : Tailwind CSS 4
- Tests : Vitest + Playwright (E2E)

## Commands

- `npm run dev` — serveur local (Turbopack)
- `npm run build` — build production (DOIT passer avant push)
- `npm run lint` — verifier le code
- `npm run lint:fix` — corriger auto
- `npm run format` — formater avec Prettier
- `npm test` — lancer les tests (Vitest)
- `npm run test:e2e` — tests E2E (Playwright)
- `npm run check-all` — TypeScript + Lint + Format + Tests (lancer avant push)

## Architecture

- `src/app/` — pages et routes API (App Router)
- `src/components/` — composants reutilisables
- `src/components/ui/` — composants UI de base
- `src/lib/` — logique metier, utilitaires, API clients
- `src/lib/supabase/` — clients Supabase (browser, server, middleware)
- `src/lib/auth.ts` — requireAuth(), requireAdmin(), getCurrentUser()
- `src/lib/ai.ts` — complete() et stream() avec Claude (Haiku/Sonnet/Opus)
- `src/lib/api.ts` — fetch wrapper : api.get/post/put/patch/delete → ApiResponse<T>
- `src/lib/email.ts` — sendEmail() via Resend
- `src/lib/constants.ts` — APP_NAME, APP_URL, APP_DESCRIPTION
- `src/lib/query-provider.tsx` — TanStack Query (deja dans layout.tsx)
- `src/hooks/useDebounce.ts` — debounce valeur avec delai configurable
- `src/hooks/useLocalStorage.ts` — persistance locale [value, setValue, remove]
- `src/types/index.ts` — ApiResponse<T>, PaginatedResponse<T>, AIMessage
- `src/types/database.ts` — types auto-generes par `npm run db:types`
- `e2e/` — tests end-to-end Playwright

## Conventions

- Commits : conventional commits (`feat/fix/refactor/chore`)
- Branches : `feature/`, `fix/`, `chore/` -> PR -> main
- TypeScript strict, pas de `any`
- Toujours lire un fichier avant de le modifier
- Verifier build + tests avant push

## Agents disponibles

- `design-director` — DA senior, 5 phases, prototypes visuels → invoquer pour tout travail UI/design
- `code-reviewer` — review securite + patterns + bugs avant push → invoquer avec "review" ou "pret a pusher ?"
- `db-architect` — schema Supabase, RLS, migrations, index → invoquer pour tout travail DB
- `feature-planner` — planifie avant de coder, decoupe en taches atomiques → invoquer avant toute feature M/L
- `cto-advisor` — veille tech, audit archi, business moat, investor red flags → invoquer pour vision long terme
- `ai-auditor` — qualite pipeline AI, modeles deprecies, couts, hallucinations → invoquer si l'AI se degrade ou coute trop cher
- `dependency-sentinel` — CVE, packages outdated, modeles AI deprecies → invoquer avant chaque release

## Token Routing — OBLIGATOIRE

Evaluer la complexite de chaque tache et recommander le bon modele :

| Tache | Modele | Commande |
|-------|--------|----------|
| Lire fichiers, typos, boilerplate, questions simples | Haiku | `/model haiku` |
| Feature, debug, tests, composants UI, migrations | **Sonnet (defaut)** | `/model sonnet` |
| Archi complexe, debug impossible, refacto 10+ fichiers | Opus | `/model opus` |

**Avant une grosse tache**, estimer le cout :
```
Estimation : [description]
- Sonnet : ~XX K tokens → ~X.XX€
- Opus   : ~XX K tokens → ~X.XX€  (x5)
- Recommandation : [modele] car [raison]
```

**Regles d'economie :**
- Lire le CLAUDE.md avant d'explorer le projet
- Utiliser Glob/Grep avant de lancer un Agent (10x moins cher)
- Ne jamais relire un fichier deja lu dans la conversation
- Suggerer `/compact` si la conversation depasse ~50 echanges
- Reponses courtes et directes, pas de resumes inutiles

**Alertes cout :**
- Si la tache en cours ne justifie pas Opus → le dire
- Apres ~2h de travail intense → rappeler la consommation estimee

## Rules

> Voir aussi `RULES.md` — regles auto-generees qui s'enrichissent au fil du projet.

- JAMAIS push sur main directement
- JAMAIS commit des fichiers .env
- JAMAIS skip les hooks (`--no-verify`)
- TOUJOURS lancer `npm run check-all` avant push
- TOUJOURS lire un fichier avant de le modifier
- TOUJOURS formater avec Prettier avant de commit
- Pas de refactoring non demande
- Pas de features bonus non demandees
- Reponses concises — pas de blabla, pas de resume de ce qu'on vient de faire

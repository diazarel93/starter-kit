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
- AI : Claude API via `@anthropic-ai/sdk`

## Commands

- `npm run dev` — serveur local (Turbopack, port 3010)
- `npm run build` — build production (DOIT passer avant push)
- `npm run lint` — verifier le code
- `npm run lint:fix` — corriger auto
- `npm run format` — formater avec Prettier
- `npm test` — lancer les tests (Vitest)
- `npm run test:e2e` — tests E2E (Playwright)
- `npm run check-all` — TypeScript + Lint + Format + Tests (lancer avant push)
- `npm run db:types` — regenerer les types Supabase

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

## Slash Commands disponibles

- `/check` — TypeScript + Lint + Tests + verdict avant push
- `/ship` — workflow complet : check → commit → push → PR
- `/pr` — créer une PR GitHub avec body structuré
- `/migrate <desc>` — créer et appliquer une migration Supabase
- `/bughunter [scope]` — inspecter le codebase et trouver les bugs par catégorie
- `/ultraplan <feature>` — planification profonde avant de coder
- `/simplify [fichier]` — review + simplification du code modifié

## Token Routing — OBLIGATOIRE

Evaluer la complexite de chaque tache et recommander le bon modele :

| Tache | Modele | Commande |
|-------|--------|----------|
| Lire fichiers, typos, boilerplate, questions simples | Haiku | `/model haiku` |
| Feature, debug, tests, composants UI, migrations | **Sonnet (defaut)** | `/model sonnet` |
| Archi complexe, debug impossible, refacto 10+ fichiers | Opus | `/model opus` |

### Prix exacts (source: Claude Code source code)

| Modele | Input | Output | Cache création | Cache lecture |
|--------|-------|--------|----------------|---------------|
| Haiku | $1/M | $5/M | - | - |
| Sonnet | $3/M | $15/M | $18.75/M | $1.50/M |
| Opus | $15/M | $75/M | - | - |

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

**Strategies de compaction (quand le contexte est long) :**
- `/compact` — microcompact (resume le plus vieux contexte)
- Nouvelle conversation — compaction complete (recommande apres 2h de travail intensif)

## Hooks configurés (.claude/settings.json)

- **PostToolUse Edit/Write** → Prettier s'execute automatiquement sur `.ts/.tsx/.css/.json`
- **PreToolUse Bash** → Alerte si commande destructive detectee (`rm`, `git reset --hard`)
- Exit code 2 dans un hook = deny automatique de l'action

**Evenements de hooks disponibles** (les + utiles) :
- `PreToolUse` — avant execution d'un outil (peut bloquer avec exit 2)
- `PostToolUse` — apres execution (peut marquer comme erreur)
- `PostToolUseFailure` — apres echec d'un outil

## Configuration files

- `.claude/settings.json` — permissions projet + hooks (versionné)
- `.claude/settings.local.json` — overrides machine-locaux (gitignore, ne pas committer)
- `~/.claude/settings.json` — config globale utilisateur
- Priorite : `settings.local.json` > `settings.json` > `~/.claude/settings.json`

## Rules

> Voir aussi `RULES.md` — regles auto-generees qui s'enrichissent au fil du projet.

- JAMAIS push sur main directement
- JAMAIS commit des fichiers .env ou secrets
- JAMAIS skip les hooks (`--no-verify`)
- TOUJOURS lancer `npm run check-all` avant push (ou utiliser `/ship`)
- TOUJOURS lire un fichier avant de le modifier
- TOUJOURS formater avec Prettier avant de commit (hook automatique)
- Pas de refactoring non demande
- Pas de features bonus non demandees
- Reponses concises — pas de blabla, pas de resume de ce qu'on vient de faire
- RLS obligatoire sur chaque nouvelle table Supabase
- `any` TypeScript interdit — generics ou `unknown`

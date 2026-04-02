# Decisions d'architecture — Cross-projets

> Decisions qui s'appliquent a TOUS les projets de Romain.
> Quand une decision est prise sur un projet, l'ajouter ici pour qu'elle beneficie a tous.
> Format : decision + contexte + date.

---

## Frontend / React

- **TanStack Query pour tout fetch** — jamais `useEffect` pour fetcher des donnees. Raison : cache, invalidation, loading states automatiques. (2026-03)
- **`next/image` avec dimensions explicites** — evite le layout shift CLS. (2026-03)
- **Tailwind CSS 4** — pas de CSS modules, pas de styled-components. (2026-03)
- **TypeScript strict, 0 `any`** — generics ou `unknown`. Raison : les bugs de type coutent cher en prod. (2026-03)

## Backend / API

- **Validation zod obligatoire** aux frontieres (routes API, server actions, webhooks). (2026-03)
- **`SUPABASE_SERVICE_ROLE_KEY` server-side uniquement** — jamais dans le code client. (2026-03)
- **Server Actions pour les mutations** — pas de routes API custom pour les operations simples. (2026-03)

## Base de donnees (Supabase)

- **RLS obligatoire sur chaque table** — RLS desactive = faille en prod. (2026-03)
- **`timestamptz` pas `timestamp`** — toujours avec timezone. (2026-03)
- **`IF NOT EXISTS` dans les migrations** — idempotence obligatoire. (2026-03)
- **Jamais modifier une migration existante** — creer une nouvelle. (2026-03)

## Python / FastAPI (Kura, Agent AI)

- **FastAPI + Pydantic v2** — validation, serialisation, schéma auto. Jamais de dict nu dans les routes. (2026-04)
- **LLM Router multi-provider** — Anthropic principal + OpenAI fallback automatique. Pattern : `LLMRouter(config)` avec `await router.complete(messages)`. (2026-04)
- **Agent = déterministe + LLM** — la logique critique (guardrails, verdicts) est TOUJOURS déterministe. Le LLM fait uniquement le parsing et le résumé lisible. Jamais laisser le LLM décider d'un verdict critique. (2026-04)
- **`TEST_MODE=1 pytest -q`** avant tout push backend Python. (2026-04)
- **Ruff pour lint Python** — `ruff check .` + `ruff format .`. Pas de flake8, pas de black séparé. (2026-04)
- **Migrations SQL** : jamais modifier une existante — toujours créer une nouvelle (même règle que Supabase). (2026-04)
- **Guardrails = post-LLM obligatoires** — l'ordre du pipeline est immuable : Truth → Detection → RAG → Prompt → LLM → **Guardrails** → Response. (2026-04)

## AI / Claude API

- **Routing modele** : Haiku 4.5 (simple) → Sonnet 4.6 (standard) → Opus 4.6 (complexe). **Haiku 3 déprécié le 19 avril 2026.** (2026-04)
- **Sonnet 4.6** : contexte 1M tokens (beta), extended thinking, meilleure performance agentic. Modèle par défaut. (2026-04)
- **max_tokens 300k** disponible sur Message Batches API (Opus + Sonnet 4.6). Utiliser pour les gros jobs en batch. (2026-04)
- **Streaming pour les longues generations** — meilleure UX. (2026-03)
- **Toujours citer la source** dans les reponses AI (RAG, DB, etc.). (2026-03)
- **Context caching** — system prompt statique → `cache_control: ephemeral`. Économie ~50% sur les requêtes répétitives. (2026-04)

## Git / Workflow

- **Jamais push sur main** — toujours branche + PR. (2026-03)
- **Conventional commits** : feat/fix/chore/refactor/docs/test. (2026-03)
- **`check-all` avant push** — TypeScript + lint + tests. (2026-03)
- **Jamais `git add -A`** — ajouter les fichiers par nom. (2026-03)

## Claude Code

- **CLAUDE.md obligatoire** dans chaque projet. (2026-04)
- **settings.json avec hooks Prettier** dans chaque projet. (2026-04)
- **settings.local.json dans .gitignore** — overrides machine-locaux. (2026-04)

---

> Pour ajouter une decision : "Ajoute dans decisions.md : [decision] — [contexte]"

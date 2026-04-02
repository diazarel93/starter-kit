# Formation — Devenir Architecte AI / Top Vibe Coder

## Niveau 1 : Les fondamentaux (tu y es)

### Ce que tu sais deja
- [x] TypeScript + Next.js
- [x] Supabase (Auth + DB + RLS)
- [x] Tailwind CSS
- [x] Git + GitHub (PRs, branches, CI)
- [x] Claude Code (config, CLAUDE.md, permissions)

### Ce que tu dois solidifier
- [ ] **TypeScript avance** — generics, utility types, type guards, discriminated unions
- [ ] **Patterns React** — compound components, render props, custom hooks avances
- [ ] **Architecture** — quand creer un hook vs un util vs un component vs un server action
- [ ] **Tests** — savoir quoi tester (pas tout, les bons trucs)

---

## Niveau 2 : Le vibe coding pro (1-2 mois)

### Principes
1. **Prompt engineering** — ecrire des instructions claires pour Claude, pas juste "fais moi un truc"
2. **CLAUDE.md driven development** — ton CLAUDE.md = ton architecte permanent
3. **Review ce que Claude produit** — ne jamais merge sans comprendre
4. **Iterer vite** — petit changement > tester > petit changement > tester
5. **Conventional commits** — chaque commit raconte une histoire

### Pratiques a adopter
- [ ] Toujours commencer par un plan avant de coder (`/plan` dans Claude)
- [ ] Ecrire le test AVANT le code (TDD light)
- [ ] Lire les PRs des autres (open source) pour apprendre les patterns
- [ ] Utiliser `git diff` pour reviewer ce que Claude a fait avant de commit

---

## Niveau 3 : Architecte AI (3-6 mois)

### Skills a developper
- [ ] **System design** — savoir dessiner une archi avant de coder
- [ ] **API design** — REST vs tRPC vs server actions, quand utiliser quoi
- [ ] **DB design** — normalisation, index, RLS policies, migrations propres
- [ ] **Auth patterns** — RBAC, sessions, JWT, middleware auth
- [ ] **Real-time** — WebSocket vs polling vs SSE, quand utiliser quoi
- [ ] **Edge computing** — middleware Vercel, edge functions, quand deployer ou
- [ ] **AI integration** — embeddings, RAG, function calling, streaming

### Projets a faire pour apprendre
1. **Un SaaS complet** avec auth, billing (Stripe), dashboard, API
2. **Un outil AI** avec RAG (embeddings + vector DB)
3. **Une app real-time** avec WebSocket ou Supabase Realtime
4. **Contribuer a un open source** — meme un petit fix

---

## Niveau 4 : Top 1% (6-12 mois)

- [ ] **Monorepo** — Turborepo, packages partages
- [ ] **Infra as code** — Docker, CI/CD avance, preview environments
- [ ] **Observabilite** — logging structure, error tracking (Sentry), metrics
- [ ] **Performance** — Core Web Vitals, bundle analysis, caching strategies
- [ ] **Security** — OWASP top 10, CSP, rate limiting, input sanitization
- [ ] **AI agents** — Claude Agent SDK, multi-step workflows, tool use

---

## Veille quotidienne — Sources a suivre

### Twitter/X (les comptes essentiels)
- @anthropabornes — Claude updates
- @vercel — Next.js + deploy
- @suabornes — Supabase updates
- @t3dotgg — Theo, best practices React/TS
- @jaredpalmer — Turborepo, DX
- @shadcn — UI components, design systems
- @kabornes_dotdev — web dev tips
- @aiabornes — AI engineering

### Newsletters
- **Bytes.dev** — JS/TS weekly
- **This Week in React** — React ecosystem
- **The Rundown AI** — AI news daily
- **Latent Space** — AI engineering deep dives
- **TLDR** — tech news daily

### YouTube
- **Theo (t3.gg)** — React/Next.js opinions + best practices
- **Fireship** — 100 seconds explainers
- **AI Jason** — AI tools et workflows

### GitHub
- Suivre les repos : next.js, supabase, claude-code, shadcn/ui
- Lire les release notes a chaque update

---

## Routine quotidienne recommandee

| Moment | Action | Temps |
|--------|--------|-------|
| Matin | Lire la veille AI (newsletter/Twitter) | 15 min |
| Avant de coder | Ecrire le plan dans Claude (`/plan`) | 5 min |
| Pendant | Coder par petits increments, tester souvent | — |
| Apres chaque feature | Review le diff, comprendre chaque ligne | 10 min |
| Soir | 1 article technique ou 1 video (Theo/Fireship) | 20 min |
| Dimanche | Review de la semaine : qu'est-ce que j'ai appris ? | 30 min |

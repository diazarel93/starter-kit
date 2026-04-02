# Roadmap — Architecte AI / Top Vibe Coder 2026

## Ou tu en es

Tu sais deja : TypeScript, Next.js, Supabase, Tailwind, Git, Claude Code.
Ca te place au-dessus de 80% des devs. Mais pour etre dans le top, voici la suite.

---

## Phase 1 : Vibe Coder Pro (maintenant → +1 mois)

### Specification Engineering (remplace "prompt engineering")
Le vrai skill de 2026 c'est plus juste "bien prompter". C'est ecrire des specs structurees AVANT de coder :
- Scope clair (ce qu'on fait, ce qu'on fait PAS)
- Contraintes (perf, secu, compatibilite)
- Architecture cible
- Criteres d'acceptation

**Pratique :** Avant chaque feature, ecris 5-10 lignes de spec dans Claude avant de coder.

### Review rigoureuse
92% des devs US utilisent le vibe coding. La difference entre un junior et un senior :
- Le junior merge sans lire
- Le senior review chaque diff, comprend chaque ligne, challenge l'AI

**Pratique :** `git diff` avant chaque commit. Si tu comprends pas une ligne, demande a Claude d'expliquer.

### Plan Mode
Utilise `/plan` pour :
- Features multi-fichiers
- Code que tu connais pas
- Decisions d'architecture
Skip le plan pour les petits fix evidents.

### Agent Teams (nouveau 2026)
Au lieu d'un seul Claude, lance plusieurs agents en parallele :
- Un qui code
- Un qui teste
- Un qui review

---

## Phase 2 : AI Engineer (mois 2-4)

### Skills a acquerir
- [ ] **Python** — meme basique, c'est le langage de l'AI
- [ ] **Embeddings & Vector Search** — comprendre comment les mots deviennent des nombres
- [ ] **RAG (Retrieval Augmented Generation)** — chercher dans une DB pour enrichir les reponses AI
- [ ] **Claude API / Agent SDK** — construire tes propres agents
- [ ] **Async programming** — gerer plusieurs agents en parallele

### Projet concret a faire
Construire un **assistant AI pour Banlieuwood** :
- Indexe tous les docs du projet (embeddings)
- Repond aux questions des intervenants
- Utilise RAG pour etre precis
- Stack : Claude API + Supabase pgvector

---

## Phase 3 : Architecte AI (mois 4-8)

### Skills avances
- [ ] **System design** — dessiner une archi avant de coder
- [ ] **Multi-agent orchestration** — CrewAI, Claude Agent SDK
- [ ] **Fine-tuning** — LoRA/QLoRA pour adapter un modele a ton domaine
- [ ] **MLOps** — deployer et monitorer des systemes AI en prod
- [ ] **Cost optimization** — choisir le bon modele pour le bon usage (Haiku vs Sonnet vs Opus)

### Projet concret
Construire **Kura AI** comme un vrai produit AI :
- Agents autonomes qui collaborent
- Pipeline de donnees
- Monitoring et observabilite
- Scale-first architecture

---

## Phase 4 : Top 1% (mois 8-12)

- [ ] Contribuer a l'open source (Claude Code, Supabase, Next.js)
- [ ] Publier des articles techniques
- [ ] Construire un side project AI qui genere du revenu
- [ ] Parler a des meetups / conferences

---

## Veille quotidienne — Sources

### Newsletters (recevoir par email chaque matin)
1. **The Rundown AI** — AI news quotidien (s'inscrire : therundown.ai)
2. **TLDR** — tech news quotidien (tldr.tech)
3. **Bytes.dev** — JS/TS weekly
4. **This Week in React** — React weekly
5. **Latent Space** — AI engineering deep dives

### Twitter/X (comptes a suivre)
- @AnthropicAI — Claude updates
- @vercel — Next.js + deploy
- @supabase — Supabase updates
- @t3dotgg — Theo, best practices React/TS
- @kabornes_dotdev — web dev
- @swyx — AI engineering (fondateur Latent Space)
- @karpathy — le gars qui a invente le terme "vibe coding"

### YouTube (15-20 min/jour)
- **Theo (t3.gg)** — React/Next.js + opinions tech
- **Fireship** — explications rapides 100 secondes
- **AI Jason** — outils et workflows AI

### GitHub repos a suivre
- anthropics/claude-code
- vercel/next.js
- supabase/supabase
- shadcn/ui
- hesreallyhim/awesome-claude-code

---

## Routine quotidienne

| Quand | Quoi | Temps |
|-------|------|-------|
| Matin | Lire newsletter AI (Telegram bot) | 10 min |
| Avant de coder | Ecrire la spec / `/plan` | 5 min |
| Pendant | Petits increments, tester souvent | — |
| Apres chaque commit | Review le diff | 5 min |
| Soir | 1 video tech (Theo/Fireship) | 15 min |
| Dimanche | Review semaine + mettre a jour ce roadmap | 30 min |

---
name: learnings
description: Leçons apprises cross-projets — patterns qui ont fonctionné, bugs récurrents, décisions qui ont évité des problèmes
type: project
---

# Learnings — Cross-projets

> Ce fichier grandit au fil du temps. Format : date + leçon + contexte.
> Ajouter une entrée : "Ajoute dans learnings.md : [leçon] — [contexte]"

---

## Patterns qui fonctionnent

- **LLM Router multi-provider** (Anthropic + OpenAI fallback) — évite les downtime si un provider a des problèmes. Pattern validé sur Kura. (2026-04)
- **Guardrails post-LLM** — la logique critique (verdicts, sécurité) doit être déterministe APRÈS le LLM, jamais laissée au LLM. Leçon Kura. (2026-04)
- **Spec engineering avant de coder** — écrire 5 lignes de spec avant de prompter Claude = résultat 3x plus précis. Moins de tokens gaspillés. (2026-04)
- **Agents parallèles + agent vérificateur** — après tout job multi-agents, toujours lancer un agent de vérification croisée. Évite les incohérences silencieuses. (2026-04)

## Bugs récurrents à éviter

- **Fallback hardcodé dans CSS** — `var(--token, #fallback)` : le fallback doit correspondre au thème cible (dark → fallback sombre, light → fallback clair). Si ce n'est pas cohérent, le fallback casse le dark mode. (2026-03)
- **Tokens parallèles** — ne jamais créer un 2ème système de tokens CSS si un 1er existe. Toujours grep avant de créer. (2026-03)
- **Migration existante modifiée** — ne jamais modifier une migration Supabase déjà appliquée. Toujours créer une nouvelle. (2026-03)
- **Mocks DB dans les tests** — les tests mockés passent mais la migration prod échoue. Toujours tester contre une vraie DB (Supabase local). (2026-04)

## Décisions techniques tranchées

→ Voir `decisions.md` pour la liste complète.

## Ressources clés

- Claude Code Playbook : patterns d'agents, hooks, mémoire
- claw-code : agent de test automatique (clique partout, énumère les bugs)
- markdown.engineering : tous les patterns Claude Code avancés
- `docs/ROADMAP.md` : roadmap personnelle AI Architect 2026

---

> Pour enrichir : "Ajoute dans learnings.md : [quoi] — [pourquoi c'est une leçon]"

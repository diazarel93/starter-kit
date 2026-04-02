# Brain Agent — Cerveau Autonome

Agent AI qui tourne en continu, observe tous les projets, et agit de façon autonome.

## Architecture

```
index.js          → entry point + boucle 30min
agent.js          → boucle agentic (Claude Haiku + tools)
goals.md          → objectifs + règles du cerveau
.agent-memory.json → mémoire persistante entre les cycles

tools/
  telegram.js     → envoyer des messages Telegram
  git.js          → lire l'état git de tous les projets
  files.js        → lire decisions.md, goals, mémoire
```

## Ce que l'agent fait

Toutes les **30 minutes**, il :
1. Lit l'état git de tous les projets (commits, branches, uncommitted)
2. Consulte sa mémoire (ce qu'il a déjà alerté)
3. Appelle **Claude Haiku** pour décider quoi faire
4. Agit : envoie un message Telegram, mémorise, ou ne fait rien
5. Se rendort jusqu'au prochain cycle

### Entre 22h et 7h
Mode silencieux — aucun message sauf urgence P0.

## Lancer

```bash
# One-shot (pour test ou cron)
node index.js --once

# Boucle continue
node index.js

# Dev (hot reload)
npm run dev
```

## Installation persistante (launchd)

Le plist est dans `~/Library/LaunchAgents/com.romain.brain-agent.plist`.

```bash
# Démarrer
launchctl load ~/Library/LaunchAgents/com.romain.brain-agent.plist

# Arrêter
launchctl unload ~/Library/LaunchAgents/com.romain.brain-agent.plist

# Logs
tail -f /tmp/brain-agent.log
tail -f /tmp/brain-agent-error.log

# Statut
launchctl list | grep brain-agent
```

## Outils disponibles (tools Claude)

| Outil | Action |
|-------|--------|
| `send_telegram` | Envoyer un message à Romain |
| `get_projects_status` | Lire l'état git de tous les projets |
| `save_to_memory` | Mémoriser une info pour les prochains cycles |
| `do_nothing` | Ne rien faire (tout va bien) |

## Modifier les objectifs

Éditer `goals.md` — le cerveau le lit à chaque cycle.
Pas besoin de redémarrer.

## Coût estimé

- Modèle : Claude Haiku 4.5 (`claude-haiku-4-5-20251001`)
- ~30 cycles/jour × ~2K tokens = ~60K tokens/jour
- **~$0.05/jour — ~$1.50/mois**

## Prochaines évolutions

- [ ] Outil `check_api_costs` — lire Anthropic + Supabase usage
- [ ] Outil `check_build_status` — GitHub Actions CI
- [ ] Outil `web_search` — veille WADA, stack tech
- [ ] Outil `create_task` — créer une tâche dans decisions.md
- [ ] Mémoire vectorielle — recherche sémantique dans l'historique
- [ ] Multi-agent — déléguer à des sous-agents spécialisés

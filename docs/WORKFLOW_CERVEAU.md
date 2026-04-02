# Workflow du Cerveau — Comment tout fonctionne

> Ce document explique ce qui se passe exactement, quand, et comment.

---

## Vue d'ensemble

```
TON MAC
│
├── brain-agent (tourne 24/7 en fond)
│   └── toutes les 30 min : observe → raisonne → agit
│
├── telegram-bot interactive (tourne 24/7 en fond)
│   └── répond à tes commandes instantanément
│
└── crons (5 messages automatiques/jour)
    ├── 08h00 → veille tech
    ├── 10h00 → 3 mots du jour
    ├── 12h00 → leçon Kura
    ├── 17h00 → rappel quiz
    └── 20h00 → quiz automatique
```

---

## Ce qui tourne en continu

### 1. brain-agent (PID actif, launchd)
**Fichier** : `tools/brain-agent/index.js`
**Cycle** : toutes les 30 minutes

À chaque cycle, il fait exactement ça dans l'ordre :
1. Lit sa mémoire (`.agent-memory.json`)
2. Appelle Claude Haiku avec les outils disponibles
3. Haiku décide quoi faire :
   - `get_projects_status` → lit git de tous les projets
   - `get_api_costs` → vérifie les coûts Anthropic ce mois
   - `check_builds` → statut CI/CD GitHub
   - `check_wada` → site WADA accessible ?
   - `web_search` → veille si pertinent
   - `get_recent_alerts` → évite les doublons
   - `send_telegram` → alerte si quelque chose mérite attention
   - `create_task` → écrit dans decisions.md si important
   - `save_to_memory` → mémorise pour les prochains cycles
   - `do_nothing` → si tout est nominal
4. Met à jour sa mémoire
5. Se rendort 30 min

**Entre 22h et 7h** : mode silencieux, aucun Telegram sauf urgence P0.

**Coût** : ~$0.05/jour (Haiku × 48 cycles)

---

### 2. telegram-bot interactive (PID actif, launchd)
**Fichier** : `tools/telegram-bot/interactive.js`

Répond à tes messages en temps réel :

| Commande | Ce qui se passe |
|----------|-----------------|
| `/quiz` | Génère un quiz Haiku FR+EN sur la leçon du jour |
| `/kura` | Affiche la leçon Kura du curriculum JSON |
| `/tech` | Affiche la leçon tech du curriculum |
| `/veille` | Lance veille.js maintenant |
| `/agents` | Table de routing : situation → agent |
| `/dispatch [problème]` | Lance le dispatcher → route vers l'agent + crée règle |
| `/idea [idée]` | Lance l'agent Idée → plan complet en ~2min (Sonnet) |
| `/patterns` | Affiche les bugs/incompréhensions récurrents détectés |
| `/status` | État du système |

---

## Ce que tu déclenches toi (manuel)

### Pendant une session Claude Code
**midcoach** : Chaque fois que tu édites un fichier, un hook PostToolUse analyse le fichier et envoie un tip si quelque chose mérite attention (rate limit 25min entre tips).

**Stop hook** : Quand tu quittes Claude Code, `coach.js` analyse le git diff de la session et envoie un coaching + recommande l'agent suivant.

### En dehors de Claude Code
```bash
# Une idée → plan complet
node tools/brain-agent/idea.js "mon idée"

# Un problème → agent recommandé
node tools/brain-agent/dispatch.js "j'ai un bug RLS"

# Forcer un cycle du cerveau maintenant
node tools/brain-agent/index.js --once
```

---

## Workflow de travail recommandé

### Début de session
1. Ouvre Claude Code dans le projet
2. Dis ce que tu veux faire — feature-planner est invoqué automatiquement pour les features moyennes/larges

### Pendant la session
- Claude Code travaille avec toi
- midcoach envoie des tips Telegram si quelque chose est notable (max 1 toutes les 25min)
- Tu peux taper `/dispatch [problème]` depuis Telegram si tu bloques

### Fin de session
1. Tu quittes Claude Code
2. Stop hook → coach.js analyse ce qui a été fait
3. Tu reçois sur Telegram :
   - 1 feedback sur ce que tu viens de coder
   - L'agent recommandé pour la suite
   - Un conseil concret

### Pendant la journée (sans coder)
- 08h : veille tech dans ta stack
- 10h : 3 mots (Dev AI + Kura + Anglais)
- 12h : leçon Kura du jour
- 17h : rappel du quiz du soir
- 20h : quiz automatique (Kura lun/mer/ven, Tech mar/jeu, Both week-end)
- brain-agent surveille et alerte si besoin

### Quand tu as une idée
Envoie `/idea ton idée` dans Telegram → 2min plus tard tu as :
- Analyse marché (recherche web)
- Plan Markdown complet dans `docs/ideas/`
- 3 premières tâches dans `decisions.md`
- Résumé Telegram

---

## Agents disponibles — Quand invoquer qui

| Situation | Agent | Comment |
|-----------|-------|---------|
| Tu vas coder une feature | `feature-planner` | Avant de commencer |
| Tu touches la DB Supabase | `db-architect` | Dès qu'il y a une migration |
| Tu vas pusher | `code-reviewer` | Avant tout push |
| Tu as une question design | `design-director` | Pour tout UI/UX |
| Tu travailles sur Stripe | `stripe-expert` | Paiements, webhooks |
| Tu fais du SEO | `seo-specialist` | Metadata, Lighthouse |
| Tu veux scaler | `growth-architect` | Retention, acquisition |
| Tu ajoutes une langue | `i18n-manager` | Traductions |
| Tu prends une décision archi | `cto-advisor` | Vision long terme |
| Tu répètes le même bug | `agent-guardian` | Surveille automatiquement |
| Tu as une idée | `idea agent` | `/idea` sur Telegram |
| Tu bloques sur un problème | `dispatcher` | `/dispatch` sur Telegram |

---

## Fichiers clés à connaître

```
starter-kit/
  decisions.md              ← décisions + tâches (live, écrit par l'agent aussi)
  docs/BRAIN_DASHBOARD_SPEC.md  ← spec du dashboard
  docs/WORKFLOW_CERVEAU.md  ← ce fichier
  docs/ideas/               ← plans générés par l'agent Idée
  docs/curriculum/          ← leçons Kura + tech (JSON)

  tools/brain-agent/
    goals.md                ← objectifs du cerveau (éditer pour modifier son comportement)
    .agent-memory.json      ← mémoire persistante entre cycles
    .detected-patterns.json ← bugs/patterns récurrents détectés
    .api-costs.json         ← coûts Anthropic ce mois

  .claude/agents/           ← les 17 agents Claude Code
  .claude/commands/         ← les 15 commandes slash
  .claude/settings.json     ← hooks (midcoach, stop coach)
```

---

## Comment modifier le comportement du cerveau

**Changer les objectifs** : éditer `tools/brain-agent/goals.md` — lu à chaque cycle, pas besoin de redémarrer.

**Changer la fréquence** : dans `tools/brain-agent/index.js`, modifier `INTERVAL_MS` (défaut 30min).

**Ajouter un outil** : créer `tools/brain-agent/tools/mon-outil.js` + l'ajouter dans `agent.js` (TOOLS + executeTool).

**Changer les crons** : `crontab -e` — 5 lignes, une par message.

**Voir les logs en direct** :
```bash
tail -f /tmp/brain-agent.log
tail -f /tmp/telegram-bot.log
```

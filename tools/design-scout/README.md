# Design Scout — Pipeline visuel Banlieuwood

## 2 modes d'utilisation

### MODE 1 — Dans Claude Code (gratuit, inclus abonnement)
Tu es dans une session Claude Code → utilise les agents directement ici.
Zéro coût API supplémentaire.

### MODE 2 — Autonome en terminal (coûte des crédits API)
`audit-agent.mjs` tourne seul avec `ANTHROPIC_API_KEY`.
À utiliser UNIQUEMENT si tu veux faire tourner le pipeline sans ouvrir Claude Code.

---

## Workflow standard (dans Claude Code)

### 1. Capturer un site
```bash
node visual-analyzer.mjs https://exemple.com
# ou batch :
echo '["url1","url2"]' | node visual-analyzer.mjs --batch
```

### 2. Auditer les captures
Dans Claude Code, demander :
> "Audite les sites capturés dans captures/visual-analysis/ — lis les images et mets à jour la KB"

L'agent lit les images directement, score /10 comme DA senior, update knowledge-base.json.
**Gratuit — inclus dans l'abonnement Claude Code.**

### 3. Voir l'état de la KB
```bash
node visual-auditor.mjs --report
```

### 4. Élaguer les mauvais scores
```bash
node visual-auditor.mjs --prune 6
```

### 5. Améliorer un design (design-choices.html)
Dans Claude Code, invoquer :
> "@design-director améliore la version A de design-choices-v2.html avec les leçons de la KB"

---

## Agents disponibles dans Claude Code

| Agent | Quand l'utiliser |
|-------|-----------------|
| Agent général | Audit visuel batch (lire images + scorer) |
| `@design-director` | Améliorer un design avec la KB comme référence |
| `@design-critic` | Auditer un design contre les 21 world-class |

---

## Fichiers clés

| Fichier | Rôle |
|---------|------|
| `knowledge-base.json` | 552 sites scorés — la bible |
| `knowledge-gaps.md` | Ce qui manque encore dans la KB |
| `visual-analyzer.mjs` | Capture Playwright (hero + sections + mobile) |
| `visual-auditor.mjs` | Rapport, élagage KB, instructions audit |
| `audit-agent.mjs` | Pipeline autonome (hors Claude Code, coûte API) |
| `design-choices.html` | V1 — 3 directions landing Banlieuwood |
| `design-choices-v2.html` | V2 — upgradée avec leçons des 21 world-class |
| `captures/visual-analysis/` | ~183 sites capturés |

---

## KB actuelle (03/04/2026)
- **552 sites** qualifiés (élagués à ≥5/10)
- **21 world-class** (9-10/10) : Sagmeister 10/10, A24, Collins/Figma, Vercel, Raycast, Resend, Stripe, System Magazine, The Gentlewoman, Huge Inc, Instrument, Fantasy.co, Monolith Studio, Murmure, Criterion, Kinfolk, Nosigner, Brestbrestbrest, Neon, Base Design, Fantastic Man
- **175 sites audités visuellement**

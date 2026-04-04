# Design Scout — Workflow étape par étape

> Lis ce fichier au début de chaque session design-scout.
> Chaque étape = une commande à lancer, dans l'ordre.

---

## ÉTAPE 0 — Où en est-on ?

```bash
cd ~/starter-kit/tools/design-scout
node scripts/visual-auditor.mjs --report
```

Résultat attendu : combien de sites audités, combien de captures pending, distribution des scores.

---

## ÉTAPE 1 — Capturer de nouveaux sites

```bash
# Un seul site
node scripts/visual-analyzer.mjs https://exemple.com

# Plusieurs sites d'un coup
echo '["https://site1.com","https://site2.com"]' | node scripts/visual-analyzer.mjs --batch
```

Résultat attendu : dossier créé dans `captures/visual-analysis/slug-du-site/` avec ~32 images JPG.

---

## ÉTAPE 2 — Vérifier les captures

```bash
ls captures/visual-analysis/slug-du-site/
```

Vérifier qu'il y a bien hero.jpg, mobile.jpg, sections, footer.
Si le dossier est vide ou < 5 images → recapturer (popup pas tué, Cloudflare, etc.)

---

## ÉTAPE 3 — Auditer les captures (dans Claude Code — gratuit)

Dans Claude Code, dire :
> "Audite les captures dans captures/visual-analysis/ — lis les images et mets à jour knowledge-base.json"

Claude lance des agents en parallèle qui lisent les images, scorent /10 comme DA senior, et updatent la KB automatiquement.

**Ne pas utiliser audit-agent.mjs ici — ça coûte des crédits API séparés.**

---

## ÉTAPE 4 — Élaguer les mauvais scores

```bash
node scripts/visual-auditor.mjs --prune 6
```

Supprime de la KB tous les sites avec score < 6. Confirme avant de lancer si tu veux vérifier d'abord avec `--report`.

---

## ÉTAPE 5 — Combler les gaps de la KB

```bash
cat knowledge-gaps.md
```

Lire les gaps CRITIQUE non cochés. Dans Claude Code, dire :
> "Comble ces 3 gaps : [noms des gaps] — WebSearch + ajoute dans la KB"

---

## ÉTAPE 6 — Améliorer un design avec la KB

Dans Claude Code, dire :
> "@design-director audite design-choices-v2.html et propose des améliorations basées sur les 21 world-class de la KB"

---

## RAPPEL — Règle d'or

| Tâche | Outil |
|-------|-------|
| Capturer des sites | `node scripts/visual-analyzer.mjs` dans le terminal |
| Vérifier l'état | `node scripts/visual-auditor.mjs --report` dans le terminal |
| Auditer les images | Agent Claude Code (gratuit, inclus abonnement) |
| Élaguer la KB | `node scripts/visual-auditor.mjs --prune 6` dans le terminal |
| Améliorer un design | `@design-director` dans Claude Code |

---

## Prochaines étapes recommandées

- [ ] Recapturer les sites bloqués (Dezeen, Chimurenga, Droga5, arts.ac.uk)
- [ ] Combler gaps CRITIQUE : alimentation artisanale, onboarding flows, error pages
- [ ] Auditer design-choices-v2.html section par section avec @design-director

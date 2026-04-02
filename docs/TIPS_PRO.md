# Tips Pro — Astuces des meilleures equipes

## 1. Fichier RULES auto-genere (le tips que t'as vu)

L'idee : quand une erreur se repete, un agent cree automatiquement une regle
pour que ca ne se reproduise plus.

Comment faire :
- Cree un fichier `RULES.md` a la racine du projet (a cote de CLAUDE.md)
- Quand tu tombes sur un bug qui revient, dis a Claude :
  "Ajoute une regle dans RULES.md pour que cette erreur ne se reproduise plus"
- Claude l'ajoutera et le lira a chaque conversation

Exemple de RULES.md :
```markdown
# Rules (auto-generated)

- Ne jamais utiliser `any` dans les props de composants — utiliser des generics
- Les migrations Supabase doivent toujours avoir un DOWN (rollback)
- Les server actions doivent valider les inputs avec zod
- Ne pas utiliser useEffect pour fetcher des donnees — utiliser TanStack Query
```

## 2. Claude Code en equipe d'agents paralleles

Au lieu de tout faire sequentiellement :
```
"Lance 3 agents en parallele :
1. Agent 1 : ecris les tests pour [feature]
2. Agent 2 : implemente [feature]
3. Agent 3 : review le code existant de [module]"
```

## 3. /plan AVANT chaque feature

Jamais coder direct. Toujours :
1. `/plan` — Claude propose une architecture
2. Tu valides ou corriges
3. Claude code
4. Tu review le diff

## 4. Specification Engineering

Avant de prompter, ecris une spec :
```
Feature : Vote tap-to-vote
Scope : Remplacer les radio buttons par des cards cliquables
Contraintes : iPad Safari, touch events, pas de double-tap
Architecture : Component Vote dans src/components/play/
Criteres : 1 tap = 1 vote, feedback visuel instantane, accessible
Ne PAS faire : modifier le backend, changer l'API
```

## 5. Le diff review systematique

AVANT chaque commit :
```
git diff --stat    # vue d'ensemble
git diff           # detail
```
Si tu comprends pas une ligne → demande a Claude d'expliquer.

## 6. Effort adaptatif

- Petit fix evident → effort normal, pas de /plan
- Feature multi-fichiers → /plan + effort high
- Architecture → /plan + effort high + review

## 7. Status line

Tape `/statusline` dans Claude Code pour voir en temps reel :
- Modele actif
- % du contexte utilise
- Branche git
- Cout de la session

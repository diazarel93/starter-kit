---
paths:
  - "src/**/*.ts"
  - "src/**/*.tsx"
---

# Règles TypeScript — Chargées automatiquement sur tous les fichiers .ts/.tsx

## Non-négociable

- **0 `any`** — utiliser `unknown` + type guard, ou générics
- **0 `as Type`** sans validation préalable — préférer `satisfies` ou zod parse
- **`noUncheckedIndexedAccess`** implicite — toujours gérer le cas `undefined` sur les accès tableau
- Server Components par défaut — `"use client"` uniquement si absolument nécessaire (events, state, browser API)

## Patterns obligatoires

```typescript
// ✅ Bon
const result = schema.safeParse(data)
if (!result.success) throw new Error(result.error.message)
const typed = result.data

// ❌ Mauvais
const typed = data as MyType
```

## TanStack Query — obligatoire pour le fetch

```typescript
// ✅ Bon
const { data, isLoading, error } = useQuery({
  queryKey: ['resource', id],
  queryFn: () => fetchResource(id),
})

// ❌ Jamais
useEffect(() => { fetch('/api/resource').then(...) }, [])
```

## Composants Server vs Client

- `async` + `await` → Server Component
- `useState`, `useEffect`, event handlers → `"use client"`
- Données + UI dans le même composant → séparer en Server (data) + Client (interactif)

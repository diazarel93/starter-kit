---
paths:
  - "src/app/api/**/*.ts"
  - "src/lib/supabase/**/*.ts"
  - "supabase/**/*.sql"
---

# Règles Sécurité — API Routes & Base de données

Ces règles s'appliquent automatiquement quand tu travailles sur des fichiers API ou Supabase.

## Obligatoire sur les routes API

- Toujours valider l'input avec `zod` — jamais de `.json()` brut sans validation
- `SUPABASE_SERVICE_ROLE_KEY` uniquement server-side — jamais dans du code client
- Vérifier l'auth avant tout accès data : `const { data: { user } } = await supabase.auth.getUser()`
- Rate limiting sur les endpoints publics
- Ne jamais exposer les erreurs système à l'utilisateur (logger en privé, répondre générique)

## Obligatoire sur les migrations SQL

- `IF NOT EXISTS` sur toutes les créations (idempotence)
- RLS activé sur toutes les nouvelles tables : `ALTER TABLE xxx ENABLE ROW LEVEL SECURITY;`
- Policies CRUD explicites — jamais laisser une table sans policy
- `timestamptz` pas `timestamp` pour toutes les dates
- Ne jamais modifier une migration existante — créer une nouvelle

## Pattern route API sécurisée

```typescript
export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new Response('Unauthorized', { status: 401 })

  const body = await request.json()
  const parsed = mySchema.safeParse(body)
  if (!parsed.success) return new Response('Bad Request', { status: 400 })

  // ... logique métier
}
```

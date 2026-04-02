#!/bin/bash
# Hook PreToolUse — Protège les fichiers sensibles contre toute modification
# Usage dans settings.json : "command": ".claude/hooks/protect-files.sh"

INPUT=$(cat)
FILE=$(echo "$INPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('tool_input',{}).get('file_path',''))" 2>/dev/null || echo '')

PROTECTED=(
  ".env"
  ".env.local"
  ".env.production"
  "secrets/"
  ".git/"
  "supabase/migrations/"  # Protéger les migrations existantes
)

for pattern in "${PROTECTED[@]}"; do
  if [[ "$FILE" == *"$pattern"* ]]; then
    echo "[HOOK] Fichier protégé : $FILE ($pattern)" >&2
    echo "Pour modifier une migration : créer une NOUVELLE migration"
    exit 2
  fi
done

exit 0

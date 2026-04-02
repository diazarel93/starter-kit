#!/bin/bash
# Hook Stop — Vérifie que le travail est complet avant d'arrêter
# IMPORTANT : vérifier stop_hook_active pour éviter les boucles infinies
# Usage dans settings.json type "Stop"

INPUT=$(cat)
ACTIVE=$(echo "$INPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('stop_hook_active', False))" 2>/dev/null || echo 'False')

# Anti-boucle infinie obligatoire
if [ "$ACTIVE" = "True" ]; then
  exit 0
fi

# Vérification optionnelle : TypeScript sans erreur
# Décommenter si tu veux bloquer sur des erreurs TypeScript
# if ! npx tsc --noEmit 2>/dev/null; then
#   echo "[HOOK STOP] TypeScript a des erreurs — corriger avant de terminer" >&2
#   exit 2
# fi

exit 0

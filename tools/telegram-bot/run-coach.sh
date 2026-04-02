#!/bin/bash
# Hook Stop de Claude Code — envoie un coaching tip post-session
# Appelé automatiquement quand Claude Code termine une session
# Ne jamais exit non-zero — ne doit pas bloquer Claude Code

PROJECT_DIR="${PWD:-$(pwd)}"
PROJECT_NAME="$(basename "$PROJECT_DIR")"

# Passer l'API key si disponible dans l'env courant
export ANTHROPIC_API_KEY="${ANTHROPIC_API_KEY:-}"

/Users/diazarel/.nvm/versions/node/v20.19.5/bin/node \
  /Users/diazarel/starter-kit/tools/telegram-bot/coach.js \
  "$PROJECT_DIR" \
  "$PROJECT_NAME" \
  2>/tmp/coach-error.log &

exit 0

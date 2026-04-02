#!/bin/bash
set -e

echo "Installation du projet..."
echo ""

# Next.js + React
npm install next@latest react@latest react-dom@latest

# TypeScript — pinned a 5.x (6.x incompatible avec @typescript-eslint)
npm install -D typescript@^5.8.0 @types/react @types/react-dom @types/node

# Supabase
npm install @supabase/supabase-js @supabase/ssr

# Tailwind CSS 4
npm install -D tailwindcss @tailwindcss/postcss postcss

# Utils
npm install clsx tailwind-merge

# Lint + Format — legacy-peer-deps car @typescript-eslint requiert TS < 6
npm install -D eslint eslint-config-next @eslint/eslintrc @typescript-eslint/eslint-plugin @typescript-eslint/parser --legacy-peer-deps
npm install -D prettier prettier-plugin-tailwindcss

# Tests
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install -D @playwright/test

# TanStack Query
npm install @tanstack/react-query

# AI
npm install @anthropic-ai/sdk

# Email
npm install resend

# Git hooks (pre-commit auto)
npm install -D husky lint-staged
npx husky init
echo 'npx lint-staged' > .husky/pre-commit

# Init Playwright browsers
npx playwright install webkit chromium

echo ""
echo "Installation terminee !"
echo ""
echo "Prochaines etapes :"
echo "  1. cp .env.example .env  — remplis tes cles"
echo "  2. Adapte CLAUDE.md avec le nom et stack du projet"
echo "  3. Remplis .claude/agents/design-director.md section SETUP PROJET"
echo "  4. Remplis .claude/memory/project_context.md avec le contexte projet"
echo "  5. (Optionnel) Copie .claude/mcp-template.json → .claude/mcp.json et configure tes MCP"
echo "  6. npm run dev"
echo ""
echo "Claude Code setup :"
echo "  → .claude/settings.json  — permissions + hooks Prettier auto-configurés"
echo "  → /check                 — vérifie TypeScript + Lint + Tests avant push"
echo "  → /ship                  — workflow complet : check + commit + push + PR"
echo "  → /debug                 — diagnostic structuré de bug"
echo "  → /release               — checklist complète avant prod"
echo "  → /eval                  — créer/lancer des evals pour features AI"
echo "  → /migrate               — crée une migration Supabase"
echo "  → /health-all            — dashboard santé de tous tes projets"
echo "  → /propagate [projet]    — propager ce starter kit vers un projet"
echo ""
echo "Copier la structure Claude Code vers ce projet :"
echo "  cp -r ~/starter-kit/.claude/ ./.claude/"
echo "  → Adapter settings.json si besoin (hooks projet-spécifiques)"
echo "  → Ne PAS écraser CLAUDE.md (chaque projet a le sien)"

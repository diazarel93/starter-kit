#!/bin/bash
set -e

echo "🎬 Installation du projet..."
echo ""

# Next.js + React
npm install next@latest react@latest react-dom@latest

# TypeScript
npm install -D typescript @types/react @types/react-dom @types/node

# Supabase
npm install @supabase/supabase-js @supabase/ssr

# Tailwind CSS 4
npm install -D tailwindcss @tailwindcss/postcss postcss

# Utils
npm install clsx tailwind-merge

# Lint + Format
npm install -D eslint eslint-config-next @eslint/eslintrc @typescript-eslint/eslint-plugin @typescript-eslint/parser
npm install -D prettier prettier-plugin-tailwindcss

# Tests
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install -D @playwright/test

# TanStack Query
npm install @tanstack/react-query

# Git hooks (pre-commit auto)
npm install -D husky lint-staged

# Init husky
npx husky init
echo 'npx lint-staged' > .husky/pre-commit

# Init Playwright browsers
npx playwright install webkit chromium

echo ""
echo "✅ Installation terminee !"
echo ""
echo "Prochaines etapes :"
echo "  1. Copie .env.example vers .env et remplis tes cles"
echo "  2. Adapte CLAUDE.md avec le nom de ton projet"
echo "  3. git init && git add -A && git commit -m 'chore: init project'"
echo "  4. npm run dev"

# Bot Telegram — Coach AI Quotidien

## Setup (5 minutes)

### Etape 1 : Cree ton bot Telegram
1. Ouvre Telegram
2. Cherche **@BotFather**
3. Envoie `/newbot`
4. Donne un nom (ex: "Mon Coach AI")
5. Donne un username (ex: "romain_coach_ai_bot")
6. **Copie le token** que BotFather te donne

### Etape 2 : Configure
```bash
cd ~/FORMATION_AI/telegram-bot
cp .env.example .env
# Colle ton token dans .env
npm install
```

### Etape 3 : Recupere ton Chat ID
```bash
npm start
```
Va sur Telegram, envoie un message a ton bot.
Il te repondra avec ton Chat ID.
Copie-le dans `.env` puis arrete le bot (Ctrl+C).

### Etape 4 : Teste
```bash
npm run veille
```
Tu devrais recevoir un message sur Telegram.

### Etape 5 : Automatise (chaque matin a 8h)
```bash
crontab -e
```
Ajoute cette ligne :
```
0 8 * * * cd /Users/diazarel/FORMATION_AI/telegram-bot && /usr/local/bin/node veille.js
```

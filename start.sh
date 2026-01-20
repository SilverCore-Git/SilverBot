#!/bin/bash

# SilverBot - Setup & Run Script

echo "🎫 SilverBot - Ticket Management System"
echo "======================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé!"
    echo "📥 Téléchargez-le sur https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js détecté: $(node --version)"
echo ""

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  Fichier .env non trouvé!"
    echo "📋 Création à partir du template..."
    cp .env.example .env
    echo "✅ Fichier .env créé!"
    echo ""
    echo "🔧 Veuillez éditer le fichier .env avec vos paramètres:"
    echo "   - DISCORD_TOKEN: Votre token bot"
    echo "   - GUILD_ID: ID de votre serveur"
    echo "   - CLIENT_ID: ID de votre application"
    echo ""
    echo "📖 Voir le README pour les instructions complètes"
    exit 0
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
    echo ""
fi

# Check if config.json needs setup
if grep -q "YOUR_" config.json; then
    echo "⚠️  config.json contient des variables non configurées!"
    echo "🔧 Veuillez éditer config.json et remplir:"
    echo "   - helperRoleId"
    echo "   - adminRoleId"
    echo "   - logsChannelId"
    echo "   - ticketCategoryId (optionnel)"
    echo ""
    echo "📖 Voir le README pour les instructions"
    exit 1
fi

# Start the bot
echo "🚀 Démarrage de SilverBot..."
echo ""

if [ "$1" == "build" ]; then
    npm run build
elif [ "$1" == "prod" ] || [ "$1" == "production" ]; then
    npm run build
    npm start
else
    npm run dev
fi

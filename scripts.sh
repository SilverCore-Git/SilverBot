#!/bin/bash

# SilverBot - Utility Scripts
# Scripts utiles pour gérer le bot

set -e

case "$1" in
  "format")
    echo "🔧 Formatage du code avec Prettier..."
    npx prettier --write "src/**/*.ts"
    echo "✅ Code formaté!"
    ;;

  "lint")
    echo "🔍 Vérification des types TypeScript..."
    npm run type-check
    echo "✅ Aucune erreur de type!"
    ;;

  "clean")
    echo "🗑️  Nettoyage des fichiers générés..."
    rm -rf dist/
    echo "✅ Nettoyé!"
    ;;

  "rebuild")
    echo "🔄 Rebuild complet..."
    npm run clean 2>/dev/null || true
    npm run build
    echo "✅ Rebuild terminé!"
    ;;

  "check-env")
    echo "✅ Vérification des variables d'environnement..."
    if [ ! -f ".env" ]; then
      echo "❌ Fichier .env manquant!"
      exit 1
    fi
    
    if grep -q "DISCORD_TOKEN=your_bot_token_here" .env; then
      echo "⚠️  DISCORD_TOKEN non configuré"
    else
      echo "✅ DISCORD_TOKEN configuré"
    fi
    
    if grep -q "GUILD_ID=your_guild_id_here" .env; then
      echo "⚠️  GUILD_ID non configuré"
    else
      echo "✅ GUILD_ID configuré"
    fi
    
    if grep -q "CLIENT_ID=your_client_id_here" .env; then
      echo "⚠️  CLIENT_ID non configuré"
    else
      echo "✅ CLIENT_ID configuré"
    fi
    ;;

  "check-config")
    echo "✅ Vérification de config.json..."
    if grep -q "YOUR_" config.json; then
      echo "⚠️  config.json contient des variables non configurées:"
      grep "YOUR_" config.json
    else
      echo "✅ config.json correctement configuré"
    fi
    ;;

  "db-stats")
    echo "📊 Statistiques de la base de données..."
    if [ ! -f "data/tickets.json" ]; then
      echo "❌ Base de données non trouvée"
      exit 1
    fi
    
    total=$(jq '.tickets | length' data/tickets.json 2>/dev/null || echo "0")
    open=$(jq '[.tickets[] | select(.status=="open")] | length' data/tickets.json 2>/dev/null || echo "0")
    claimed=$(jq '[.tickets[] | select(.status=="claimed")] | length' data/tickets.json 2>/dev/null || echo "0")
    closed=$(jq '[.tickets[] | select(.status=="closed")] | length' data/tickets.json 2>/dev/null || echo "0")
    
    echo "Total: $total"
    echo "Ouverts: $open"
    echo "Pris en charge: $claimed"
    echo "Fermés: $closed"
    ;;

  "db-export")
    echo "📥 Export de la base de données..."
    if [ ! -f "data/tickets.json" ]; then
      echo "❌ Base de données non trouvée"
      exit 1
    fi
    
    timestamp=$(date +%Y%m%d_%H%M%S)
    cp data/tickets.json "backups/tickets_${timestamp}.json"
    echo "✅ Export sauvegardé: backups/tickets_${timestamp}.json"
    ;;

  "db-import")
    echo "📤 Import d'une base de données..."
    if [ -z "$2" ]; then
      echo "❌ Fichier non spécifié"
      echo "Usage: npm run utils -- db-import <fichier>"
      exit 1
    fi
    
    if [ ! -f "$2" ]; then
      echo "❌ Fichier non trouvé: $2"
      exit 1
    fi
    
    cp "$2" data/tickets.json
    echo "✅ Import effectué: $2"
    ;;

  "db-clear")
    echo "⚠️  ATTENTION: Cela effacera tous les tickets!"
    read -p "Êtes-vous sûr? (oui/non): " confirm
    
    if [ "$confirm" = "oui" ]; then
      echo '{ "tickets": [], "lastId": 0 }' > data/tickets.json
      echo "✅ Base de données réinitialisée"
    else
      echo "❌ Opération annulée"
    fi
    ;;

  "help")
    echo "SilverBot - Utility Scripts"
    echo ""
    echo "Usage: npm run utils -- [command] [options]"
    echo ""
    echo "Commands:"
    echo "  format              - Formater le code TypeScript"
    echo "  lint                - Vérifier les types TypeScript"
    echo "  clean               - Supprimer les fichiers générés"
    echo "  rebuild             - Rebuild complet (clean + build)"
    echo "  check-env           - Vérifier les variables d'environnement"
    echo "  check-config        - Vérifier config.json"
    echo "  db-stats            - Afficher les statistiques des tickets"
    echo "  db-export           - Exporter la base de données"
    echo "  db-import <file>    - Importer une base de données"
    echo "  db-clear            - Réinitialiser la base de données"
    echo "  help                - Afficher cette aide"
    ;;

  *)
    echo "Commande inconnue: $1"
    echo "Tapez 'npm run utils -- help' pour l'aide"
    exit 1
    ;;
esac

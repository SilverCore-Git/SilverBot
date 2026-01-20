# 🔧 Guide de Configuration Avancée

Ce document vous aide à configurer entièrement SilverBot.

## 1️⃣ Obtenir les IDs Discord

### Mode Développeur Discord

1. Ouvrir Discord
2. Aller à `Paramètres utilisateur` → `Avancé`
3. Activer le `Mode développeur`
4. Fermer et réouvrir les paramètres

Vous pouvez maintenant clic-droit sur les éléments pour obtenir les IDs.

### Récupérer les IDs

#### 1. Client ID (ID de l'Application)

1. Aller à [Developer Portal](https://discord.com/developers/applications)
2. Sélectionner votre application
3. Aller à `General Information`
4. Copier `Application ID` → `CLIENT_ID` dans `.env`

#### 2. Guild ID (ID du Serveur)

1. Clic-droit sur le serveur dans Discord
2. `Copier l'ID du serveur`
3. Coller dans `GUILD_ID` du `.env`

#### 3. Role ID (IDs des Rôles)

**Pour le Helper Role:**
1. Clic-droit sur le rôle Helper dans les paramètres du serveur
2. `Copier l'ID du rôle`
3. Coller dans `config.json` → `helperRoleId`

**Pour le Admin Role:**
1. Clic-droit sur le rôle Admin
2. Copier l'ID du rôle
3. Coller dans `config.json` → `adminRoleId`

#### 4. Channel ID (IDs des Canaux)

**Pour le Logs Channel:**
1. Clic-droit sur le canal des logs
2. `Copier l'ID du canal`
3. Coller dans `config.json` → `logsChannelId`

#### 5. Category ID (ID de la Catégorie)

**Pour la Ticket Category:**
1. Clic-droit sur la catégorie des tickets
2. `Copier l'ID du canal`
3. Coller dans `config.json` → `ticketCategoryId`

## 2️⃣ Configuration du Bot Discord

### Créer un Bot

1. Aller à [Developer Portal](https://discord.com/developers/applications)
2. Cliquer sur `New Application`
3. Nommer l'application (ex: "SilverBot")
4. Accepter les conditions
5. Cliquer sur `Create`

### Générer le Token

1. Dans la page de l'application, aller à `Bot`
2. Cliquer sur `Add Bot`
3. Sous `TOKEN`, cliquer sur `Copy`
4. Coller dans `.env` → `DISCORD_TOKEN`

⚠️ **IMPORTANT**: Ne jamais partager votre token!

### Configurer les Intents

1. Dans `Bot` → `Privileged Gateway Intents`
2. Activer les intents suivants:
   - ✅ `SERVER MEMBERS INTENT`
   - ✅ `MESSAGE CONTENT INTENT`

### Inviter le Bot

1. Aller à `OAuth2` → `URL Generator`
2. Scopes: `bot`
3. Permissions:
   - Gérer les canaux
   - Envoyer des messages
   - Incorporer les liens
   - Lire les messages/voir les canaux
   - Ajouter des réactions
   - Lire l'historique des messages
   - Gérer les permissions des rôles

4. Copier l'URL générée
5. Ouvrir dans un navigateur
6. Sélectionner votre serveur
7. Autoriser le bot

## 3️⃣ Configurer le Serveur Discord

### Créer les Rôles

1. `Paramètres du serveur` → `Rôles`
2. Cliquer sur `Créer un rôle`

**Rôle "Helper":**
- Nom: `Helper`
- Couleur: Bleue (ou autre)
- Sauvegarder

**Rôle "Admin":**
- Nom: `Admin`
- Couleur: Rouge
- Permissions: Gérant et Administrateur
- Sauvegarder

### Créer les Canaux

1. `Paramètres du serveur` → `Canaux`

**Catégorie pour les Tickets:**
- Nom: `🎫 Tickets`
- Privé (seulement visible aux administrateurs)

**Canal de Logs:**
- Nom: `#logs-tickets`
- Catégorie: `General` ou autre
- Privé (seulement visible aux administrateurs)

**Canal Setup:**
- Nom: `#tickets` ou `#support`
- Catégorie: `General`
- Description: "Cliquez sur le bouton pour créer un ticket"

### Assigner les Rôles

1. Clic-droit sur un utilisateur
2. `Ajouter un rôle`
3. Sélectionner `Helper` ou `Admin`

## 4️⃣ Fichier .env

Créer un fichier `.env`:

```env
# Discord Bot
DISCORD_TOKEN=MzAyN...votre_token...3YzI5.XYz...
GUILD_ID=1234567890123456789
CLIENT_ID=1234567890123456789

# Optionnel
NODE_ENV=development
```

## 5️⃣ Fichier config.json

Remplir les IDs:

```json
{
  "helperRoleId": "1234567890123456789",
  "adminRoleId": "9876543210987654321",
  "logsChannelId": "1111111111111111111",
  "ticketCategoryId": "2222222222222222222",
  "domains": [
    {
      "label": "Technique",
      "value": "technique"
    },
    {
      "label": "Support",
      "value": "support"
    },
    {
      "label": "Modération",
      "value": "moderation"
    },
    {
      "label": "Autre",
      "value": "autre"
    }
  ],
  "maxTicketsPerUser": 0,
  "ticketPrefix": "ticket",
  "colors": {
    "primary": "#5865F2",
    "success": "#57F287",
    "error": "#ED4245",
    "warning": "#FEE75C"
  }
}
```

## 6️⃣ Installation et Lancement

```bash
# 1. Installer les dépendances
npm install

# 2. Tester la configuration
npm run type-check

# 3. Lancer en développement
npm run dev

# OU

# 3. Build et lancer en production
npm run build
npm start
```

## 7️⃣ Vérification Finale

### Checklist

- ✅ Token du bot dans `.env`
- ✅ GUILD_ID dans `.env`
- ✅ CLIENT_ID dans `.env`
- ✅ `helperRoleId` dans `config.json`
- ✅ `adminRoleId` dans `config.json`
- ✅ `logsChannelId` dans `config.json`
- ✅ `ticketCategoryId` dans `config.json`
- ✅ Rôles créés sur le serveur
- ✅ Canaux créés sur le serveur
- ✅ Bot invité sur le serveur
- ✅ Bot a les bonnes permissions
- ✅ Intents activés

### Test

1. Lancer le bot: `npm run dev`
2. Attendre le message: `✅ Bot connecté en tant que ...`
3. Dans Discord, utiliser `/setup-ticket`
4. Vérifier que l'embed et le bouton apparaissent
5. Cliquer sur le bouton et tester

## 🆘 Troubleshooting

### Le bot ne démarre pas

```bash
# Vérifier les erreurs
npm run type-check

# Vérifier que node_modules existe
npm install

# Vérifier .env
cat .env
```

### Les commandes n'apparaissent pas

1. Vérifier GUILD_ID correct
2. Vérifier CLIENT_ID correct
3. Attendre 1-2 minutes
4. Redémarrer Discord
5. Redémarrer le bot

### Les tickets ne se créent pas

1. Vérifier que la catégorie existe
2. Vérifier les permissions du bot
3. Vérifier que ticketCategoryId n'est pas vide

### Les logs ne s'envoient pas

1. Vérifier que le canal existe
2. Vérifier que logsChannelId est correct
3. Vérifier les permissions du bot

## 📞 Support

Si vous avez des problèmes:

1. Vérifier les messages d'erreur dans la console
2. Vérifier le fichier de configuration
3. Vérifier les permissions du bot
4. Redémarrer le bot et Discord

---

Pour plus d'aide, consultez le [README.md](README.md) principal.

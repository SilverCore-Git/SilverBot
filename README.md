# 🎫 SilverBot - Advanced Discord Ticket Management System

Un bot Discord professionnel et modulaire pour la gestion de tickets avec système de support complet, utilisant **Node.js**, **TypeScript**, et **discord.js v14+**.

## ✨ Fonctionnalités

### 🎟️ Système de Tickets
- **Création de tickets** via interface modale intuitive
- **Sélection du domaine** (Technique, Support, Modération, Autre)
- **Description détaillée** du problème
- Stockage des données en JSON local

### 👤 Gestion des Helpers
- **Système de Claim** pour prendre en charge les tickets
- **Renommage automatique** du salon avec le nom du helper
- **Permissions** configurables par rôle
- **Assignation** visible au helper et à l'auteur

### 📋 Suivi et Logs
- **Transcription complète** des conversations
- **Export en fichier** (TXT) automatique à la fermeture
- **Canal de logs** central avec historique
- **Métadonnées** (auteur, helper, domaine, date)

### 🔐 Sécurité
- **Permissions par défaut** restrictives
- **Visibilité limitée** (auteur + helpers uniquement)
- **Contrôle d'accès** basé sur les rôles
- **Validation des interactions** stricte

## 🛠️ Stack Technique

- **Runtime:** Node.js 18+ ou 20+
- **Langage:** TypeScript 5.3+
- **Framework Discord:** discord.js v14.14+
- **Base de données:** JSON (système de fichier local)
- **Environnement:** dotenv pour les secrets

## 📦 Installation

### Prérequis
- Node.js 18+ installé
- npm ou yarn
- Un bot Discord créé sur le [Portail Développeurs Discord](https://discord.com/developers/applications)
- Token du bot et ID du serveur

### Étapes

1. **Cloner le repository**
```bash
git clone https://github.com/SilverCore-Git/SilverBot.git
cd SilverBot
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**
```bash
cp .env.example .env
```

Éditer le fichier `.env` et remplir:
```env
DISCORD_TOKEN=your_bot_token_here
GUILD_ID=your_guild_id_here
CLIENT_ID=your_client_id_here
```

4. **Configurer le bot**

Éditer `config.json` avec vos IDs:
```json
{
  "helperRoleId": "YOUR_HELPER_ROLE_ID",
  "adminRoleId": "YOUR_ADMIN_ROLE_ID",
  "logsChannelId": "YOUR_LOGS_CHANNEL_ID",
  "ticketCategoryId": "YOUR_TICKET_CATEGORY_ID",
  "domains": [...]
}
```

Comment trouver les IDs:
- **Mode développeur Discord:** Activer dans `Utilisateur > Paramètres > Avancé > Mode développeur`
- **Role ID:** Clic-droit sur le rôle > Copier l'ID
- **Channel ID:** Clic-droit sur le canal > Copier l'ID

## 🚀 Lancement

### Mode développement (avec recompilation automatique)
```bash
npm run dev
```

### Build TypeScript
```bash
npm run build
```

### Production
```bash
npm start
```

## 📖 Guide d'Utilisation

### Pour les Administrateurs

1. **Configurer le système**
   - Mettre à jour `config.json` avec les IDs corrects
   - Créer les rôles "Helper" et "Admin"
   - Créer une catégorie et un canal de logs

2. **Initialiser les tickets**
   - Utiliser la commande `/setup-ticket` dans le canal désiré
   - Le bot envoie un embed avec un bouton "Ouvrir un Ticket"

### Pour les Utilisateurs

1. **Créer un ticket**
   - Cliquer sur le bouton "Ouvrir un Ticket"
   - Sélectionner le domaine du problème
   - Remplir le formulaire modal avec la raison

2. **Suivi du ticket**
   - Le salon privé est créé automatiquement
   - Visible uniquement par l'auteur et les helpers
   - Partager les détails avec le helper assigné

### Pour les Helpers

1. **Prendre en charge**
   - Cliquer sur "Prendre en Charge" dans le salon du ticket
   - Le salon est renommé avec votre nom
   - Commencer à aider le client

2. **Fermer le ticket**
   - Cliquer sur "Fermer le Ticket" quand résolu
   - Une transcription est générée automatiquement
   - Le salon est supprimé après envoi des logs

## 📁 Structure du Projet

```
SilverBot/
├── src/
│   ├── index.ts                 # Point d'entrée principal
│   ├── commands/
│   │   └── setupTicket.ts       # Commande /setup-ticket
│   ├── handlers/
│   │   ├── readyHandler.ts      # Événement ready
│   │   ├── guildCreateHandler.ts # Événement guildCreate
│   │   ├── commandHandler.ts    # Gestion des slash commands
│   │   └── interactionHandler.ts # Gestion des boutons/modals
│   ├── database/
│   │   └── ticketManager.ts     # Service de gestion des tickets JSON
│   ├── utils/
│   │   └── helpers.ts           # Fonctions utilitaires
│   └── types/
│       └── index.ts             # Interfaces TypeScript
├── data/
│   └── tickets.json             # Base de données des tickets (généré)
├── config.json                  # Configuration du bot
├── .env                         # Secrets (créé à partir de .env.example)
├── tsconfig.json                # Configuration TypeScript
├── package.json                 # Dépendances npm
└── README.md                    # Ce fichier
```

## 🔧 Configuration Détaillée

### config.json

```json
{
  "helperRoleId": "ID du rôle Helper",
  "adminRoleId": "ID du rôle Admin",
  "logsChannelId": "ID du canal des logs",
  "ticketCategoryId": "ID de la catégorie (optionnel)",
  "domains": [
    { "label": "Label affiché", "value": "valeur_interne" }
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

### Domaines Disponibles

Modifier le tableau `domains` dans `config.json`:
```json
"domains": [
  { "label": "Technique", "value": "technique" },
  { "label": "Support", "value": "support" },
  { "label": "Modération", "value": "moderation" },
  { "label": "Autre", "value": "autre" }
]
```

## 💾 Format de la Base de Données

Les tickets sont stockés dans `data/tickets.json`:

```json
{
  "tickets": [
    {
      "id": "1",
      "authorId": "123456789",
      "authorName": "username",
      "channelId": "987654321",
      "domain": "technique",
      "reason": "Mon bot ne démarre pas",
      "status": "claimed",
      "helperId": "111111111",
      "helperName": "helper_name",
      "createdAt": 1704067200000,
      "closedAt": null
    }
  ],
  "lastId": 1
}
```

## 🎨 Customisation

### Modifier les Couleurs

Éditer les couleurs dans `config.json`:
```json
"colors": {
  "primary": "#5865F2",
  "success": "#57F287",
  "error": "#ED4245",
  "warning": "#FEE75C"
}
```

### Ajouter des Domaines

1. Éditer `config.json`
2. Ajouter une entrée dans le tableau `domains`
3. Le bot détectera automatiquement

### Modifier les Messages

Les messages sont dans:
- `src/utils/helpers.ts` (embeds)
- `src/handlers/interactionHandler.ts` (réponses)
- `src/commands/setupTicket.ts` (command)

## 🐛 Dépannage

### Le bot ne démarre pas
```bash
# Vérifier les variables d'environnement
echo $DISCORD_TOKEN
echo $GUILD_ID
echo $CLIENT_ID

# Vérifier la syntaxe TypeScript
npm run type-check
```

### Les commandes n'apparaissent pas
- Vérifier que l'ID du serveur (`GUILD_ID`) est correct
- Vérifier les permissions du bot sur le serveur
- Attendre 1-2 minutes après l'inscription
- Redémarrer le bot: `npm run dev`

### Les tickets ne se créent pas
- Vérifier que la catégorie existe (`ticketCategoryId` dans config.json)
- Vérifier les permissions du bot dans la catégorie
- Vérifier les logs du bot pour les erreurs

### Les transcriptions ne sont pas sauvegardées
- Vérifier que le dossier `data/` existe
- Vérifier les permissions d'écriture du dossier
- Vérifier que le canal de logs existe et est accessible

## 📝 Permissions Requises du Bot

Le bot nécessite les permissions suivantes sur le serveur:

- `Créer des salons` - Pour créer les salons de tickets
- `Gérer les salons` - Pour renommer les salons
- `Supprimer des salons` - Pour fermer les tickets
- `Envoyer des messages` - Pour communiquer
- `Incorporer les liens` - Pour les embeds colorés
- `Ajouter des réactions` - Pour les boutons/sélects (non nécessaire pour discord.js v14+)
- `Lire l'historique des messages` - Pour les transcriptions
- `Gérer les permissions` - Pour les permissions des salons

## 🔐 Sécurité

### Bonnes Pratiques

1. **Ne jamais** commit les `.env` contenant des tokens réels
2. **Utiliser** des variables d'environnement en production
3. **Limiter** les permissions du bot au minimum nécessaire
4. **Audit** régulièrement les logs des tickets
5. **Mettre à jour** discord.js et Node.js régulièrement

### Variables d'Environnement

```env
# Production
DISCORD_TOKEN=<votre-token-sécurisé>
GUILD_ID=<id-du-serveur>
CLIENT_ID=<id-du-client>
NODE_ENV=production
```

## 📊 Monitoring

Le bot affiche les informations de monitoring:
- Nombre de serveurs
- État de connexion
- Événements de tickets

Console:
```
✅ Bot connecté en tant que SilverBot#1234
📊 Nombre de serveurs: 5
🎫 Système de Tickets: Actif
```

## 🤝 Contribution

Les contributions sont les bienvenues! Pour contribuer:

1. Fork le repository
2. Créer une branche (`git checkout -b feature/amelioration`)
3. Commit les changements (`git commit -m 'Ajouter une amélioration'`)
4. Push vers la branche (`git push origin feature/amelioration`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence **MIT**. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 📞 Support

Pour toute question ou problème:
- Ouvrir une issue sur GitHub
- Contacter l'administrateur du bot
- Consulter la documentation Discord.js

## 🙏 Remerciements

- [discord.js](https://discord.js.org/) - Bibliothèque Discord
- [TypeScript](https://www.typescriptlang.org/) - Langage
- [Node.js](https://nodejs.org/) - Runtime

## 📝 Changelog

### v1.0.0 (19 Janvier 2026)
- ✅ Système complet de tickets
- ✅ Gestion des helpers et claim
- ✅ Transcriptions automatiques
- ✅ Système de logs
- ✅ Architecture modulaire
- ✅ TypeScript strict

---

Développé avec ❤️ par SilverCore-Git

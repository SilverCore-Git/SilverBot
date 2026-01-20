# 📁 Structure du Code Source

## Vue d'ensemble

```
src/
├── index.ts                    # Point d'entrée principal du bot
├── commands/                   # Commandes slash Discord
├── handlers/                   # Gestionnaires d'événements Discord
├── database/                   # Couche d'accès aux données
├── utils/                      # Fonctions utilitaires partagées
└── types/                      # Interfaces et types TypeScript
```

## 📝 Fichiers Principaux

### `src/index.ts`
Le point d'entrée de l'application. Responsable de:
- Initialiser le client Discord
- Charger les variables d'environnement
- Enregistrer les slash commands
- Configurer les event listeners
- Gérer le cycle de vie du bot

**Imports clés:**
- Discord.js `Client`, `REST`, `Routes`
- dotenv pour les variables d'environnement
- Tous les handlers et commandes

### `src/commands/setupTicket.ts`
Commande slash `/setup-ticket` pour initialiser le système de tickets.

**Fonctionnalités:**
- Vérifier les permissions admin
- Créer l'embed "Système de Tickets"
- Ajouter le bouton "Ouvrir un Ticket"
- Envoyer le message

## 🎯 Handlers (Événements)

### `src/handlers/readyHandler.ts`
Exécuté quand le bot est prêt.

**Actions:**
- Afficher un message de confirmation
- Définir le statut du bot
- Initialiser les données de monitoring

### `src/handlers/guildCreateHandler.ts`
Exécuté quand le bot rejoint un serveur.

**Actions:**
- Enregistrer les commandes pour le serveur
- Afficher un message d'accueil

### `src/handlers/commandHandler.ts`
Gère l'exécution des slash commands.

**Actions:**
- Identifier la commande
- Vérifier que la commande existe
- Exécuter la commande
- Gérer les erreurs

### `src/handlers/interactionHandler.ts`
Gère tous les types d'interactions (boutons, modals, select menus).

**Actions:**
- Bouton "Ouvrir un ticket" → Affiche le select menu domaine
- Select menu domaine → Affiche le modal
- Modal → Crée le ticket et le salon
- Bouton "Claim" → Assigne le helper et renomme le salon
- Bouton "Fermer" → Crée les logs et supprime le salon

## 💾 Database

### `src/database/ticketManager.ts`
Service centralisé pour gérer la base de données des tickets.

**Responsabilités:**
- Charger/sauvegarder le fichier `tickets.json`
- CRUD operations (Create, Read, Update, Delete)
- Fournir des méthodes utilitaires

**Méthodes principales:**
- `createTicket()` - Créer un nouveau ticket
- `getTicket()` - Récupérer un ticket par ID
- `getTicketByChannelId()` - Trouver par channel
- `updateTicket()` - Modifier un ticket
- `claimTicket()` - Assigner un helper
- `closeTicket()` - Fermer un ticket
- `deleteTicket()` - Supprimer un ticket

## 🔧 Utils

### `src/utils/helpers.ts`
Fonctions utilitaires réutilisables.

**Catégories:**

**IDs et Génération:**
- `generateTicketId()` - Crée un ID unique pour le ticket
- `generateChannelName()` - Génère le nom du salon

**Embeds:**
- `createTicketEmbed()` - Embed du système de tickets
- `createTicketInfoEmbed()` - Embed des infos du ticket

**Transcriptions:**
- `formatTranscript()` - Formate en texte brut
- `formatTranscriptHTML()` - Formate en HTML

**Permissions:**
- `hasHelperRole()` - Vérifie si user a le rôle helper
- `hasAdminRole()` - Vérifie si user a le rôle admin

## 📚 Types

### `src/types/index.ts`
Interfaces TypeScript pour la sécurité des types.

**Interfaces:**

```typescript
interface Ticket {
  id: string;                    // ID unique
  authorId: string;              // ID Discord de l'auteur
  authorName: string;            // Nom de l'auteur
  channelId: string;             // ID du salon du ticket
  domain: string;                // Domaine du ticket
  reason: string;                // Raison du ticket
  status: "open" | "claimed" | "closed";
  helperId?: string;             // ID Discord du helper
  helperName?: string;           // Nom du helper
  createdAt: number;             // Timestamp de création
  closedAt?: number;             // Timestamp de fermeture
}

interface TicketDatabase {
  tickets: Ticket[];             // Liste des tickets
  lastId: number;                // Dernier ID utilisé
}

interface Domain {
  label: string;                 // Label affiché
  value: string;                 // Valeur interne
}

interface Config {
  helperRoleId: string;
  adminRoleId: string;
  logsChannelId: string;
  ticketCategoryId: string;
  domains: Domain[];
  maxTicketsPerUser: number;
  ticketPrefix: string;
  colors: {
    primary: string;
    success: string;
    error: string;
    warning: string;
  };
}
```

## 🔄 Flux de Données

### Création d'un Ticket

```
USER INTERACTION
  ↓
interactionHandler.ts
  ↓ (Button "Ouvrir un ticket")
Select Menu (Domaines)
  ↓
Modal (Raison)
  ↓
ticketManager.createTicket()
  ↓
tickets.json (Sauvegarde)
  ↓
channel.create() (Discord API)
  ↓
Salon du ticket créé
```

### Claim d'un Ticket

```
HELPER INTERACTION
  ↓
interactionHandler.ts
  ↓ (Button "Claim")
Vérification permissions
  ↓
ticketManager.claimTicket()
  ↓
tickets.json (Mise à jour)
  ↓
channel.setName() (Renommage)
  ↓
Message de confirmation
```

### Fermeture d'un Ticket

```
USER/HELPER INTERACTION
  ↓
interactionHandler.ts
  ↓ (Button "Fermer")
Vérification permissions
  ↓
Fetch messages
  ↓
Format transcript
  ↓
logsChannel.send() (Envoi logs)
  ↓
channel.delete() (Suppression)
  ↓
ticketManager.closeTicket()
  ↓
tickets.json (Mise à jour)
```

## 🔐 Sécurité et Bonnes Pratiques

### Type Safety
- TypeScript strict mode activé
- Interfaces pour tous les objets complexes
- Pas de `any` sans justification

### Gestion d'Erreurs
- Try/catch dans tous les handlers
- Messages d'erreur clairs aux utilisateurs
- Logs détaillés en console

### Permissions
- Vérification des rôles avant chaque action
- Vérifications des permissions Discord
- Validations des entrées utilisateur

### Performance
- Caching des données quand possible
- Opérations DB minimales
- Gestion efficace des collections Discord.js

## 📦 Dépendances

### Principales
- **discord.js**: Bibliothèque Discord
- **typescript**: Langage typé
- **dotenv**: Variables d'environnement

### Dev
- **@types/node**: Types Node.js
- **tsx**: Exécuteur TypeScript

## 🧪 Tests et Debugging

### Mode Dev
```bash
npm run dev  # Recompile automatiquement
```

### Vérification des Types
```bash
npm run type-check  # Détecte les erreurs de type
```

### Build
```bash
npm run build  # Crée dist/
```

### Exécution
```bash
npm start  # Lance dist/index.js
```

## 🔄 Extension du Projet

### Ajouter une Nouvelle Commande
1. Créer `src/commands/maCommande.ts`
2. Ajouter à `commandHandler.ts`
3. Ajouter à `index.ts` (enregistrement)

### Ajouter un Nouveau Type de Domaine
1. Éditer `config.json` (domains)
2. Le bot détecte automatiquement

### Ajouter une Interaction (Bouton/Modal)
1. Créer dans `interactionHandler.ts`
2. Ajouter le customId
3. Implémenter la logique

### Ajouter une Fonction Utilitaire
1. Créer dans `utils/helpers.ts`
2. Exporter la fonction
3. Importer où nécessaire

---

Pour plus d'informations, voir:
- [README.md](../README.md) - Documentation générale
- [DEVELOPMENT.md](../DEVELOPMENT.md) - Guide de développement
- [SETUP.md](../SETUP.md) - Configuration

# 👨‍💻 Guide de Développement

Ce guide est destiné aux développeurs souhaitant contribuer ou étendre SilverBot.

## 🏗️ Architecture du Projet

### Structure Modulaire

```
src/
├── index.ts                 # Point d'entrée, initialisation Discord.js
├── commands/                # Commandes slash
│   └── setupTicket.ts
├── handlers/                # Gestionnaires d'événements
│   ├── readyHandler.ts
│   ├── guildCreateHandler.ts
│   ├── commandHandler.ts
│   └── interactionHandler.ts
├── database/                # Couche données
│   └── ticketManager.ts
├── utils/                   # Fonctions utilitaires
│   └── helpers.ts
└── types/                   # Interfaces TypeScript
    └── index.ts
```

### Pattern d'Architecture

- **Separation of Concerns**: Chaque module a une responsabilité
- **Service Layer**: `ticketManager` gère l'accès aux données
- **Handler Pattern**: Événements Discord centralisés
- **Type Safety**: TypeScript strict mode activé

## 📚 Concepts Clés

### Système de Tickets

```
Création
  ↓
User clique sur bouton
  ↓
Sélection domaine (Select Menu)
  ↓
Modal avec raison
  ↓
Création du salon privé
  ↓
Création de l'entrée DB

Claim (Prise en charge)
  ↓
Helper clique bouton "Claim"
  ↓
Mise à jour DB (status = "claimed", helper assigné)
  ↓
Renommage du salon

Fermeture
  ↓
Utilisateur ou Helper clique "Fermer"
  ↓
Génération transcription
  ↓
Envoi des logs
  ↓
Suppression du salon
  ↓
Mise à jour DB (status = "closed")
```

## 🔧 Ajouter une Nouvelle Commande

1. Créer le fichier dans `src/commands/`:

```typescript
// src/commands/myCommand.ts
import { SlashCommandBuilder, CommandInteraction } from "discord.js";

export const myCommand = {
  data: new SlashCommandBuilder()
    .setName("my-command")
    .setDescription("Description de ma commande"),

  async execute(interaction: CommandInteraction): Promise<void> {
    await interaction.reply("Réponse à ma commande");
  },
};
```

2. L'ajouter à `commandHandler.ts`:

```typescript
import { myCommand } from "../commands/myCommand.js";

const commands: Record<string, any> = {
  "setup-ticket": setupTicketCommand,
  "my-command": myCommand,  // Ajouter ici
};
```

3. L'ajouter à `index.ts`:

```typescript
const commands = [setupTicketCommand.data, myCommand.data];
```

## 🎨 Ajouter un Nouveau Domaine

1. Éditer `config.json`:

```json
"domains": [
  { "label": "Technique", "value": "technique" },
  { "label": "Mon Nouveau Domaine", "value": "mon_domaine" }
]
```

Le bot détecte automatiquement les nouveaux domaines!

## 💾 Ajouter des Champs au Ticket

1. Éditer `src/types/index.ts`:

```typescript
export interface Ticket {
  id: string;
  // ... champs existants
  newField: string; // Ajouter le nouveau champ
}
```

2. Mettre à jour `ticketManager.ts`:

```typescript
createTicket(
  authorId: string,
  authorName: string,
  domain: string,
  reason: string,
  channelId: string,
  newField: string  // Ajouter le paramètre
): Ticket {
  const ticket: Ticket = {
    // ... champs existants
    newField,  // Inclure le nouveau champ
  };
  // ...
}
```

## 🎛️ Ajouter une Interaction (Bouton/Modal)

1. Créer le composant (exemple: bouton):

```typescript
// Dans interactionHandler.ts
async function handleButtonInteraction(interaction: any): Promise<void> {
  const { customId } = interaction;

  if (customId === "my_button") {
    // Votre logique ici
    await interaction.reply("Bouton cliqué!");
  }
}
```

2. Créer le composant dans le message:

```typescript
const button = new ButtonBuilder()
  .setCustomId("my_button")
  .setLabel("Mon Bouton")
  .setStyle(ButtonStyle.Primary);

const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);
await channel.send({ content: "Test", components: [row] });
```

## 🧪 Tester les Changements

### Mode développement avec recompilation automatique:

```bash
npm run dev
```

### Vérifier les types TypeScript:

```bash
npm run type-check
```

### Builder uniquement:

```bash
npm run build
```

## 📝 Bonnes Pratiques de Codage

### 1. Types et Interfaces

✅ **Correct:**
```typescript
export interface Ticket {
  id: string;
  authorId: string;
  status: "open" | "claimed" | "closed";
}
```

❌ **Incorrect:**
```typescript
const ticket = { id: "1", authorId: "123", status: "open" };
```

### 2. Gestion d'Erreurs

✅ **Correct:**
```typescript
try {
  await channel.send({ embeds: [embed] });
} catch (error) {
  console.error("Failed to send message:", error);
  await interaction.reply({
    content: "❌ Une erreur est survenue.",
    ephemeral: true,
  });
}
```

❌ **Incorrect:**
```typescript
await channel.send({ embeds: [embed] }); // Pas de gestion d'erreur
```

### 3. Messages Utilisateur

✅ **Correct:**
```typescript
await interaction.reply({
  content: "✅ Succès!",
  ephemeral: true,
});
```

❌ **Incorrect:**
```typescript
await interaction.reply("ok"); // Pas d'emoji, pas clair
```

### 4. Logs

✅ **Correct:**
```typescript
console.log("✅ Bot connecté en tant que", client.user?.tag);
console.error("❌ Erreur:", error);
```

❌ **Incorrect:**
```typescript
console.log("bot connected"); // Pas descriptif
```

## 🔒 Sécurité

### Permissions

Toujours vérifier les permissions:

```typescript
const member = await interaction.guild?.members.fetch(interaction.user.id);
if (!member || !hasHelperRole(member, config.helperRoleId)) {
  await interaction.reply("❌ Permission refusée");
  return;
}
```

### Validations

Valider les entrées utilisateur:

```typescript
const reason = fields.getTextInputValue("ticket_reason");
if (reason.length < 10) {
  await interaction.reply("❌ Raison trop courte");
  return;
}
```

## 🐛 Debugging

### Logs de Développement

Ajouter des logs détaillés:

```typescript
console.log("DEBUG: Ticket créé", {
  id: ticket.id,
  authorId: ticket.authorId,
  domain: ticket.domain,
});
```

### Utiliser le Debugger Node.js

```bash
node --inspect dist/index.js
# Ouvrir chrome://inspect
```

### Inspecter la Base de Données

```bash
cat data/tickets.json | python -m json.tool
```

## 📦 Ajouter une Dépendance

```bash
# Installation
npm install mon-package

# Installation dev
npm install --save-dev @types/mon-package

# Utilisation dans le code
import monPackage from "mon-package";
```

## 🚀 Déployer en Production

### 1. Vérifier le build

```bash
npm run type-check
npm run build
```

### 2. Configuration Production

```env
NODE_ENV=production
DISCORD_TOKEN=<token>
GUILD_ID=<id>
CLIENT_ID=<id>
```

### 3. Déployer

```bash
npm run build
npm start
```

### 4. Monitoring

```bash
# Vérifier les logs
tail -f logs/bot.log

# Utiliser PM2 (optionnel)
pm2 start dist/index.js --name "silverbot"
pm2 save
pm2 startup
```

## 📊 Performance

### Optimisations

1. **Caching**: Utiliser le cache Discord.js pour les données fréquentes
2. **Requêtes DB**: Limiter les lectures/écritures JSON
3. **Permissions**: Vérifier en cache quand possible

### Monitoring

```typescript
console.time("ticket_creation");
// ... code
console.timeEnd("ticket_creation");
```

## 🤝 Contribution

Pour contribuer:

1. Fork le repository
2. Créer une branche: `git checkout -b feature/nom`
3. Commiter: `git commit -am 'Ajouter fonctionnalité'`
4. Push: `git push origin feature/nom`
5. Pull Request

### Standards de Code

- TypeScript strict mode
- Nommer les fonctions clairement
- Ajouter des commentaires pour la logique complexe
- Tester avant de commit

## 📚 Ressources

- [discord.js Documentation](https://discord.js.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Node.js Documentation](https://nodejs.org/docs/)
- [Discord Developer Portal](https://discord.com/developers/)

## 🆘 Problèmes Courants

### Erreur: "Cannot find module"

```bash
npm install
npm run type-check
```

### Erreur: "Token is invalid"

Vérifier que le token dans `.env` est correct et actif.

### Erreur: "Missing Permissions"

Vérifier les permissions du bot dans Discord.

---

Pour des questions spécifiques, consulter le README ou ouvrir une issue.

Heureux de contribuer! 🎉

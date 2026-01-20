import { Client, GatewayIntentBits, REST, Routes } from "discord.js";
import dotenv from "dotenv";
import { handleReady } from "./handlers/readyHandler.js";
import { handleGuildCreate } from "./handlers/guildCreateHandler.js";
import { handleSlashCommand } from "./handlers/commandHandler.js";
import { handleInteractionCreate } from "./handlers/interactionHandler.js";
import { setupTicketCommand } from "./commands/setupTicket.js";

dotenv.config();

const TOKEN: string = process.env.DISCORD_TOKEN || '';
const GUILD_ID: string = process.env.GUILD_ID || '';
const CLIENT_ID: string = process.env.CLIENT_ID || '';

if (!TOKEN || !GUILD_ID || !CLIENT_ID) {
  console.error(
    "❌ Erreur: Les variables d'environnement DISCORD_TOKEN, GUILD_ID et CLIENT_ID doivent être définies."
  );
  process.exit(1);
}

// Create client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Register events
client.on("ready", () => handleReady(client));
client.on("guildCreate", (guild) => handleGuildCreate(guild));
client.on("interactionCreate", (interaction) => {
  if (interaction.isChatInputCommand()) {
    handleSlashCommand(interaction);
  } else {
    handleInteractionCreate(interaction);
  }
});

// Register slash commands globally
async function registerCommands(): Promise<void> {
  const rest = new REST({ version: "10" }).setToken(TOKEN);

  try {
    console.log("🔄 Enregistrement des commandes slash globales...");

    const commands = [setupTicketCommand.data];

    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
      body: commands.map((cmd) => cmd.toJSON()),
    });

    console.log("✅ Commandes slash enregistrées avec succès!");
  } catch (error) {
    console.error("❌ Erreur lors de l'enregistrement des commandes:", error);
  }
}

// Login
async function main(): Promise<void> {
  try {
    await registerCommands();
    await client.login(TOKEN);
  } catch (error) {
    console.error("❌ Erreur lors de la connexion du bot:", error);
    process.exit(1);
  }
}

main();

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n👋 Arrêt du bot...");
  await client.destroy();
  process.exit(0);
});

export { client };

import { Guild } from "discord.js";
import { setupTicketCommand } from "../commands/setupTicket.js";

export async function handleGuildCreate(guild: Guild): Promise<void> {
  console.log(`📍 Bot rejoint le serveur: ${guild.name} (${guild.id})`);
  
  try {
    // Register slash commands for the guild
    const commands = [setupTicketCommand];
    
    await guild.commands.set(commands.map(cmd => cmd.data));
    console.log(`✅ Commandes enregistrées pour ${guild.name}`);
  } catch (error) {
    console.error(`Erreur lors de l'enregistrement des commandes pour ${guild.name}:`, error);
  }
}

import { Client } from "discord.js";

export async function handleReady(client: Client): Promise<void> {
  console.log(`✅ Bot connecté en tant que ${client.user?.tag}`);
  console.log(`📊 Nombre de serveurs: ${client.guilds.cache.size}`);
  
  // Set status
  client.user?.setActivity("🎫 Système de Tickets", { type: 0 });
}

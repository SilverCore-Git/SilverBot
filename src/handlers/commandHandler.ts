import { CommandInteraction } from "discord.js";
import { setupTicketCommand } from "../commands/setupTicket.js";

const commands: Record<string, any> = {
  "setup-ticket": setupTicketCommand,
};

export async function handleSlashCommand(
  interaction: CommandInteraction
): Promise<void> {
  const command = commands[interaction.commandName];

  if (!command) {
    await interaction.reply({
      content: "❌ Commande non trouvée.",
      ephemeral: true,
    });
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(`Erreur lors de l'exécution de la commande ${interaction.commandName}:`, error);

    if (!interaction.replied) {
      await interaction.reply({
        content: "❌ Une erreur est survenue lors de l'exécution de la commande.",
        ephemeral: true,
      });
    } else {
      await interaction.editReply({
        content: "❌ Une erreur est survenue lors de l'exécution de la commande.",
      });
    }
  }
}

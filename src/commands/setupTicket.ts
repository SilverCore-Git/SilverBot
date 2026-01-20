import {
  SlashCommandBuilder,
  CommandInteraction,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  TextChannel, // <--- 1. Import this
} from "discord.js";
import config from "../../config.json";
import { createTicketEmbed, hasAdminRole } from "../utils/helpers.js";

export const setupTicketCommand = {
  data: new SlashCommandBuilder()
    .setName("setup-ticket")
    .setDescription("🔧 Setup the ticket system (Admin only)")
    .setDefaultMemberPermissions(0),

  async execute(interaction: CommandInteraction): Promise<void> {
    // Check if user is admin
    const member = await interaction.guild?.members.fetch(interaction.user.id);
    if (!member || !hasAdminRole(member, config.adminRoleId)) {
      await interaction.reply({
        content:
          "❌ Vous n'avez pas la permission d'utiliser cette commande.",
        ephemeral: true,
      });
      return;
    }

    try {
      // Create embed for ticket system
      const embed = createTicketEmbed();

      // Create button
      const button = new ButtonBuilder()
        .setCustomId("open_ticket_button")
        .setLabel("📬 Ouvrir un Ticket")
        .setStyle(ButtonStyle.Primary);

      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

      // Send message
      // 2. Cast interaction.channel as TextChannel here:
      await (interaction.channel as TextChannel)?.send({ embeds: [embed], components: [row] });

      await interaction.reply({
        content: "✅ Système de tickets mis en place avec succès!",
        ephemeral: true,
      });
    } catch (error) {
      console.error("Error setting up ticket system:", error);
      await interaction.reply({
        content: "❌ Une erreur est survenue lors de la mise en place du système.",
        ephemeral: true,
      });
    }
  },
};
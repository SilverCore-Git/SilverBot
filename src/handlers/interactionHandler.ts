import {
  Interaction,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ChannelType,
  PermissionFlagsBits,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  ColorResolvable,
} from "discord.js";
import config from "../../config.json";
import { ticketManager } from "../database/ticketManager.js";
import {
  createTicketInfoEmbed,
  generateChannelName,
  hasHelperRole,
} from "../utils/helpers.js";

export async function handleInteractionCreate(interaction: Interaction): Promise<void> {
  try {
    if (interaction.isButton()) {
      await handleButtonInteraction(interaction);
    } else if (interaction.isModalSubmit()) {
      await handleModalSubmit(interaction);
    } else if (interaction.isStringSelectMenu()) {
      await handleSelectMenuInteraction(interaction);
    }
  } catch (error) {
    console.error("Error handling interaction:", error);
    if (interaction.isRepliable() && !interaction.replied) {
      await interaction.reply({
        content: "❌ Une erreur est survenue.",
        ephemeral: true,
      });
    }
  }
}

async function handleButtonInteraction(interaction: any): Promise<void> {
  const { customId } = interaction;

  if (customId === "open_ticket_button") {
    // Show domain selection
    const domains = config.domains;
    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId("select_domain")
      .setPlaceholder("Sélectionnez le domaine de votre problème")
      .addOptions(
        domains.map((domain) => ({
          label: domain.label,
          value: domain.value,
          description: `Problème concernant: ${domain.label}`,
        }))
      );

    const row = new ActionRowBuilder().addComponents(selectMenu);

    await interaction.reply({
      content: "👇 Sélectionnez le domaine de votre problème:",
      components: [row as any],
      ephemeral: true,
    });
  } else if (customId === "claim_ticket_button") {
    // Handle claim ticket
    const ticket = ticketManager.getTicketByChannelId(interaction.channelId);
    if (!ticket) {
      await interaction.reply({
        content: "❌ Ticket non trouvé.",
        ephemeral: true,
      });
      return;
    }

    const member = await interaction.guild?.members.fetch(interaction.user.id);
    if (!member || !hasHelperRole(member, config.helperRoleId)) {
      await interaction.reply({
        content: "❌ Seuls les Helpers peuvent prendre en charge un ticket.",
        ephemeral: true,
      });
      return;
    }

    if (ticket.status === "claimed") {
      await interaction.reply({
        content: "❌ Ce ticket a déjà été pris en charge.",
        ephemeral: true,
      });
      return;
    }

    // Claim the ticket
    ticketManager.claimTicket(
      ticket.id,
      interaction.user.id,
      interaction.user.username
    );

    // Rename channel
    const newChannelName = generateChannelName(
      ticket.domain,
      ticket.id,
      interaction.user.username
    );

    try {
      await interaction.channel?.setName(newChannelName);
    } catch (error) {
      console.error("Failed to rename channel:", error);
    }

    // Send confirmation message
    const embed = new EmbedBuilder()
      .setColor(config.colors.success as ColorResolvable)
      .setTitle("✅ Ticket Pris en Charge")
      .setDescription(
        `${interaction.user.username} s'occupe maintenant de ce ticket.`
      );

    await interaction.channel?.send({ embeds: [embed] });
    await interaction.reply({
      content: "✅ Vous avez pris en charge ce ticket.",
      ephemeral: true,
    });
  } else if (customId === "close_ticket_button") {
    // Handle close ticket
    const ticket = ticketManager.getTicketByChannelId(interaction.channelId);
    if (!ticket) {
      await interaction.reply({
        content: "❌ Ticket non trouvé.",
        ephemeral: true,
      });
      return;
    }

    const member = await interaction.guild?.members.fetch(interaction.user.id);
    const isHelper = member && hasHelperRole(member, config.helperRoleId);
    const isAuthor = interaction.user.id === ticket.authorId;

    if (!isHelper && !isAuthor) {
      await interaction.reply({
        content: "❌ Vous n'avez pas la permission de fermer ce ticket.",
        ephemeral: true,
      });
      return;
    }

    await interaction.deferReply();

    try {
      // Fetch messages for transcript
      const messages = await interaction.channel?.messages.fetch({ limit: 100 });
      const transcriptMessages = messages
        ?.reverse()
        .map((msg: any) => ({
          author: msg.author.username,
          content: msg.content,
          timestamp: msg.createdAt.toLocaleString("fr-FR"),
        }))
        .filter((msg: any) => msg.content.length > 0) || [];

      // Update ticket status
      ticketManager.closeTicket(ticket.id);

      // Send to logs channel
      const logsChannel = await interaction.guild?.channels.fetch(
        config.logsChannelId
      );

      if (logsChannel && logsChannel.isTextBased()) {
        const logEmbed = new EmbedBuilder()
          .setColor(config.colors.warning as ColorResolvable)
          .setTitle("🔒 Ticket Fermé")
          .addFields(
            { name: "ID Ticket", value: `\`${ticket.id}\`` },
            { name: "Auteur", value: `<@${ticket.authorId}>` },
            { name: "Domaine", value: ticket.domain },
            { name: "Raison", value: ticket.reason },
            {
              name: "Helper",
              value: ticket.helperId ? `<@${ticket.helperId}>` : "Non assigné",
            },
            {
              name: "Créé le",
              value: new Date(ticket.createdAt).toLocaleString("fr-FR"),
            }
          );

        // Send transcript as file
        if (transcriptMessages.length > 0) {
          const transcriptText = transcriptMessages
            .map((m: any) => `[${m.timestamp}] ${m.author}: ${m.content}`)
            .join("\n");

          const buffer = Buffer.from(transcriptText, "utf-8");
          await logsChannel.send({
            embeds: [logEmbed],
            files: [
              {
                attachment: buffer,
                name: `ticket-${ticket.id}-transcript.txt`,
              },
            ],
          });
        } else {
          await logsChannel.send({ embeds: [logEmbed] });
        }
      }

      // Delete channel
      await interaction.channel?.delete();
    } catch (error) {
      console.error("Error closing ticket:", error);
      await interaction.editReply({
        content: "❌ Une erreur est survenue lors de la fermeture du ticket.",
      });
    }
  }
}

async function handleSelectMenuInteraction(interaction: any): Promise<void> {
  const { customId, values } = interaction;

  if (customId === "select_domain") {
    const selectedDomain = values[0];

    // Show modal for ticket details
    const modal = new ModalBuilder()
      .setCustomId(`ticket_modal_${selectedDomain}`)
      .setTitle("📝 Créer un Ticket");

    const reasonInput = new TextInputBuilder()
      .setCustomId("ticket_reason")
      .setLabel("Raison du ticket")
      .setStyle(TextInputStyle.Paragraph)
      .setPlaceholder("Décrivez votre problème en détail...")
      .setRequired(true)
      .setMinLength(10)
      .setMaxLength(1000);

    const row = new ActionRowBuilder<TextInputBuilder>().addComponents(
      reasonInput
    );

    modal.addComponents(row);

    await interaction.showModal(modal);
  }
}

async function handleModalSubmit(interaction: any): Promise<void> {
  const { customId, fields, guild, user } = interaction;

  if (customId.startsWith("ticket_modal_")) {
    const domain = customId.replace("ticket_modal_", "");
    const reason = fields.getTextInputValue("ticket_reason");

    await interaction.deferReply({ ephemeral: true });

    try {
      // Create ticket in database
      //const ticketId = generateTicketId();
      const ticket = ticketManager.createTicket(
        user.id,
        user.username,
        domain,
        reason,
        "" // Will be filled after channel creation
      );

      // Create channel
      const channelName = generateChannelName(domain, ticket.id);

      const channel = await guild.channels.create({
        name: channelName,
        type: ChannelType.GuildText,
        parent: config.ticketCategoryId || undefined,
        permissionOverwrites: [
          {
            id: guild.id,
            deny: [PermissionFlagsBits.ViewChannel],
          },
          {
            id: user.id,
            allow: [
              PermissionFlagsBits.ViewChannel,
              PermissionFlagsBits.SendMessages,
              PermissionFlagsBits.ReadMessageHistory,
            ],
          },
          {
            id: config.helperRoleId,
            allow: [
              PermissionFlagsBits.ViewChannel,
              PermissionFlagsBits.SendMessages,
              PermissionFlagsBits.ReadMessageHistory,
            ],
          },
        ],
      });

      // Update ticket with channel ID
      ticketManager.updateTicket(ticket.id, { channelId: channel.id });

      // Send ticket info embed in channel
      const infoEmbed = createTicketInfoEmbed({
        ...ticket,
        channelId: channel.id,
      });

      // Create buttons
      const claimButton = new ButtonBuilder()
        .setCustomId("claim_ticket_button")
        .setLabel("👤 Prendre en Charge")
        .setStyle(ButtonStyle.Success);

      const closeButton = new ButtonBuilder()
        .setCustomId("close_ticket_button")
        .setLabel("🔒 Fermer le Ticket")
        .setStyle(ButtonStyle.Danger);

      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        claimButton,
        closeButton
      );

      await channel.send({ embeds: [infoEmbed], components: [row] });

      await interaction.editReply({
        content: `✅ Ticket créé avec succès! ${channel}`,
      });
    } catch (error) {
      console.error("Error creating ticket:", error);
      await interaction.editReply({
        content: "❌ Une erreur est survenue lors de la création du ticket.",
      });
    }
  }
}

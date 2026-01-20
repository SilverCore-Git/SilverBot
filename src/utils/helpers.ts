import { ColorResolvable, EmbedBuilder } from "discord.js";
import config from "../../config.json";
import { Ticket } from "../types/index.js";

export function generateTicketId(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export function createTicketEmbed(): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(config.colors.primary as ColorResolvable)
    .setTitle("📋 Système de Tickets")
    .setDescription(
      "Cliquez sur le bouton ci-dessous pour ouvrir un ticket et être aidé."
    )
    .setFooter({
      text: "SilverBot Tickets • Cliquez pour créer un ticket",
    });
}

export function createTicketInfoEmbed(ticket: Ticket): EmbedBuilder {
  const createdDate = new Date(ticket.createdAt).toLocaleString("fr-FR");
  
  const embed = new EmbedBuilder()
    .setColor(config.colors.primary as ColorResolvable)
    .setTitle("📌 Informations du Ticket")
    .addFields(
      { name: "ID", value: `\`${ticket.id}\``, inline: true },
      { name: "Auteur", value: `<@${ticket.authorId}>`, inline: true },
      { name: "Domaine", value: ticket.domain, inline: true },
      { name: "Statut", value: ticket.status.toUpperCase(), inline: true },
      { name: "Créé le", value: createdDate, inline: true }
    )
    .setDescription(
      `**Raison du ticket:**\n${ticket.reason}`
    );

  if (ticket.helperId) {
    embed.addFields({
      name: "Helper Assigné",
      value: `<@${ticket.helperId}>`,
      inline: true,
    });
  }

  return embed;
}

export function generateChannelName(
  domain: string,
  ticketId: string,
  helperName?: string
): string {
  const sanitized = (text: string) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

  if (helperName) {
    return sanitized(`${helperName}-${domain}-${ticketId}`);
  }
  
  return sanitized(`${config.ticketPrefix}-${domain}-${ticketId}`);
}

export function formatTranscript(
  messages: Array<{ author: string; content: string; timestamp: string }>
): string {
  let transcript = "=== TICKET TRANSCRIPT ===\n";
  transcript += `Generated: ${new Date().toLocaleString("fr-FR")}\n\n`;

  for (const msg of messages) {
    transcript += `[${msg.timestamp}] ${msg.author}: ${msg.content}\n`;
  }

  transcript += "\n=== END OF TRANSCRIPT ===\n";
  return transcript;
}

export function formatTranscriptHTML(
  ticket: Ticket,
  messages: Array<{ author: string; content: string; timestamp: string }>
): string {
  const messageRows = messages
    .map(
      (msg) => `
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;">${msg.timestamp}</td>
      <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">${msg.author}</td>
      <td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(msg.content)}</td>
    </tr>
  `
    )
    .join("");

  const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ticket #${ticket.id} Transcript</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: #2c2f33;
      color: #dcddde;
      padding: 20px;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
      background: #36393f;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    }
    h1 { color: #7289da; }
    .ticket-info {
      background: #2c2f33;
      padding: 15px;
      border-radius: 5px;
      margin-bottom: 20px;
      border-left: 4px solid #7289da;
    }
    .ticket-info p {
      margin: 5px 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    th {
      background: #2c2f33;
      padding: 10px;
      text-align: left;
      border: 1px solid #ddd;
      font-weight: bold;
    }
    tr:nth-child(even) {
      background: #2c2f33;
    }
    tr:hover {
      background: #40444b;
    }
    td {
      padding: 8px;
      border: 1px solid #ddd;
    }
    .timestamp {
      color: #72767d;
      font-size: 0.9em;
    }
    .author {
      color: #7289da;
      font-weight: bold;
    }
    .footer {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #40444b;
      color: #72767d;
      font-size: 0.9em;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>📋 Transcription du Ticket #${ticket.id}</h1>
    <div class="ticket-info">
      <p><strong>Auteur:</strong> ${ticket.authorName} (${ticket.authorId})</p>
      <p><strong>Domaine:</strong> ${ticket.domain}</p>
      <p><strong>Raison:</strong> ${escapeHtml(ticket.reason)}</p>
      <p><strong>Helper:</strong> ${ticket.helperName || "Non assigné"}</p>
      <p><strong>Créé le:</strong> ${new Date(ticket.createdAt).toLocaleString("fr-FR")}</p>
      ${ticket.closedAt ? `<p><strong>Fermé le:</strong> ${new Date(ticket.closedAt).toLocaleString("fr-FR")}</p>` : ""}
    </div>
    
    <table>
      <thead>
        <tr>
          <th style="width: 150px;">Heure</th>
          <th style="width: 200px;">Auteur</th>
          <th>Message</th>
        </tr>
      </thead>
      <tbody>
        ${messageRows}
      </tbody>
    </table>
    
    <div class="footer">
      <p>Généré le ${new Date().toLocaleString("fr-FR")}</p>
      <p>SilverBot Ticket System</p>
    </div>
  </div>
</body>
</html>
  `;

  return html;
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

export function hasHelperRole(member: any, helperRoleId: string): boolean {
  return member.roles.cache.has(helperRoleId);
}

export function hasAdminRole(member: any, adminRoleId: string): boolean {
  return member.roles.cache.has(adminRoleId);
}

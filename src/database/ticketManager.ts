import fs from "fs";
import path from "path";
import { Ticket, TicketDatabase } from "../types/index.js";

const DB_PATH = path.join(process.cwd(), "data", "tickets.json");

export class TicketManager {
  private db: TicketDatabase;

  constructor() {
    this.db = this.loadDatabase();
  }

  private loadDatabase(): TicketDatabase {
    try {
      if (!fs.existsSync(DB_PATH)) {
        const dir = path.dirname(DB_PATH);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        this.saveDatabase({ tickets: [], lastId: 0 });
        return { tickets: [], lastId: 0 };
      }

      const data = fs.readFileSync(DB_PATH, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      console.error("Failed to load database:", error);
      return { tickets: [], lastId: 0 };
    }
  }

  private saveDatabase(data: TicketDatabase): void {
    try {
      const dir = path.dirname(DB_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
    } catch (error) {
      console.error("Failed to save database:", error);
    }
  }

  createTicket(
    authorId: string,
    authorName: string,
    domain: string,
    reason: string,
    channelId: string
  ): Ticket {
    this.db.lastId++;
    const ticket: Ticket = {
      id: this.db.lastId.toString(),
      authorId,
      authorName,
      channelId,
      domain,
      reason,
      status: "open",
      createdAt: Date.now(),
    };

    this.db.tickets.push(ticket);
    this.saveDatabase(this.db);

    return ticket;
  }

  getTicket(id: string): Ticket | undefined {
    return this.db.tickets.find((t) => t.id === id);
  }

  getTicketByChannelId(channelId: string): Ticket | undefined {
    return this.db.tickets.find((t) => t.channelId === channelId);
  }

  getTicketsByAuthorId(authorId: string): Ticket[] {
    return this.db.tickets.filter((t) => t.authorId === authorId);
  }

  getOpenTickets(): Ticket[] {
    return this.db.tickets.filter((t) => t.status !== "closed");
  }

  updateTicket(id: string, updates: Partial<Ticket>): Ticket | undefined {
    const index = this.db.tickets.findIndex((t) => t.id === id);
    if (index === -1) return undefined;

    this.db.tickets[index] = { ...this.db.tickets[index], ...updates };
    this.saveDatabase(this.db);

    return this.db.tickets[index];
  }

  claimTicket(id: string, helperId: string, helperName: string): Ticket | undefined {
    return this.updateTicket(id, {
      status: "claimed",
      helperId,
      helperName,
    });
  }

  closeTicket(id: string): Ticket | undefined {
    return this.updateTicket(id, {
      status: "closed",
      closedAt: Date.now(),
    });
  }

  deleteTicket(id: string): boolean {
    const index = this.db.tickets.findIndex((t) => t.id === id);
    if (index === -1) return false;

    this.db.tickets.splice(index, 1);
    this.saveDatabase(this.db);

    return true;
  }

  getAllTickets(): Ticket[] {
    return this.db.tickets;
  }
}

export const ticketManager = new TicketManager();

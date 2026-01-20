export interface Ticket {
  id: string;
  authorId: string;
  authorName: string;
  channelId: string;
  domain: string;
  reason: string;
  status: "open" | "claimed" | "closed";
  helperId?: string;
  helperName?: string;
  createdAt: number;
  closedAt?: number;
}

export interface TicketDatabase {
  tickets: Ticket[];
  lastId: number;
}

export interface Domain {
  label: string;
  value: string;
}

export interface Config {
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

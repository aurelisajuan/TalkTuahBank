export interface ChatMessage {
  role: "assistant" | "user" | "system" | "tool";
  content: string;
}

export interface BankUser {
  name: string;
  accounts: string[];
  ssn: string;
  address: string;
  date_of_birth: string;
  email: string;
  phone: string;
}

export interface BankAccount {
  balance: number;
  statements: Record<string, string>;
}

export interface BankPayment {
  from_account: string;
  to_account: string;
  amount: number;
  date: string;
  status: "Scheduled" | "Completed" | "Pending" | "Canceled";
}

export interface BankDatabase {
  users: Record<string, BankUser>;
  accounts: Record<string, BankAccount>;
  payments: Record<string, BankPayment>;
}

export type DocumentStatus = "urgent" | "medium" | "done";

export interface ReferencedDocument {
  id: string;
  name: string;
  type: string;
  status?: DocumentStatus;
  ipfs_hash?: string;
}

export interface Call {
  id: string;
  user_id: string;
  time?: string;
  transcript: ChatMessage[];
  referenced_documents: ReferencedDocument[];
  agent_trail?: AgentName[];
}

export type AgentName =
  | "Triage Agent"
  | "Accounts Agent"
  | "Payments Agent"
  | "Applications Agent";

export interface ToolCallRecord {
  id: string;
  agent: AgentName;
  name: string;
  args: Record<string, unknown>;
  result?: string;
  ipfs?: { cid: string; doc: string };
  timestamp: number;
}

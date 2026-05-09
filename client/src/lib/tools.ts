import { tool } from "ai";
import { z } from "zod";
import { initialDatabase } from "@/lib/mock-bank";
import { fakeIpfsCid } from "@/lib/utils";

// Tools mirror the Python implementations in:
//   server/agents/accounts_agent.py
//   server/agents/payments_agent.py
//   server/agents/applications_agent.py
//
// Each invocation runs against an isolated, ephemeral clone of the in-memory
// bank database so the live demo cannot persist or mutate any shared state.
// The route handler (app/api/chat/route.ts) instantiates one of these per
// request via createBankTools().

export interface BankSession {
  db: typeof initialDatabase;
  payCounter: number;
  appliedDocs: { name: string; cid: string }[];
}

export function createSession(): BankSession {
  return {
    db: JSON.parse(JSON.stringify(initialDatabase)),
    payCounter: 100,
    appliedDocs: [],
  };
}

function nextPaymentId(s: BankSession): string {
  s.payCounter += 1;
  return `PAY${String(s.payCounter).padStart(3, "0")}`;
}

export function createBankTools(session: BankSession) {
  return {
    // Accounts Agent — handle_account_balance
    get_account_balance: tool({
      description:
        "Look up the current balance of a bank account. Use when the caller asks how much money is in an account.",
      inputSchema: z.object({
        account_id: z.string().describe("Account identifier, e.g. ACC123"),
      }),
      execute: async ({ account_id }) => {
        const acc = session.db.accounts[account_id];
        if (!acc) return { error: `Account ${account_id} not found.` };
        return {
          account_id,
          balance: acc.balance,
          formatted: `$${acc.balance.toFixed(2)}`,
        };
      },
    }),

    // Accounts Agent — retrieve_bank_statement
    get_bank_statement: tool({
      description:
        "Retrieve a monthly bank statement for an account. Period must be a month name like January or February.",
      inputSchema: z.object({
        account_id: z.string(),
        period: z.string().describe("Month name, e.g. January"),
      }),
      execute: async ({ account_id, period }) => {
        const acc = session.db.accounts[account_id];
        if (!acc) return { error: `Account ${account_id} not found.` };
        const stmt = acc.statements[period];
        if (!stmt)
          return { error: `No statement available for ${period}.` };
        return { account_id, period, statement: stmt };
      },
    }),

    // Payments Agent — transfer_funds
    transfer_funds: tool({
      description:
        "Move money from one account to another and record the payment. Both accounts must exist and the source must have sufficient funds.",
      inputSchema: z.object({
        from_account: z.string(),
        to_account: z.string(),
        amount: z.number().positive(),
      }),
      execute: async ({ from_account, to_account, amount }) => {
        const from = session.db.accounts[from_account];
        const to = session.db.accounts[to_account];
        if (!from)
          return { error: `Source account ${from_account} not found.` };
        if (!to)
          return { error: `Destination account ${to_account} not found.` };
        if (from.balance < amount)
          return { error: "Insufficient funds in source account." };
        from.balance -= amount;
        to.balance += amount;
        const id = nextPaymentId(session);
        session.db.payments[id] = {
          from_account,
          to_account,
          amount,
          date: new Date().toISOString().slice(0, 10),
          status: "Completed",
        };
        return {
          payment_id: id,
          status: "Completed",
          new_source_balance: from.balance,
          new_destination_balance: to.balance,
        };
      },
    }),

    // Payments Agent — schedule_payment
    schedule_payment: tool({
      description:
        "Schedule a future payment from an account to a payee. Funds are placed on hold immediately.",
      inputSchema: z.object({
        account_id: z.string(),
        payee: z.string(),
        amount: z.number().positive(),
        date: z.string().describe("YYYY-MM-DD"),
      }),
      execute: async ({ account_id, payee, amount, date }) => {
        const acc = session.db.accounts[account_id];
        if (!acc) return { error: `Account ${account_id} not found.` };
        if (acc.balance < amount)
          return { error: "Insufficient funds to schedule payment." };
        acc.balance -= amount;
        const id = nextPaymentId(session);
        session.db.payments[id] = {
          from_account: account_id,
          to_account: payee,
          amount,
          date,
          status: "Scheduled",
        };
        return { payment_id: id, status: "Scheduled" };
      },
    }),

    // Payments Agent — cancel_payment
    cancel_payment: tool({
      description:
        "Cancel a previously scheduled payment and refund the held amount.",
      inputSchema: z.object({ payment_id: z.string() }),
      execute: async ({ payment_id }) => {
        const pay = session.db.payments[payment_id];
        if (!pay) return { error: `Payment ${payment_id} not found.` };
        if (pay.status !== "Scheduled")
          return {
            error: `Payment ${payment_id} cannot be canceled (status: ${pay.status}).`,
          };
        pay.status = "Canceled";
        const acc = session.db.accounts[pay.from_account];
        if (acc) acc.balance += pay.amount;
        return {
          payment_id,
          status: "Canceled",
          refunded_to: pay.from_account,
          amount: pay.amount,
        };
      },
    }),

    // Applications Agent — apply_for_loan
    apply_for_loan: tool({
      description:
        "Generate a loan application document and pin the resulting PDF to IPFS via Pinata.",
      inputSchema: z.object({
        user_id: z.string(),
        loan_amount: z.number().positive(),
        loan_purpose: z.string(),
        term_years: z.number().int().positive(),
      }),
      execute: async ({ user_id, loan_amount, loan_purpose, term_years }) => {
        const cid = fakeIpfsCid();
        const docName = `loan_application_${user_id}.pdf`;
        session.appliedDocs.push({ name: docName, cid });
        return {
          status: "Submitted",
          file: docName,
          ipfs_cid: cid,
          summary: `Loan: $${loan_amount.toFixed(2)} for ${term_years} years (purpose: ${loan_purpose}).`,
        };
      },
    }),

    // Applications Agent — apply_for_credit_card
    apply_for_credit_card: tool({
      description:
        "Generate a credit card application document and pin the resulting PDF to IPFS via Pinata.",
      inputSchema: z.object({
        user_id: z.string(),
        card_type: z.string(),
        credit_limit: z.number().positive(),
      }),
      execute: async ({ user_id, card_type, credit_limit }) => {
        const cid = fakeIpfsCid();
        const docName = `credit_card_application_${user_id}.pdf`;
        session.appliedDocs.push({ name: docName, cid });
        return {
          status: "Submitted",
          file: docName,
          ipfs_cid: cid,
          summary: `${card_type} card with $${credit_limit.toFixed(2)} limit.`,
        };
      },
    }),
  };
}

export type BankToolName = keyof ReturnType<typeof createBankTools>;

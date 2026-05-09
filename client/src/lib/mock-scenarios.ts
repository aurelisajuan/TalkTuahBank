import type { AgentName } from "@/lib/types";

export type ScenarioStepKind =
  | { type: "say"; role: "user" | "assistant"; text: string; agent?: AgentName }
  | { type: "handoff"; to: AgentName; reason: string }
  | {
      type: "tool";
      agent: AgentName;
      name: string;
      args: Record<string, unknown>;
      result: string;
      mutates?: { kind: "transfer" | "schedule" | "cancel"; payload: Record<string, unknown> };
      attachIpfs?: { docName: string; type: "PDF" };
    };

export interface Scenario {
  id: string;
  title: string;
  description: string;
  callerPhone: string;
  intentTag: string;
  steps: ScenarioStepKind[];
}

export const SCENARIOS: Scenario[] = [
  {
    id: "check-balance",
    title: "Check account balance",
    description:
      "Bill calls in to ask his balance. Triage hands off to the Accounts Agent, which fetches the balance from the bank DB.",
    callerPhone: "+1-408-585-8267",
    intentTag: "ACCOUNTS",
    steps: [
      {
        type: "say",
        role: "assistant",
        agent: "Triage Agent",
        text: "Hey Bill, I'm the TalkTuahBank AI. How can I help you today?",
      },
      {
        type: "say",
        role: "user",
        text: "Hi, can you tell me my checking account balance?",
      },
      {
        type: "handoff",
        to: "Accounts Agent",
        reason: "User intent: account balance lookup.",
      },
      {
        type: "say",
        role: "assistant",
        agent: "Accounts Agent",
        text: "Sure thing. One sec while I pull up account ACC892 for you.",
      },
      {
        type: "tool",
        agent: "Accounts Agent",
        name: "handle_account_balance",
        args: { accountId: "ACC892" },
        result: "Your current account balance for ACC892 is $3,750.00.",
      },
      {
        type: "say",
        role: "assistant",
        agent: "Accounts Agent",
        text: "You've got $3,750 in your ACC892 checking. Anything else I can grab for you?",
      },
      {
        type: "say",
        role: "user",
        text: "Nope, that's all. Thanks!",
      },
      {
        type: "say",
        role: "assistant",
        agent: "Accounts Agent",
        text: "You bet. Have a good one!",
      },
    ],
  },
  {
    id: "transfer-funds",
    title: "Transfer funds between accounts",
    description:
      "A live $250 internal transfer between two accounts owned by the same caller, executed by the Payments Agent's transfer_funds tool.",
    callerPhone: "+1-408-585-8267",
    intentTag: "PAYMENTS",
    steps: [
      {
        type: "say",
        role: "assistant",
        agent: "Triage Agent",
        text: "Hey Bill, what can I do for you today?",
      },
      {
        type: "say",
        role: "user",
        text: "I want to move $250 from my checking, ACC892, into ACC347.",
      },
      {
        type: "handoff",
        to: "Payments Agent",
        reason: "User intent: internal funds transfer.",
      },
      {
        type: "say",
        role: "assistant",
        agent: "Payments Agent",
        text: "Got it — $250 from ACC892 to ACC347. Confirming and sending it now.",
      },
      {
        type: "tool",
        agent: "Payments Agent",
        name: "transfer_funds",
        args: { from_account: "ACC892", to_account: "ACC347", amount: 250 },
        result:
          "Successfully transferred $250.00 from ACC892 to ACC347. Payment ID: PAY011.",
        mutates: {
          kind: "transfer",
          payload: { from: "ACC892", to: "ACC347", amount: 250 },
        },
      },
      {
        type: "say",
        role: "assistant",
        agent: "Payments Agent",
        text: "Done. $250 just moved over to ACC347. Want me to do anything else?",
      },
      { type: "say", role: "user", text: "That's it, thanks." },
      {
        type: "say",
        role: "assistant",
        agent: "Payments Agent",
        text: "Anytime. Talk soon.",
      },
    ],
  },
  {
    id: "schedule-payment",
    title: "Schedule a future bill payment",
    description:
      "Caller asks to schedule a $400 payment to a vendor account two weeks out. Funds are held; status persisted as Scheduled.",
    callerPhone: "+1-917-828-6465",
    intentTag: "PAYMENTS",
    steps: [
      {
        type: "say",
        role: "assistant",
        agent: "Triage Agent",
        text: "Hey Warren, this is TalkTuahBank — what's up?",
      },
      {
        type: "say",
        role: "user",
        text: "I need to schedule a $400 rent payment from ACC123 for the first.",
      },
      {
        type: "handoff",
        to: "Payments Agent",
        reason: "User intent: scheduled payment.",
      },
      {
        type: "say",
        role: "assistant",
        agent: "Payments Agent",
        text: "Easy. Who am I sending it to?",
      },
      {
        type: "say",
        role: "user",
        text: "Vendor account ACC456, please. Date is 2024-12-01.",
      },
      {
        type: "tool",
        agent: "Payments Agent",
        name: "schedule_payment",
        args: {
          account_id: "ACC123",
          payee: "ACC456",
          amount: 400,
          date: "2024-12-01",
        },
        result:
          "Payment of $400.00 to ACC456 scheduled on 2024-12-01. Payment ID: PAY012.",
        mutates: {
          kind: "schedule",
          payload: {
            from: "ACC123",
            to: "ACC456",
            amount: 400,
            date: "2024-12-01",
          },
        },
      },
      {
        type: "say",
        role: "assistant",
        agent: "Payments Agent",
        text: "All set. $400 to ACC456 will go out December 1st. Want a confirmation text?",
      },
      { type: "say", role: "user", text: "Yes please." },
      {
        type: "say",
        role: "assistant",
        agent: "Payments Agent",
        text: "Sent. Talk soon, Warren.",
      },
    ],
  },
  {
    id: "cancel-payment",
    title: "Cancel a scheduled payment",
    description:
      "Caller cancels payment PAY001. The Payments Agent flips its status to Canceled and refunds the held amount back to the source account.",
    callerPhone: "+1-917-828-6465",
    intentTag: "PAYMENTS",
    steps: [
      {
        type: "say",
        role: "assistant",
        agent: "Triage Agent",
        text: "Hey Warren, what can I help with?",
      },
      {
        type: "say",
        role: "user",
        text: "I want to cancel my scheduled payment PAY001.",
      },
      {
        type: "handoff",
        to: "Payments Agent",
        reason: "User intent: cancel scheduled payment.",
      },
      {
        type: "tool",
        agent: "Payments Agent",
        name: "cancel_payment",
        args: { payment_id: "PAY001" },
        result:
          "Payment with ID PAY001 has been successfully canceled and $300.00 has been refunded to ACC123.",
        mutates: { kind: "cancel", payload: { payment_id: "PAY001" } },
      },
      {
        type: "say",
        role: "assistant",
        agent: "Payments Agent",
        text: "Done — PAY001 is canceled and the $300 is back in ACC123. Anything else?",
      },
      { type: "say", role: "user", text: "That's all, thanks." },
    ],
  },
  {
    id: "apply-loan",
    title: "Apply for a personal loan",
    description:
      "Caller starts a $10K loan application. The Applications Agent renders a LaTeX PDF and pins it to IPFS via Pinata. The CID is shown in the inspector.",
    callerPhone: "+1-972-555-0789",
    intentTag: "APPLICATIONS",
    steps: [
      {
        type: "say",
        role: "assistant",
        agent: "Triage Agent",
        text: "Hey Michael, this is TalkTuahBank. What's going on?",
      },
      {
        type: "say",
        role: "user",
        text: "I'd like to apply for a $10,000 personal loan, two-year term, to consolidate some credit cards.",
      },
      {
        type: "handoff",
        to: "Applications Agent",
        reason: "User intent: loan application.",
      },
      {
        type: "say",
        role: "assistant",
        agent: "Applications Agent",
        text: "Got it. I'll generate the loan application document and store it for the underwriting team.",
      },
      {
        type: "tool",
        agent: "Applications Agent",
        name: "apply_for_loan",
        args: {
          user_id: "ACC321",
          loan_amount: 10000,
          loan_purpose: "Credit card consolidation",
          term_years: 2,
        },
        result:
          "Your loan application has been received and processed successfully. (File: loan_application_ACC321.pdf)",
        attachIpfs: { docName: "loan_application_ACC321.pdf", type: "PDF" },
      },
      {
        type: "say",
        role: "assistant",
        agent: "Applications Agent",
        text: "All done. The signed PDF is pinned to IPFS so the team can pull it up anywhere. You'll hear back within 48 hours.",
      },
      { type: "say", role: "user", text: "Awesome, thank you." },
    ],
  },
  {
    id: "apply-card",
    title: "Apply for a credit card",
    description:
      "A new credit card request with a $5,000 limit. Same Applications Agent flow — a different tool, same Pinata pin.",
    callerPhone: "+1-817-555-0321",
    intentTag: "APPLICATIONS",
    steps: [
      {
        type: "say",
        role: "assistant",
        agent: "Triage Agent",
        text: "Hey Sarah, what can I help with?",
      },
      {
        type: "say",
        role: "user",
        text: "I want to apply for a Platinum credit card with a $5,000 limit.",
      },
      {
        type: "handoff",
        to: "Applications Agent",
        reason: "User intent: credit card application.",
      },
      {
        type: "tool",
        agent: "Applications Agent",
        name: "apply_for_credit_card",
        args: {
          user_id: "ACC654",
          card_type: "Platinum",
          credit_limit: 5000,
        },
        result:
          "Your credit card application has been received and processed successfully. (File: credit_card_application_ACC654.pdf)",
        attachIpfs: {
          docName: "credit_card_application_ACC654.pdf",
          type: "PDF",
        },
      },
      {
        type: "say",
        role: "assistant",
        agent: "Applications Agent",
        text: "Submitted. The application PDF is pinned to IPFS and queued for review. You should have a decision in 5–7 business days.",
      },
      { type: "say", role: "user", text: "Perfect, thanks!" },
    ],
  },
];

export function getScenario(id: string): Scenario | undefined {
  return SCENARIOS.find((s) => s.id === id);
}

// TS port of generate_sample_data() from server/db.py — these populate the
// operator console even before the visitor runs the demo.
import type { Call } from "@/lib/types";

function isoOffset(minutesAgo: number): string {
  const d = new Date();
  d.setMinutes(d.getMinutes() - minutesAgo);
  return d.toISOString();
}

export const SEED_CALLS: Record<string, Call> = {
  "+1-408-585-8267": {
    id: "+1-408-585-8267",
    user_id: "+1-408-585-8267",
    time: isoOffset(8),
    agent_trail: ["Triage Agent", "Accounts Agent"],
    transcript: [
      {
        role: "assistant",
        content:
          "Hello, welcome to TalkTuahBank. How can I help you today?",
      },
      {
        role: "user",
        content: "Hi, I'd like to check my account balance please.",
      },
      {
        role: "assistant",
        content:
          "I'd be happy to help you check your balance. Could you please verify your account number?",
      },
      { role: "user", content: "Yes, it's ACC892." },
      {
        role: "assistant",
        content:
          "Thanks Bill — your ACC892 checking account is at $3,750.00 right now.",
      },
    ],
    referenced_documents: [],
  },
  "+1-917-828-6465": {
    id: "+1-917-828-6465",
    user_id: "+1-917-828-6465",
    time: isoOffset(22),
    agent_trail: ["Triage Agent", "Payments Agent"],
    transcript: [
      {
        role: "assistant",
        content:
          "Hello, welcome to TalkTuahBank. How can I help you today?",
      },
      { role: "user", content: "I need to make a payment to someone." },
      {
        role: "assistant",
        content:
          "I can help you with making a payment. Could you tell me who you'd like to send money to?",
      },
      { role: "user", content: "I want to send $50 to my friend John." },
      {
        role: "assistant",
        content:
          "Got it — I'll get John's account on file and walk through the confirmation.",
      },
    ],
    referenced_documents: [],
  },
  "+1-972-555-0789": {
    id: "+1-972-555-0789",
    user_id: "+1-972-555-0789",
    time: isoOffset(45),
    agent_trail: ["Triage Agent", "Applications Agent"],
    transcript: [
      {
        role: "assistant",
        content:
          "Hello, welcome to TalkTuahBank. How can I help you today?",
      },
      { role: "user", content: "I lost my credit card." },
      {
        role: "assistant",
        content:
          "I'm sorry to hear that. I'll help you report your lost card right away. First, can you verify your identity?",
      },
      { role: "user", content: "Yes, my account number is ACC456." },
    ],
    referenced_documents: [
      {
        id: "DOC-001",
        name: "Lost Card Dispute - ACC456",
        type: "PDF",
        status: "urgent",
      },
    ],
  },
  "+1-817-555-0321": {
    id: "+1-817-555-0321",
    user_id: "+1-817-555-0321",
    time: isoOffset(73),
    agent_trail: ["Triage Agent", "Accounts Agent"],
    transcript: [
      {
        role: "assistant",
        content:
          "Hello, welcome to TalkTuahBank. How can I help you today?",
      },
      { role: "user", content: "I'd like to see my recent transactions." },
      {
        role: "assistant",
        content:
          "I can help you review your recent transactions. Could you please provide your account number?",
      },
      { role: "user", content: "It's ACC654." },
      {
        role: "assistant",
        content:
          "Pulling those up. ACC654 has $9,800.00 with two recent transactions in February.",
      },
    ],
    referenced_documents: [
      {
        id: "DOC-002",
        name: "February Statement - ACC654",
        type: "PDF",
        status: "done",
      },
    ],
  },
  "+1-214-555-0654": {
    id: "+1-214-555-0654",
    user_id: "+1-214-555-0654",
    time: isoOffset(106),
    agent_trail: ["Triage Agent", "Applications Agent"],
    transcript: [
      {
        role: "assistant",
        content:
          "Hello, welcome to TalkTuahBank. How can I help you today?",
      },
      { role: "user", content: "I need help with my mortgage payment." },
      {
        role: "assistant",
        content:
          "I'll be happy to assist you with your mortgage payment. What specific information do you need?",
      },
      {
        role: "user",
        content: "I want to know when my next payment is due.",
      },
      {
        role: "assistant",
        content:
          "Your next mortgage payment is due on the 1st. I can also schedule it from ACC987 if you'd like.",
      },
    ],
    referenced_documents: [
      {
        id: "DOC-003",
        name: "Mortgage Schedule - ACC987",
        type: "PDF",
        status: "medium",
      },
    ],
  },
};

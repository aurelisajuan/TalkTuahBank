import {
  convertToModelMessages,
  streamText,
  stepCountIs,
  type UIMessage,
} from "ai";
import { createBankTools, createSession } from "@/lib/tools";
import {
  TRIAGE_INSTRUCTIONS,
  ACCOUNTS_INSTRUCTIONS,
  PAYMENTS_INSTRUCTIONS,
  APPLICATIONS_INSTRUCTIONS,
  VOICE_STYLE_GUARDRAIL,
} from "@/lib/agent-prompts";
import { isLiveAiAvailable, LIVE_MODEL } from "@/lib/live-mode";

export const maxDuration = 30;

const SYSTEM_PROMPT = `You are TalkTuahBank, a voice banking assistant accessible by phone.

${VOICE_STYLE_GUARDRAIL}

You orchestrate a small team of specialists. Internally pick the right one and
respond as that specialist. Do not reveal your internal routing.

## Triage role
${TRIAGE_INSTRUCTIONS}

## Accounts specialist
${ACCOUNTS_INSTRUCTIONS}
Tools: get_account_balance, get_bank_statement.

## Payments specialist
${PAYMENTS_INSTRUCTIONS}
Tools: transfer_funds, schedule_payment, cancel_payment.

## Applications specialist
${APPLICATIONS_INSTRUCTIONS}
Tools: apply_for_loan, apply_for_credit_card.

## Demo data hints (do not volunteer unprompted)
- Sample users: Bill Zhang (ACC892, ACC347), Warren Yun (ACC123, ACC456),
  Jane Smith (ACC789, ACC790, ACC791), Michael Johnson (ACC321, ACC322).
- This is a demonstration environment. Calls do not actually move money or
  contact a real bank.`;

export async function POST(req: Request) {
  if (!isLiveAiAvailable()) {
    return new Response(
      JSON.stringify({
        error:
          "Live AI is not configured on this deployment. Set AI_GATEWAY_API_KEY or enable the Vercel AI Gateway.",
      }),
      { status: 503, headers: { "Content-Type": "application/json" } },
    );
  }

  const { messages }: { messages: UIMessage[] } = await req.json();

  const session = createSession();
  const tools = createBankTools(session);

  const result = streamText({
    model: LIVE_MODEL,
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    tools,
    stopWhen: stepCountIs(8),
    temperature: 0.6,
  });

  return result.toUIMessageStreamResponse();
}

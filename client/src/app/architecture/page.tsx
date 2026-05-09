import {
  ArrowRight,
  Boxes,
  Cloud,
  Database,
  GitBranch,
  Mic,
  Network,
  Phone,
  Workflow,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SectionHeading } from "@/components/site/section-heading";
import { AnnotatedCode } from "@/components/architecture/annotated-code";
import { MermaidDiagram } from "@/components/architecture/mermaid-client";

export const metadata = {
  title: "Architecture",
  description:
    "How TalkTuahBank routes a phone call into a multi-agent OpenAI Swarm, applies real banking actions, and pins documents to IPFS via Pinata.",
};

const SYSTEM_DIAGRAM = `flowchart TB
    classDef pill fill:#1d2533,stroke:#64A8F0,color:#e6edf7,rx:8,ry:8
    caller["📞 User on a phone"]:::pill
    retell["Retell AI · Telephony + STT/TTS"]:::pill
    fastapi["FastAPI server · main.py"]:::pill
    llm["LlmClient · llm.py"]:::pill
    swarm["AgentSwarm · agent_swarm.py"]:::pill
    triage["Triage Agent"]:::pill
    accounts["Accounts Agent"]:::pill
    payments["Payments Agent"]:::pill
    applications["Applications Agent"]:::pill
    mockDb[("In-memory bank DB · db.py")]:::pill
    pdflatex["pdflatex"]:::pill
    pinata["Pinata · IPFS pin"]:::pill
    dashboard["Operator Console · Next.js"]:::pill

    caller -->|"PSTN call"| retell
    retell -->|"wss /llm-websocket/{call_id}"| fastapi
    fastapi --> llm
    llm --> swarm
    swarm --> triage
    triage --> accounts
    triage --> payments
    triage --> applications
    accounts --> mockDb
    payments --> mockDb
    applications --> pdflatex
    pdflatex --> pinata
    fastapi -->|"ws /ws?client_id"| dashboard
`;

export default function ArchitecturePage() {
  return (
    <div className="container space-y-12 py-10">
      <header className="flex flex-col gap-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
          · System Design
        </span>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          One phone call, four agents, two streams.
        </h1>
        <p className="max-w-3xl text-sm text-muted-foreground">
          The whole stack was built in 24 hours. It connects a regular phone
          line to a Retell-powered conversational layer, hands transcript
          chunks to a small OpenAI Swarm of cooperating agents, persists
          banking actions against an in-memory ledger, and pins generated
          application PDFs to IPFS through Pinata. A second WebSocket pipes
          everything to a Next.js operator console for live observability.
        </p>
      </header>

      {/* Topology */}
      <section className="space-y-4">
        <SectionHeading
          eyebrow="01 · Topology"
          title="What hits what, in what order"
          description="A single inbound call fans out to two streams: the LLM bidirectional WebSocket back into Retell, and a separate observability WebSocket into the operator console."
        />
        <Card>
          <CardContent className="overflow-x-auto p-6">
            <MermaidDiagram chart={SYSTEM_DIAGRAM} />
          </CardContent>
        </Card>
      </section>

      {/* WebSocket glue */}
      <section className="space-y-4">
        <SectionHeading
          eyebrow="02 · Telephony bridge"
          title="The Retell ↔ FastAPI bidirectional socket"
          description="Retell forwards real-time transcripts and waits for streamed LLM responses on a per-call WebSocket. The bridge starts a fresh LlmClient and immediately greets the caller by name."
        />
        <AnnotatedCode
          filename="server/main.py"
          language="python"
          highlight={[5, 8, 13, 17]}
          callouts={[
            { line: 5, note: "Look up caller by phone number" },
            { line: 8, note: "Greet by name on connection" },
            { line: 13, note: "Spawn one task per inbound chunk" },
            { line: 17, note: "Bail early if a newer reply has arrived" },
          ]}
          code={`if request_json["interaction_type"] == "call_details":
    number = "+1-" + ... # normalize from caller ID
    llm_client = LlmClient(db["users"][number]["name"])
    first_event = llm_client.draft_begin_message()
    await websocket.send_json(first_event.__dict__)

# stream the LLM response back to Retell
async for event in llm_client.draft_response(request):
    await websocket.send_json(event.__dict__)
    if request.response_id < response_id:
        break  # new response needed, abandon this one

async for data in websocket.iter_json():
    asyncio.create_task(handle_message(data))`}
          caption="Each WebSocket message is handled in its own task so a long LLM response never blocks the next user utterance."
        />
      </section>

      {/* Agent swarm */}
      <section className="space-y-4">
        <SectionHeading
          eyebrow="03 · Multi-agent routing"
          title="OpenAI Swarm with handoff functions"
          description="Triage owns intent classification and delegates by calling a transfer_to_X function. Each specialist has its own tool surface and an explicit way home."
        />
        <div className="grid gap-4 md:grid-cols-2">
          <AnnotatedCode
            filename="server/agent_swarm.py"
            language="python"
            highlight={[3, 9, 18]}
            callouts={[
              { line: 3, note: "Triage agent gets all transfer fns" },
              { line: 9, note: "Specialists know how to return" },
            ]}
            code={`self.triage_agent = TriageAgent([
    self.transfer_to_accounts,
    self.transfer_to_payments,
    self.transfer_to_applications,
])

self.accounts_agent = AccountsAgent(
    transfer_to_payments=self.transfer_to_payments,
    handle_account_balance=handle_account_balance,
    retrieve_bank_statement=retrieve_bank_statement,
)

def transfer_to_accounts(self, ctx, user_message):
    self.current_agent = self.accounts_agent
    return self.accounts_agent

def transfer_back_to_triage(self, ctx, response):
    self.current_agent = self.triage_agent
    return self.triage_agent`}
            caption="Handoffs are first-class tools: they are functions the LLM literally calls. There is no hidden router."
          />
          <AnnotatedCode
            filename="server/agents/triage_agent.py"
            language="python"
            highlight={[3, 4, 5]}
            callouts={[
              { line: 6, note: "Loan = Applications, not Payments" },
            ]}
            code={`triage_instructions = """
You are the Triage Agent ...

1. Account balances or statements → Accounts Agent
2. Transfers, scheduled payments, cancellations → Payments Agent
3. Loan or credit card applications → Applications Agent
4. Need more info? Ask one direct question.
5. Don't expose your internal decisions.
"""`}
            caption="Verbatim from server/agents/triage_agent.py and reused as the system prompt for Live AI mode."
          />
        </div>
      </section>

      {/* Tool implementation */}
      <section className="space-y-4">
        <SectionHeading
          eyebrow="04 · Action layer"
          title="Real bank operations against an in-memory ledger"
          description="transfer_funds is the canonical example: validate, check funds, mutate balances, record a payment, return a Result that the LLM can read back to the caller."
        />
        <AnnotatedCode
          filename="server/agents/payments_agent.py"
          language="python"
          highlight={[7, 14, 21, 28]}
          callouts={[
            { line: 7, note: "Defensive validation" },
            { line: 14, note: "Real balance mutation" },
            { line: 21, note: "Append to ledger" },
            { line: 28, note: "agent=None ⇒ control returns to triage" },
          ]}
          code={`def transfer_funds(ctx, from_account, to_account, amount):
    if not validate_account_id(from_account):
        return Result(value="Source account does not exist.", agent=None)
    if not validate_account_id(to_account):
        return Result(value="Destination account does not exist.", agent=None)
    if not validate_amount(amount):
        return Result(value="Amount must be a positive number.", agent=None)

    db = get_db()
    if db["accounts"][from_account]["balance"] < amount:
        return Result(value="Insufficient funds.", agent=None)

    db["accounts"][from_account]["balance"] -= amount
    db["accounts"][to_account]["balance"] += amount

    new_payment_id = generate_payment_id()
    db["payments"][new_payment_id] = {
        "from_account": from_account,
        "to_account": to_account,
        "amount": amount,
        "date": datetime.now().strftime("%Y-%m-%d"),
        "status": "Completed",
    }
    set_db(db)

    return Result(
        value=f"Transferred ${'{'}amount:.2f{'}'} from {'{'}from_account{'}'} to {'{'}to_account{'}'}. Payment ID: {'{'}new_payment_id{'}'}.",
        agent=None,
    )`}
        />
      </section>

      {/* Applications + Pinata */}
      <section className="space-y-4">
        <SectionHeading
          eyebrow="05 · Applications & decentralized storage"
          title="LaTeX → PDF → Pinata IPFS"
          description="When the caller applies for a loan or credit card, the Applications Agent renders a LaTeX template, compiles to PDF with pdflatex, and pins the file to IPFS through Pinata. The CID surfaces in the operator console."
        />
        <div className="grid gap-4 md:grid-cols-2">
          <AnnotatedCode
            filename="server/agents/applications_agent.py"
            language="python"
            highlight={[5, 7]}
            callouts={[
              { line: 5, note: "Run pdflatex in the apps dir" },
              { line: 7, note: "Pin the resulting PDF to IPFS" },
            ]}
            code={`tex_filepath = os.path.join(APPLICATIONS_DIR, tex_filename)
pdf_filepath = os.path.join(APPLICATIONS_DIR, pdf_filename)

with open(tex_filepath, "w") as f:
    f.write(latex_content)

subprocess.run(["pdflatex", "-interaction=nonstopmode", tex_filename],
               cwd=APPLICATIONS_DIR, check=True)

upload_pdf_to_pinata(pdf_filepath, "LOAN")`}
          />
          <AnnotatedCode
            filename="server/pinata.py"
            language="python"
            highlight={[3, 12]}
            callouts={[
              { line: 12, note: "Returns IpfsHash + URL" },
            ]}
            code={`PINATA_URL = "https://api.pinata.cloud/pinning/pinFileToIPFS"
headers = {
    "pinata_api_key": PINATA_API_KEY,
    "pinata_secret_api_key": PINATA_SECRET_API_KEY,
}

with open(pdf_path, "rb") as f:
    files = {"file": (os.path.basename(pdf_path), f, "application/pdf")}
    metadata = {"name": f"{document_type}_{stem}", "keyvalues": {...}}
    data = {"pinataMetadata": json.dumps(metadata)}
    r = requests.post(PINATA_URL, files=files, data=data, headers=headers)

if r.status_code == 200:
    return r.json()  # {"IpfsHash": "...", ...}`}
          />
        </div>
      </section>

      {/* Design tradeoffs */}
      <section className="space-y-4">
        <SectionHeading
          eyebrow="06 · Why we picked these"
          title="Tradeoffs we made under a 24-hour clock"
        />
        <div className="grid gap-3 md:grid-cols-3">
          <ChoiceCard
            icon={<Phone className="h-4 w-4 text-primary" />}
            label="Telephony"
            chose="Retell AI"
            instead="Twilio Voice + custom STT/TTS"
            reason="Retell collapses STT, TTS, barge-in handling, and the LLM bidirectional WebSocket into one provider. We had hours, not days."
          />
          <ChoiceCard
            icon={<Workflow className="h-4 w-4 text-primary" />}
            label="Multi-agent"
            chose="OpenAI Swarm"
            instead="LangGraph or hand-rolled router"
            reason="Swarm's handoff-as-a-tool model maps 1:1 to a phone-call transfer. Simpler mental model, smaller diff against vanilla OpenAI tool calling."
          />
          <ChoiceCard
            icon={<Cloud className="h-4 w-4 text-primary" />}
            label="Document storage"
            chose="Pinata IPFS"
            instead="S3 / Supabase Storage"
            reason="The challenge sponsor was Pinata. Bonus: a content-addressed CID is naturally tamper-evident, which is a nice property for a regulated artifact."
          />
          <ChoiceCard
            icon={<Database className="h-4 w-4 text-primary" />}
            label="Bank data"
            chose="In-memory dict"
            instead="Postgres / SQLite"
            reason="Hackathon scope. The dict's shape ports cleanly to a real DB later — no ORM lock-in, no migrations to maintain over the weekend."
          />
          <ChoiceCard
            icon={<Network className="h-4 w-4 text-primary" />}
            label="Console transport"
            chose="Plain WebSocket"
            instead="SSE / polling"
            reason="One bidirectional socket per operator, identical contract to the LLM channel. Easier to extend with operator-initiated actions later."
          />
          <ChoiceCard
            icon={<Boxes className="h-4 w-4 text-primary" />}
            label="Frontend"
            chose="Next.js 15 + RSC"
            instead="Vite SPA"
            reason="Matches Vercel deployment defaults and lets the rebuilt project page ship serverless route handlers (Live AI) without a second backend."
          />
        </div>
      </section>

      {/* Self-host */}
      <Separator />
      <section className="rounded-xl border border-border bg-card/40 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Mic className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="text-base font-semibold">
                Want the real telephony loop?
              </h3>
              <div className="mt-1 max-w-xl space-y-2 text-sm text-muted-foreground">
                <p>
                  The full Python backend is in{" "}
                  <code className="rounded bg-muted px-1 font-mono text-xs">
                    server/
                  </code>
                  . Set the env vars below and run{" "}
                  <code className="rounded bg-muted px-1 font-mono text-xs">
                    uvicorn main:app
                  </code>{" "}
                  — the operator console here will pick the WebSocket back up
                  with a one-line change in{" "}
                  <code className="rounded bg-muted px-1 font-mono text-xs">
                    src/lib/store.ts
                  </code>
                  .
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="outline" className="font-mono text-[10px]">
                    RETELL_API_KEY
                  </Badge>
                  <Badge variant="outline" className="font-mono text-[10px]">
                    OPENAI_API_KEY
                  </Badge>
                  <Badge variant="outline" className="font-mono text-[10px]">
                    PINATA_API_KEY
                  </Badge>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm">
              <a
                href="https://github.com/aurelisajuan/TalkTuahBank/tree/main/server"
                target="_blank"
                rel="noreferrer"
              >
                <GitBranch className="h-3.5 w-3.5" /> View server/ on GitHub
              </a>
            </Button>
            <Button asChild size="sm">
              <Link href="/build">
                Build notes <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

function ChoiceCard({
  icon,
  label,
  chose,
  instead,
  reason,
}: {
  icon: React.ReactNode;
  label: string;
  chose: string;
  instead: string;
  reason: string;
}) {
  return (
    <Card>
      <CardContent className="space-y-2 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              {label}
            </span>
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-semibold">{chose}</span>
          <span className="font-mono text-[10px] text-muted-foreground">
            instead of {instead}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">{reason}</p>
      </CardContent>
    </Card>
  );
}

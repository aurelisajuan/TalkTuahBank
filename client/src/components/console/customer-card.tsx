"use client";

import * as React from "react";
import { Eye, EyeOff, ChevronDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn, formatCurrency, maskDigits } from "@/lib/utils";
import type { BankDatabase, Call } from "@/lib/types";

type Section = "info" | "transactions" | "accounts";

const SECTION_LABEL: Record<Section, string> = {
  info: "User information",
  transactions: "User transactions",
  accounts: "User accounts",
};

interface CustomerCardProps {
  call?: Call;
  db: BankDatabase;
}

export function CustomerCard({ call, db }: CustomerCardProps) {
  const [section, setSection] = React.useState<Section>("info");
  const [showSensitive, setShowSensitive] = React.useState(false);

  const user = call ? db.users[call.user_id] : undefined;
  const accounts =
    user?.accounts.map((id) => ({
      accountNumber: id,
      balance: db.accounts[id]
        ? formatCurrency(db.accounts[id].balance)
        : "N/A",
    })) ?? [];

  const transactions = React.useMemo(() => {
    if (!user || accounts.length === 0) return [];
    const primary = accounts[0]?.accountNumber;
    if (!primary) return [];
    return Object.entries(db.payments)
      .filter(
        ([, p]) =>
          p.from_account === primary || p.to_account === primary,
      )
      .map(([id, p]) => ({
        id,
        date: p.date,
        description:
          p.from_account === primary
            ? `Payment to ${p.to_account}`
            : `Payment from ${p.from_account}`,
        amount: `${p.from_account === primary ? "-" : "+"}${formatCurrency(
          p.amount,
        )}`,
        status: p.status,
      }));
  }, [user, accounts, db.payments]);

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="flex items-center justify-between">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="-mx-2">
                <span className="text-base font-semibold">
                  {SECTION_LABEL[section]}
                </span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>View</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => setSection("info")}>
                User information
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => setSection("transactions")}
              >
                User transactions
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setSection("accounts")}>
                User accounts
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSensitive((s) => !s)}
          >
            {showSensitive ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
            {showSensitive ? "Hide" : "Show"}
          </Button>
        </div>

        {!user ? (
          <p className="text-sm text-muted-foreground">
            Select a call to load the customer profile.
          </p>
        ) : section === "info" ? (
          <dl className="grid grid-cols-1 gap-y-3 text-sm">
            <Field label="User ID" value={call?.user_id ?? ""} mono />
            <Field label="Name" value={user.name} />
            <Field
              label="SSN"
              value={maskDigits(user.ssn, showSensitive)}
              mono
            />
            <Field label="Address" value={user.address} />
            <Field
              label="Date of birth"
              value={maskDigits(user.date_of_birth, showSensitive)}
              mono
            />
            <Field label="Email" value={user.email} mono />
            <Field
              label="Phone"
              value={maskDigits(user.phone, showSensitive)}
              mono
            />
          </dl>
        ) : section === "accounts" ? (
          <ul className="space-y-2">
            {accounts.map((a) => (
              <li
                key={a.accountNumber}
                className="rounded-lg border border-border/60 bg-muted/20 p-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      Account
                    </p>
                    <p className="font-mono text-sm">
                      {maskDigits(a.accountNumber, showSensitive)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      Balance
                    </p>
                    <p className="font-mono text-sm tabular-nums">
                      {a.balance}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <ul className="space-y-2">
            {transactions.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No payments tied to the primary account on this call.
              </p>
            ) : (
              transactions.map((t) => (
                <li
                  key={t.id}
                  className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/20 p-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{t.description}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">
                      {t.date} · {t.id} · {t.status}
                    </p>
                  </div>
                  <Badge
                    variant={
                      t.amount.startsWith("+") ? "success" : "destructive"
                    }
                    className="font-mono"
                  >
                    {t.amount}
                  </Badge>
                </li>
              ))
            )}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

function Field({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="grid grid-cols-[110px_minmax(0,1fr)] items-baseline gap-3">
      <dt className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </dt>
      <dd
        className={cn(
          "min-w-0 break-words text-sm",
          mono && "font-mono",
        )}
      >
        {value}
      </dd>
    </div>
  );
}

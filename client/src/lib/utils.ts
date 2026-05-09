import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(n: number): string {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });
}

export function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  return raw;
}

export function maskDigits(value: string, show: boolean): string {
  if (!value) return "";
  if (show) return value;
  return value.replace(/\d/g, "•");
}

export function fakeIpfsCid(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz234567";
  let cid = "bafybeih";
  for (let i = 0; i < 44; i++) {
    cid += chars[Math.floor(Math.random() * chars.length)];
  }
  return cid;
}

export function shortCid(cid: string): string {
  if (cid.length <= 16) return cid;
  return `${cid.slice(0, 10)}…${cid.slice(-6)}`;
}

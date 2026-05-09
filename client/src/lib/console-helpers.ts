// Verbatim port of analyzeDocumentStatus from the original
// client/src/app/page.tsx so document urgency triage stays identical.
import type { DocumentStatus } from "@/lib/types";

export const analyzeDocumentStatus = (doc: {
  name: string;
  type: string;
}): DocumentStatus => {
  if (doc.name.toLowerCase().includes("dispute")) return "urgent";
  if (doc.type === "PDF") return "medium";
  return "done";
};

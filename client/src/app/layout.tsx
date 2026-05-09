import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://talktuahbank.vercel.app"),
  title: {
    default: "TalkTuahBank — Voice Banking for the Unbanked",
    template: "%s · TalkTuahBank",
  },
  description:
    "TalkTuahBank is a voice-based, multi-agent banking assistant that meets people where they are — over a regular phone call. Built in 24 hours and won Overall 1st Place + Goldman Sachs at HackUTD 2024.",
  openGraph: {
    title: "TalkTuahBank — Voice Banking for the Unbanked",
    description:
      "Multi-agent conversational AI over the phone. Built in 24 hours. Won Overall 1st Place + Goldman Sachs at HackUTD 2024.",
    type: "website",
    url: "/",
    siteName: "TalkTuahBank",
  },
  twitter: {
    card: "summary_large_image",
    title: "TalkTuahBank — Voice Banking for the Unbanked",
    description:
      "Multi-agent conversational AI over the phone. Built in 24 hours at HackUTD 2024.",
  },
  authors: [
    { name: "Aurelisa Juan" },
    { name: "Bill Zhang" },
    { name: "Warren Yun" },
  ],
  keywords: [
    "TalkTuahBank",
    "HackUTD 2024",
    "Goldman Sachs",
    "Voice AI",
    "Multi-agent",
    "Retell AI",
    "OpenAI Swarm",
    "Pinata IPFS",
    "Next.js",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <TooltipProvider delayDuration={150}>
            <div className="relative flex min-h-screen flex-col">
              <SiteHeader />
              <main className="flex-1">{children}</main>
              <SiteFooter />
            </div>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

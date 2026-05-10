import type { Metadata, Viewport } from "next";
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

const SITE_URL = "https://talktuahbank.vercel.app";
const SITE_NAME = "TalkTuahBank";
const SITE_TITLE = "TalkTuahBank — Voice banking for the unbanked";
const SITE_DESCRIPTION =
  "A multi-agent conversational AI that runs over a regular phone call — no internet, no smartphone, no banking app. Built in 24 hours and crowned Overall 1st Place + Goldman Sachs Track Winner at HackUTD 2024.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s · TalkTuahBank",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  category: "technology",
  creator: "Aurelisa Juan, Bill Zhang, Warren Yun",
  authors: [
    { name: "Aurelisa Juan", url: "https://devpost.com/aurelisajuan" },
    { name: "Bill Zhang", url: "https://devpost.com/IdkwhatImD0ing" },
    { name: "Warren Yun", url: "https://devpost.com/NebuDev14" },
  ],
  keywords: [
    "TalkTuahBank",
    "HackUTD 2024",
    "HackUTD Ripple Effect",
    "Goldman Sachs Track",
    "Voice AI",
    "Conversational AI",
    "Multi-agent system",
    "Retell AI",
    "OpenAI Swarm",
    "Pinata IPFS",
    "FastAPI",
    "Next.js 15",
    "Vercel AI SDK",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: SITE_TITLE,
    description:
      "Multi-agent conversational AI over the phone. Built in 24 hours. Won Overall 1st Place + Goldman Sachs at HackUTD 2024.",
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description:
      "Multi-agent conversational AI over the phone. Built in 24 hours at HackUTD 2024.",
    creator: "@TalkTuahBank",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0e16" },
  ],
  colorScheme: "dark light",
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

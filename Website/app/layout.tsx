import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SystemTopBar, SystemFooter } from "@/components/SystemFrame";
import { WebsiteSettingsProvider } from "@/components/WebsiteSettingsProvider";
import { BootCompleteProvider } from "@/components/BootCompleteContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const SITE_URL = "https://nodexity.com";
const SITE_DESCRIPTION =
  "A local-first Minecraft server stack — desktop app, launcher, and hosting. Your worlds and data stay on your machine.";

export const metadata: Metadata = {
  title: {
    default: "Nodexity",
    template: "%s | Nodexity",
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Nodexity",
    title: "Nodexity",
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: "Nodexity",
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="flex h-full flex-col overflow-hidden">
        {/* Skip-to-content link for keyboard / screen-reader users */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-mono focus:text-background focus:outline-none"
        >
          Skip to content
        </a>
        <WebsiteSettingsProvider>
          <BootCompleteProvider>
            <div className="relative z-10 flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden">
              <SystemTopBar />
              <main id="main-content" className="relative z-10 flex-1">{children}</main>
              <SystemFooter />
            </div>
          </BootCompleteProvider>
        </WebsiteSettingsProvider>
      </body>
    </html>
  );
}

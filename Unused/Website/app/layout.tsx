import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ConditionalFooter from "@/components/ConditionalFooter";
import { ResourcePoolConfigProvider } from "@/components/context/ResourcePoolConfigContext";

export const metadata: Metadata = {
  metadataBase: new URL('https://nodexity.com'),
  title: {
    default: "NODEXITY — Resources, not restrictions",
    template: "%s | NODEXITY",
  },
  description: "Resource-based Minecraft hosting. Buy a pool of resources and deploy servers without limits.",
  applicationName: "NODEXITY",
  openGraph: {
    title: "NODEXITY",
    description: "Resource-based Minecraft hosting. Buy a pool of resources and deploy servers without limits.",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/logo.png", type: "image/png" },
    ],
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-foreground font-sans antialiased min-h-screen flex flex-col">
        <ResourcePoolConfigProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <ConditionalFooter />
        </ResourcePoolConfigProvider>
      </body>
    </html>
  );
}


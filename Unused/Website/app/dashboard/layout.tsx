import type { Metadata } from "next";
import { ServerProvider } from "@/components/context/ServerContext";
import { AssistantProvider } from "@/components/context/AssistantContext";
import DashboardAssistant from "@/components/assistant/DashboardAssistant";
import DashboardSidebar from "@/components/DashboardSidebar";
import PageTransition from "@/components/PageTransition";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your HEXNODE infrastructure, resource pools, and servers.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ServerProvider>
      <AssistantProvider>
        <div className="flex min-h-full bg-background pt-16">
          <DashboardSidebar />
          <div className="flex-1 ml-60 flex flex-col">
            <main className="flex-1">
              <PageTransition>
                {children}
              </PageTransition>
            </main>
            <Footer />
          </div>
        </div>
        <DashboardAssistant />
      </AssistantProvider>
    </ServerProvider>
  );
}


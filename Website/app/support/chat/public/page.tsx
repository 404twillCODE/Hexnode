import Link from "next/link";
import { getCurrentUser } from "@/lib/supabase/server";
import { supabase } from "@/lib/supabase";
import { redirect } from "next/navigation";
import { RoleBadge } from "@/components/RoleBadge";
import { PublicChatForm } from "./PublicChatForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Public Chat | Support | Nodexity",
  description: "Public chat for the community",
};

export default async function PublicChatPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?callbackUrl=/support/chat/public");

  const { data: messages } = await supabase
    .from("PublicMessage")
    .select(`
      id,
      body,
      createdAt,
      sender:User!senderId(id, name, email, role)
    `)
    .order("createdAt", { ascending: true })
    .limit(200);

  const messageList = (messages ?? []).map((m: Record<string, unknown>) => ({
    id: m.id,
    body: m.body,
    createdAt: m.createdAt,
    sender: m.sender as { id: string; name: string | null; email: string; role?: string } | null,
  }));

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Link href="/support/chat" className="text-sm text-text-muted hover:text-accent">← Back to Chat</Link>
        <h1 className="mt-2 text-xl font-semibold text-text-primary font-mono">
          Public Chat
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          Everyone can read and send messages here. Be respectful.
        </p>
      </div>

      <div className="rounded-lg border border-border bg-background-secondary/40 flex flex-col min-h-[400px]">
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messageList.length === 0 ? (
            <p className="text-sm text-text-muted">No messages yet. Say something below.</p>
          ) : (
            messageList.map((msg) => (
              <div key={msg.id as string}>
                <div className="rounded-lg bg-background-secondary/80 px-3 py-2 text-sm">
                  <p className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-text-primary">
                      {msg.sender?.name || msg.sender?.email || "Unknown"}
                    </span>
                    {msg.sender?.role && msg.sender.role !== "user" && (
                      <RoleBadge role={msg.sender.role as "user" | "mod" | "admin" | "owner"} size="sm" />
                    )}
                    <span className="text-xs text-text-muted">
                      {new Date(msg.createdAt as string).toLocaleString()}
                    </span>
                  </p>
                  <p className="whitespace-pre-wrap text-text-primary mt-0.5">{msg.body as string}</p>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="border-t border-border p-4">
          <PublicChatForm />
        </div>
      </div>
    </div>
  );
}

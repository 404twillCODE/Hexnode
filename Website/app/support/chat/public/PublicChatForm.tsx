"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { sendPublicMessage } from "../../actions";

export function PublicChatForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const result = await sendPublicMessage(formData);
    setLoading(false);
    if (result?.error) {
      setError(result.error);
      return;
    }
    form.reset();
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <textarea
        name="body"
        placeholder="Type a message..."
        rows={2}
        className="min-w-0 flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent"
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="shrink-0 rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Sending…" : "Send"}
      </button>
      {error && (
        <p className="w-full text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </form>
  );
}

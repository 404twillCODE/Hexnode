-- Public chat: one shared channel where any logged-in user can read and post.

CREATE TABLE IF NOT EXISTS "PublicMessage" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "senderId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "body" TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "PublicMessage_createdAt_idx" ON "PublicMessage"("createdAt");

ALTER TABLE "PublicMessage" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "PublicMessage_select_authenticated" ON "PublicMessage";
CREATE POLICY "PublicMessage_select_authenticated" ON "PublicMessage"
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "PublicMessage_insert_authenticated" ON "PublicMessage";
CREATE POLICY "PublicMessage_insert_authenticated" ON "PublicMessage"
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = "senderId");

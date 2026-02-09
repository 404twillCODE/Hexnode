"use server";

import { createClient } from "@/lib/supabase/server";
import { supabase as supabaseAdmin } from "@/lib/supabase";

export type LoginResult = { success: true } | { success: false; error: string };

export async function loginWithPassword(identifier: string, password: string): Promise<LoginResult> {
  const trimmed = identifier.trim();
  if (!trimmed || !password) {
    return { success: false, error: "Email/username and password are required." };
  }

  let email: string;
  if (trimmed.includes("@")) {
    email = trimmed.toLowerCase();
  } else {
    const { data, error } = await supabaseAdmin
      .from("User")
      .select("email")
      .ilike("name", trimmed)
      .limit(1)
      .maybeSingle();
    if (error || !data?.email) {
      return { success: false, error: "Invalid email/username or password." };
    }
    email = data.email;
  }

  const supabase = await createClient();
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (signInError) {
    return { success: false, error: "Invalid email/username or password." };
  }
  return { success: true };
}

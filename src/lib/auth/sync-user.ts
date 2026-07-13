import { prisma } from "@/lib/prisma";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export async function syncUserToDb(supabaseUser: SupabaseUser) {
  const existing = await prisma.user.findUnique({
    where: { email: supabaseUser.email! },
  });

  if (existing) {
    return existing;
  }

  return prisma.user.create({
    data: {
      email: supabaseUser.email!,
      name: supabaseUser.user_metadata?.full_name ?? null,
      // role defaults to NORTHEASTERN_STUDENT
    },
  });
}
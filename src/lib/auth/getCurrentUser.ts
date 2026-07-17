import { prisma } from "../prisma";
import { createClient } from "../supabase/server";

// Returns the Prism User for the current session, or null
// (null = no session, or authed but no Prism row yet.)
export async function getCurrentUser() {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser?.email) return null;

    return prisma.user.findUnique({ where: { email: authUser.email } });
}
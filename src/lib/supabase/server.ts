import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { generateCheckInCode } from "../attendance/check-in-code";

export async function createClient() {
    const cookieStore = await cookies();

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll: () => cookieStore.getAll(),
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({name, value, options}) => {
                            cookieStore.set({name, value, ...options});
                        });
                    } catch (error) {
                        // Runs during page render, where cookie writes aren't allowed.
                        // Safe to ignore - middleware.ts already refreshed the session this request.
                    }
                }
            },
        }
    );
}
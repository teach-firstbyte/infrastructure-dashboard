'use server'

import { createClient } from "@/lib/supabase/server";
import { syncUserToDb } from "@/lib/auth/sync-user";
import { redirect } from "next/navigation";


export async function signUp(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;

    const supabase = await createClient();

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: name ?? undefined,
            },
        },
    });

    if (error) {
        redirect(`/login?error=${encodeURIComponent(error.message)}`);
    }

    if (data.user) {
        await syncUserToDb(data.user);
    }

    redirect('/');
}

export async function logIn(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        redirect(`/login?error=${encodeURIComponent(error.message)}`);
    }

    if (data.user) {
        await syncUserToDb(data.user);
    }

    redirect('/');
}

export async function logOut() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect('/login');
}
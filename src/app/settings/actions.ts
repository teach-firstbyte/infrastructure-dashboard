'use server'

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

type ActionResult = { success?: boolean; error?: string }

export async function updateName(prevState: ActionResult, formData: FormData): Promise<ActionResult> {
    const name = (formData.get('name') as string ?? "").trim()
    if (!name) return { error: 'Name cannot be empty' }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) return { error: 'Not authenticated' }
    
    const { error: authError } = await supabase.auth.updateUser({ data: { full_name: name } })
    if (authError) return { error: authError.message };

    try {
        await prisma.user.update({ where: { email: user.email }, data: { name }})
    } catch (error) {
        return { error: 'Failed to update name' }
    }

    revalidatePath('/settings')
    return { success: true }
    
}

export async function updatePassword(prevState: ActionResult, formData: FormData): Promise<ActionResult> {
    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!(currentPassword && newPassword && confirmPassword)) {
        return { error: 'All fields are required.'}
    } else if (newPassword !== confirmPassword) {
        return { error: 'New passwords do not match.'}
    } else if (newPassword.length < 6) {
        return { error: 'Password must be at least 6 characters.'}
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) return { error: 'Not authenticated' }

    const { error } = await supabase.auth.updateUser({
        current_password: currentPassword,
        password: newPassword,
    })
    if (error) return { error: error.message }

    return { success: true };
}
'use client'

import { SubmitButton } from "@/components/SubmitButton"
import { Input } from "@/components/ui/input"
import { useActionState } from "react"
import { updatePassword } from "./actions"

export function PasswordForm() {
    const [state, formAction] = useActionState(updatePassword, {})

    return (
        <form action={formAction} className="space-y-3">
            <Input type="password" name="currentPassword" placeholder="Current password" />
            <Input type="password" name="newPassword" placeholder="New password" />
            <Input type="password" name="confirmPassword" placeholder="Confirm new password" />
            <SubmitButton pendingLabel="Updating...">Update password</SubmitButton>
            {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
            {state?.success && <p className="text-sm text-muted-foreground">Password updated</p>}
        </form>
    )
}
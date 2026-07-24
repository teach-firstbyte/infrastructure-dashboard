'use client'

import { useActionState } from "react"
import { updateName } from "./actions"
import { Input } from "@/components/ui/input"
import { SubmitButton } from "@/components/SubmitButton"

export function NameForm({ currentName }: { currentName: string | null }) {
    const [state, formAction] = useActionState(updateName, {})

    return (
        <form action={formAction} className="space-y-3">
            <Input name="name" defaultValue={currentName ?? ""} />
            <SubmitButton pendingLabel="Saving...">Save</SubmitButton>
            {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
            {state?.success && <p className="text-sm text-muted-foreground">Name updated</p>}
        </form>
    )
}
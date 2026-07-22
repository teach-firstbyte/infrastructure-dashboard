'use client'

import { useFormStatus } from "react-dom"
import { Button, buttonVariants } from "@/components/ui/button"
import { type VariantProps } from "class-variance-authority"
import { useEffect, useRef } from "react"

type SubmitButtonProps = React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
        pendingLabel?: string
    }

export function SubmitButton({
    children,
    className,
    variant,
    size,
    pendingLabel,
    onClick,
    ...props
}: SubmitButtonProps) {
    const { pending } = useFormStatus()
    const clickedRef = useRef(false);
    const wasPending = useRef(false);

    useEffect(() => {
        if (wasPending.current && !pending) clickedRef.current = false
        wasPending.current = pending
    }, [pending])

    const showPending = pending && clickedRef.current

    return (
        <Button 
            type="submit"
            variant={variant}
            size={size}
            className={className}
            aria-busy={showPending}
            onClick={(e) => { clickedRef.current = true; onClick?.(e)}}
            {...props}
            disabled={pending}
        >
            {showPending && (
                <span
                    aria-hidden="true"
                    className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                />
            )}
            {showPending ? (pendingLabel ?? children) : children}
        </Button>
    )
}
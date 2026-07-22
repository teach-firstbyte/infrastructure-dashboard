import Link from "next/link"
import { Button } from "./ui/button"
import { ArrowLeft } from "lucide-react"

export function BackLink({
    href = "/",
    label = "Back to dashboard",
} : {
    href?: string,
    label?: string
}) {
    return (
        <Button asChild variant="ghost" size="sm">
            <Link href={href}>
                <ArrowLeft />
                {label}
            </Link>
        </Button>
    )
}
'use client'

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "./ui/button";

interface PaginationControlsProps {
    page: number;
    totalPages: number;
    hasPrev: boolean;
    hasNext: boolean;
}

export function PaginationControls({ page, totalPages, hasPrev, hasNext }: PaginationControlsProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const goToPage = (targetPage: number) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", targetPage.toString());
        router.push(`${pathname}?${params.toString()}`);
    }

    return (
        <div className="flex items-center justify-between gap-4 mt-4">
            <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    disabled={!hasPrev}
                    onClick={() => goToPage(page - 1)}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    disabled={!hasNext}
                    onClick={() => goToPage(page + 1)}
                >
                    Next
                </Button>
            </div>
        </div>
    )
}
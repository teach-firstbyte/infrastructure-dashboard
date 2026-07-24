import { AttendanceTable } from "@/components/AttendanceTable";
import { BackLink } from "@/components/BackLink";
import { PaginationControls } from "@/components/PaginationControls";
import { SearchInput } from "@/components/SearchInput";
import { StatusFilter } from "@/components/StatusFilter";
import { requireOfficer } from "@/lib/auth/requireOfficer";
import { getPagination } from "@/lib/pagination";
import { prisma } from "@/lib/prisma";
import { Attendance } from "@/types/dashboard";
import { AttendanceStatus } from "@prisma/client";
import { Suspense } from "react";

const PAGE_SIZE = 25;

export default async function AttendancePage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    await requireOfficer();

    let attendance: Attendance[] = [];
    let total = 0;
    let dbUnavailable = false;
    let page = 1;
    let totalPages = 1;
    let hasPrev = false;
    let hasNext = false;
    let filtersActive = false;
    
    try {
        const params = await searchParams;

        const rawPageParam = Array.isArray(params.page) ? params.page[0] : params.page;
        const rawPage = parseInt(rawPageParam ?? "");

        const rawQ = Array.isArray(params.q) ? params.q[0] : params.q;
        const q = rawQ?.trim() || undefined;

        const rawStatus = Array.isArray(params.status) ? params.status[0] : params.status;
        const status = Object.values(AttendanceStatus).includes(rawStatus as AttendanceStatus) ? rawStatus as AttendanceStatus : undefined; 

        const where = {
            status: status ?? undefined,
            OR: q
                ? [
                    { user: { name: { contains: q, mode: "insensitive" as const } } },
                    { user: { email: { contains: q, mode: "insensitive" as const } } },
                    { meeting: { title: { contains: q, mode: "insensitive" as const } } },
                ]
                : undefined,
        };

        total = await prisma.attendance.count({ where });

        const pagination = getPagination({
            page: rawPage,
            pageSize: PAGE_SIZE,
            total,
        });
        page = pagination.page;
        totalPages = pagination.totalPages;
        hasPrev = pagination.hasPrev;
        hasNext = pagination.hasNext;
        const { skip, take } = pagination;


        attendance = await prisma.attendance.findMany({
            where,
            include: { user: true, meeting: true },
            orderBy: [{ checkedInAt: { sort: "desc", nulls: "last" } }, { id: "desc" }],
            skip,
            take,
        });

        filtersActive = Boolean(q || status);
    } catch (error) {
        dbUnavailable = true;
        console.error("Attendance query failed:", error);
    }

    const emptyMessage = filtersActive
            ? "No records match your filters."
            : "No attendance records yet.";

    return (
        <div className="container mx-auto p-6">
            {dbUnavailable && (
                <div className="rounded-md border border-yellow-300 bg-yellow-50 px-4 py-3 text-sm text-yellow-900 mb-4">
                    Could not load attendance right now. Showing an empty view until the connection is restored.
                </div>
            )}
            <BackLink />
            <div className="mt-4 mb-4">
                <Suspense fallback={<div className="h-9" />}>
                    <div className="flex gap-3 items-center">
                        <div className="flex-1">
                            <SearchInput />
                        </div>
                        <StatusFilter />
                    </div>
                </Suspense>
            </div>
            <div className="mt-4">
                <AttendanceTable attendance={attendance} emptyMessage={emptyMessage} />
            </div>
            <PaginationControls
                page={page}
                totalPages={totalPages}
                hasPrev={hasPrev}
                hasNext={hasNext}
            />
        </div>
    );
}
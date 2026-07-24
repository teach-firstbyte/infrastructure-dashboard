interface PaginationArgs {
    page: number;
    pageSize: number;
    total: number;
}

export function getPagination({ page, pageSize, total } : PaginationArgs) {
    const totalPages = Math.max(1, Math.ceil(total / pageSize))

    let safePage = Number.isInteger(page) ? page : 1;

    if (safePage > totalPages) {
        safePage = totalPages;
    } else if (safePage < 1) {
        safePage = 1;
    }

    return {
        page: safePage,
        totalPages,
        skip: (safePage - 1) * pageSize,
        take: pageSize,
        hasPrev: safePage > 1,
        hasNext: safePage < totalPages
    };

}
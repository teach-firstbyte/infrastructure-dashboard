import { TableCell, TableRow } from "./table"

interface TableEmptyStateProps {
    colSpan: number
    message: string
}

export function TableEmptyState({ colSpan, message }: TableEmptyStateProps) {
    return (
        <TableRow>
            <TableCell colSpan={colSpan} className="text-center text-muted-foreground py-8">
                {message}
            </TableCell>
        </TableRow>
    )
}
'use client'

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"

const TWO_HOURS_MS = 2 * 60 * 60 * 1000

export function MeetingStatusBadge({ scheduledAt }: { scheduledAt: string | Date }) {
    const [now, setNow] = useState(() => Date.now());
    useEffect(() => {
      const id = setInterval(() => setNow(Date.now()), 60_000);
      return () => clearInterval(id);
    }, [])

    const start = new Date(scheduledAt).getTime();
    if (now >= start + TWO_HOURS_MS) return <Badge variant="secondary">Completed</Badge>
    if (now >= start)
        return (
            <Badge variant="default">
                <span className="inline-block size-2 rounded-full bg-green-500 animate-pulse" />
                In Progress
            </Badge>
        );
    return <Badge variant="outline">Scheduled</Badge>;
}
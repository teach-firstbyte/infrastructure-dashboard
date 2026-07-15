'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Attendance } from "@/types/dashboard";
import { useEffect, useState } from "react";

const STATUSES = ["REGISTERED", "PRESENT", "ABSENT"] as const;

interface AttendanceToggleProps {
    meetingId: number;
    meetingTitle: string;
}

export function AttendanceToggle({ meetingId, meetingTitle }: AttendanceToggleProps) {
    const [records, setRecords] = useState<Attendance[]>([])
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [savingId, setSavingId] = useState<number | null>(null);

    useEffect(() => {
        async function load() {
            setIsLoading(true);
            setError(null);
            try {
                const res = await fetch(`/api/attendance?meetingId=${meetingId}`);
                if (!res.ok) throw new Error(`Request failed: ${res.status}`);
                setRecords(await res.json());
            } catch {
                setError("Could not load attendance.");
            } finally {
                setIsLoading(false);
            }
        }
        load();
    }, [meetingId])

    async function updateStatus(recordId: number, status: string) {
        setSavingId(recordId);
        setError(null);
        try {
            const res = await fetch(`/api/attendance/${recordId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });
            if (!res.ok) throw new Error("Save failed");
            const updated = await res.json();
            // Apply change locally only after the server confirms it
            setRecords((prev) => 
                prev.map((r) => (r.id === recordId ? { ...r, status: updated.status } : r))
            );
        } catch {
            setError("Could not save that change");
        } finally {
            setSavingId(null);
        }
    }

    if (isLoading) return <p className="text-sm text-muted-foreground">Loading attendance...</p>
    if (error && records.length === 0) return <p className="text-sm text-destructive">{error}</p>

    return (
        <Card>
            <CardHeader>
                <CardTitle>Take attendance</CardTitle>
                <CardDescription>{meetingTitle}</CardDescription>
            </CardHeader>
            <CardContent>
                {records.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No attendees yet for this meeting.</p>
                ) : (
                    records.map((record) => (
                        <div key={record.id} className="flex items-center justify-between border-b py-2">
                            <div>
                                <div className="font-medium">{record.user.name || "N/A"}</div>
                                <div className="text-sm text-muted-foreground">{record.user.email}</div>
                            </div>
                            <div className="flex gap-1">
                                {STATUSES.map((s) => (
                                    <Button
                                        key={s}
                                        size="sm"
                                        variant={record.status === s ? "default" : "outline"}
                                        disabled={savingId === record.id}
                                        onClick={() => updateStatus(record.id, s)}
                                    >
                                        {s.charAt(0) + s.slice(1).toLowerCase()}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    ))
                )}
                {error && records.length > 0 && (
                    <p className="text-sm text-destructive">{error}</p>
                )}
            </CardContent>
        </Card>
    )
}
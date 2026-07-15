'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface CheckInFormProps {
  meetingId: number;
  meetingTitle: string;
  initialCode: string;
}

type Status = "idle" | "submitting" | "success" | "error";

export function CheckInForm({ meetingId, meetingTitle, initialCode }: CheckInFormProps) {
  const [code, setCode] = useState(initialCode);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleCheckIn() {
    setStatus("submitting");
    setMessage("");
    try {
      const res = await fetch("/api/attendance/check-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ meetingId, code }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Check-in failed");
      }
      setStatus("success");
      setMessage("You're checked in!");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Check in</CardTitle>
        <CardDescription>{meetingTitle}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {status === "success" ? (
          <p className="text-center font-medium text-green-700">{message}</p>
        ) : (
          <>
            <div className="space-y-2">
              <label htmlFor="code" className="text-sm font-medium">Check-in code</label>
              <Input
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter code"
              />
            </div>
            <Button
              onClick={handleCheckIn}
              disabled={status === "submitting" || code.trim() === ""}
              className="w-full"
            >
              {status === "submitting" ? "Checking in…" : "Confirm check-in"}
            </Button>
            {status === "error" && (
              <p className="text-center text-sm text-destructive">{message}</p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
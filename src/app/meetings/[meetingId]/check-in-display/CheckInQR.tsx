'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";

interface CheckInQRProps {
    meetingTitle: string;
    code: string;
    path: string;
}

export function CheckInQR({ meetingTitle, code, path } : CheckInQRProps) {
    const [url, setUrl] = useState<string | null>(null);

    useEffect(() => {
        //window only exists in the browser - build hte absolute URL after mount
        setUrl(`${window.location.origin}${path}`);
    }, [path]);

    return (
        <Card>
            <CardHeader className="text-cetner">
                <CardTitle>Check in</CardTitle>
                <CardDescription>{meetingTitle}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-6">
                {url ? (
                    <QRCodeSVG value={url} size={240} />
                ) : (
                    <div className="h-[240px] w-[240px] animate-pulse rounded-md bg-muted" />
                )};
                <div className="text-center">
                    <p className="text-sm text-muted-foreground">Or enter this code:</p>
                    <p className="text-3xl font-bold tracking-widest">{code}</p>
                </div>
            </CardContent>
        </Card>
    )
}
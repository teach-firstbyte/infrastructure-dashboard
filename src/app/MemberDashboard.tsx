import { Meeting, User } from "@prisma/client";
import { logOut } from "./login/actions";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Card, CardButton, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MeetingStatusBadge } from "@/components/MeetingStatusBadge";
import { SubmitButton } from "@/components/SubmitButton";

export async function MemberDashboard({ user }: { user: User }) {
    // Gets the users own memberships to display.
    const memberships = await prisma.teamMember.findMany({
        where: { userId: user.id },
        include: { team: true },
    })
    const teamIds = memberships.map((m) => m.teamId);

    const TWO_HOURS_MS = 2 * 60 * 60 * 1000;
    // Gets the users own upcoming meeting of the teams they are apart of.
    const meetings = await prisma.meeting.findMany({
        where: {
            scheduledAt: { gt: new Date(Date.now() - TWO_HOURS_MS) },
            OR: [
                { teamId: { in: teamIds } },
                { teamId: null },
            ],
        },
        include: { team: true },
        orderBy: { scheduledAt: "asc" },
    });

    return (
        <div className="container mx-auto p-6 space-y-6">
            <Image src="/FirstByteBitex4.png" alt="FirstByte" width={200} height={200} className="mx-auto mb-4" />
            {/* Landing */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">
                        Welcome, {user.name ?? "member"}
                    </CardTitle>
                    <CardDescription>Your FirstByte Hub</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Scan the QR code shown at your meeting to check-in - or open an upcoming meeting below and enter the code on the screen.
                    </p>
                </CardContent>
            </Card>

            {/* Teams */}
            <Card>
                <CardHeader>
                    <CardTitle>Your teams</CardTitle>
                </CardHeader>
                <CardContent>
                    {memberships.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                            You aren't on any teams yet.
                        </p>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {memberships.map((m) => (
                                <Badge key={m.id} variant="secondary">
                                    {m.team.name}
                                </Badge>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Upcoming meetings */}
            <Card>
                <CardHeader>
                    <CardTitle>Upcoming meetings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {meetings.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                            No upcoming meetings.
                        </p>
                    ) : (
                        meetings.map((meeting) => (
                            <div
                                key={meeting.id}
                                className="flex flex-col  gap-2 rounded-md border px-3 py-2 sm:flex-row sm:items-center sm:justify-between sm:gap3"
                            >
                                <div className="min-w-0">
                                    <p className="text-sm font-medium">
                                        {meeting.title}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {meeting.scheduledAt.toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="flex shrink-0 items-center gap-2">
                                    <MeetingStatusBadge scheduledAt={meeting.scheduledAt}/>
                                    <Badge variant={meeting.team ? "outline" : "secondary"}>
                                        {meeting.team ? meeting.team.name : "General"}
                                    </Badge>
                                    <Button asChild size="sm">
                                        <Link href={`/check-in/${meeting.id}`}>Check in</Link>
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>

            {/* Logout */}
            <CardFooter className="px-0">
                <div className="flex items-center gap-2">
                    <Button asChild variant="outline" className="text-sm px-3 py-1.5 rounded-md">
                        <Link href="/settings">Settings</Link>
                    </Button>
                    <form>
                        <SubmitButton 
                        formAction={logOut} 
                        className="text-sm px-3 py-1.5 rounded-md bg-[rgb(76,111,78)] text-white hover:opacity-90 transition"
                        pendingLabel="Logging Out..."
                        >
                            Log out
                        </SubmitButton>
                    </form>
                </div>
            </CardFooter>
            
        </div>
    )
}
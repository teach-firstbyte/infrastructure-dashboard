import Image from "next/image";
import { UsersTable } from "@/components/UsersTable";
import { TeamsTable } from "@/components/TeamsTable";
import { MeetingsTable } from "@/components/MeetingsTable";
import { FeedbackTable } from "@/components/FeedbackTable";
import { prisma } from "@/lib/prisma";
import type { Feedback, Meeting, Team, User } from "@/types/dashboard";
import { logOut } from "./login/actions"
import { SubmitButton } from "@/components/SubmitButton";
import { AttendanceStatus } from "@prisma/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export async function OfficerDashboard() {
    const emptyData = {
        users: [] as User[],
        teams: [] as Team[],
        meetings: [] as Meeting[],
        attendance: {
            rate: null as number | null,
            present: 0,
            absent: 0,
        },
        feedback: [] as Feedback[],
      };
    
      let data = emptyData;
      let dbUnavailable = false;
    
      try {
        // Fetch all data from Prisma. If this fails, render the dashboard with empty state data.
        const [users, teams, meetings, attendanceGrouped, feedback] = await Promise.all([
          prisma.user.findMany({
            include: {
              teamMemberships: {
                include: {
                  team: true,
                },
              },
            },
          }),
          prisma.team.findMany({
            include: {
              members: {
                include: {
                  user: true,
                },
              },
            },
          }),
          prisma.meeting.findMany({
            include: {
              attendance: {
                include: {
                  user: true,
                },
              },
              feedback: true,
            },
          }),
          prisma.attendance.groupBy({
            by: ['status'],
            _count: { _all: true }
          }),
          prisma.feedback.findMany({
            include: {
              meeting: true,
              author: true,
            },
          }),
        ]);

        const counts: Record<AttendanceStatus, number> = {
            REGISTERED: 0,
            PRESENT: 0,
            ABSENT: 0
          };

        for (const row of attendanceGrouped) {
            counts[row.status] = row._count._all;
        }
        const decided = counts.PRESENT + counts.ABSENT;
        const rate = decided > 0 ? counts.PRESENT / decided : null;

        data = { 
            users, 
            teams, 
            meetings, 
            attendance: {
                rate: rate,
                present: counts.PRESENT,
                absent: counts.ABSENT
            },
            feedback };
      } catch (error) {
        dbUnavailable = true;
        console.error("Database unavailable, rendering empty dashboard state:", error);
      }
    
      return (
        <div className="container mx-auto p-6 space-y-8">
          <div className="text-center mb-8">
            <Image src="/FirstByteBitex4.png" alt="FirstByte" width={200} height={200} className="mx-auto mb-4" />
            <h1 className="text-3xl font-bold">FirstByte Dashboard</h1>
            <p className="text-muted-foreground">Participation and engagement tracking</p>
          </div>
          <form>
            <SubmitButton 
                formAction={logOut} 
                className="text-sm px-3 py-1.5 rounded-md bg-[rgb(76,111,78)] text-white hover:opacity-90 transition"
                pendingLabel="Logging Out..."
                >
                Log out
            </SubmitButton>
          </form>
          {dbUnavailable && (
            <div className="rounded-md border border-yellow-300 bg-yellow-50 px-4 py-3 text-sm text-yellow-900">
              Could not load database data right now. Showing an empty dashboard until the connection is restored.
            </div>
          )}
    
          <div className="grid gap-6 [*&>*]:min-w-0">
            <UsersTable users={data.users} />
            <TeamsTable teams={data.teams} />
            <MeetingsTable meetings={data.meetings} />
            <Card>
                <CardHeader>
                    <CardTitle>Attendance Rate</CardTitle>
                    <CardDescription>Present out of all decided (present + absent)</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold">
                        {data.attendance.rate !== null
                            ? `${Math.round(data.attendance.rate * 100)}%`
                            : "-" }
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                        {data.attendance.rate !== null
                            ? `${data.attendance.present} Present · ${data.attendance.absent} Absent`
                            : "-" }
                    </p>
                    <Link href="/attendance" className="text-sm text-primary hover:underline mt-3 inline-block">
                        View all records 
                    </Link>
                </CardContent>
            </Card>
            <FeedbackTable feedback={data.feedback} />
          </div>
        </div>
      );

}
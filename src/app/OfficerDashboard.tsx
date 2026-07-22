import Image from "next/image";
import { UsersTable } from "@/components/UsersTable";
import { TeamsTable } from "@/components/TeamsTable";
import { MeetingsTable } from "@/components/MeetingsTable";
import { AttendanceTable } from "@/components/AttendanceTable";
import { FeedbackTable } from "@/components/FeedbackTable";
import { prisma } from "@/lib/prisma";
import type { Attendance, Feedback, Meeting, Team, User } from "@/types/dashboard";
import { logOut } from "./login/actions"
import { SubmitButton } from "@/components/SubmitButton";

export async function OfficerDashboard() {
    const emptyData = {
        users: [] as User[],
        teams: [] as Team[],
        meetings: [] as Meeting[],
        attendance: [] as Attendance[],
        feedback: [] as Feedback[],
      };
    
      let data = emptyData;
      let dbUnavailable = false;
    
      try {
        // Fetch all data from Prisma. If this fails, render the dashboard with empty state data.
        const [users, teams, meetings, attendance, feedback] = await Promise.all([
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
          prisma.attendance.findMany({
            include: {
              user: true,
              meeting: true,
            },
          }),
          prisma.feedback.findMany({
            include: {
              meeting: true,
              author: true,
            },
          }),
        ]);
    
        data = { users, teams, meetings, attendance, feedback };
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
            <AttendanceTable attendance={data.attendance} />
            <FeedbackTable feedback={data.feedback} />
          </div>
        </div>
      );

}
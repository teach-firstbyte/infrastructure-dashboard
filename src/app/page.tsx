'use client'

import Image from "next/image";
import { UsersTable } from "@/components/UsersTable";
import { TeamsTable } from "@/components/TeamsTable";
import { MeetingsTable } from "@/components/MeetingsTable";
import { AttendanceTable } from "@/components/AttendanceTable";
import { FeedbackTable } from "@/components/FeedbackTable";
import { useData } from "@/hooks/useData";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const { data: users, loading: usersLoading, error: usersError } = useData('users');
  const { data: teams, loading: teamsLoading, error: teamsError } = useData('teams');
  const { data: meetings, loading: meetingsLoading, error: meetingsError } = useData('meetings');
  const { data: attendance, loading: attendanceLoading, error: attendanceError } = useData('attendance');
  const { data: feedback, loading: feedbackLoading, error: feedbackError } = useData('feedback');

  if (usersLoading || teamsLoading || meetingsLoading || attendanceLoading || feedbackLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Image src="/FirstByteBitex4.png" alt="FirstByte" width={200} height={200} className="mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">FirstByte Dashboard</h1>
            <p className="text-muted-foreground">Loading data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center mb-8">
        <Image src="/FirstByteBitex4.png" alt="FirstByte" width={200} height={200} className="mx-auto mb-4" />
        <h1 className="text-3xl font-bold">FirstByte Dashboard</h1>
        <p className="text-muted-foreground">Participation and engagement tracking</p>
      </div>

      <div className="grid gap-6">
        {usersError ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-destructive">Error Loading Users</CardTitle>
              <CardDescription>{usersError}</CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <UsersTable users={users} />
        )}

        {teamsError ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-destructive">Error Loading Teams</CardTitle>
              <CardDescription>{teamsError}</CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <TeamsTable teams={teams} />
        )}

        {meetingsError ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-destructive">Error Loading Meetings</CardTitle>
              <CardDescription>{meetingsError}</CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <MeetingsTable meetings={meetings} />
        )}

        {attendanceError ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-destructive">Error Loading Attendance</CardTitle>
              <CardDescription>{attendanceError}</CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <AttendanceTable attendance={attendance} />
        )}

        {feedbackError ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-destructive">Error Loading Feedback</CardTitle>
              <CardDescription>{feedbackError}</CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <FeedbackTable feedback={feedback} />
        )}
      </div>
    </div>
  );
}

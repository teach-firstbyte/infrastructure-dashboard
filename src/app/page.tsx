import Image from "next/image";
import { UsersTable } from "@/components/UsersTable";
import { TeamsTable } from "@/components/TeamsTable";
import { MeetingsTable } from "@/components/MeetingsTable";
import { AttendanceTable } from "@/components/AttendanceTable";
import { FeedbackTable } from "@/components/FeedbackTable";
import { prisma } from "@/lib/prisma";
import { User } from "@/components/UsersTable";
import { Team } from "@/components/TeamsTable";
import { Meeting } from "@/components/MeetingsTable";
import { Attendance } from "@/components/AttendanceTable";
import { Feedback } from "@/components/FeedbackTable";

/**
 * Fetches data from the API
 * @param endpoint - The endpoint to fetch data from
 * @returns the data requested from the API
 */
async function fetchData<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/${endpoint}`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }

  return response.json();
}

export default async function Home() {
  
  // Fetch all data from Prisma
  const [ users, teams, meetings, attendance, feedback ] = await Promise.all([
    fetchData<User[]>('users'),
    fetchData<Team[]>('teams'),
    fetchData<Meeting[]>('meetings'),
    fetchData<Attendance[]>('attendance'),
    fetchData<Feedback[]>('feedback'),
  ]);

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center mb-8">
        <Image src="/FirstByteBitex4.png" alt="FirstByte" width={200} height={200} className="mx-auto mb-4" />
        <h1 className="text-3xl font-bold">FirstByte Dashboard</h1>
        <p className="text-muted-foreground">Participation and engagement tracking</p>
      </div>

      <div className="grid gap-6">
        <UsersTable users={users} />
        <TeamsTable teams={teams} />
        <MeetingsTable meetings={meetings} />
        <AttendanceTable attendance={attendance} />
        <FeedbackTable feedback={feedback} />
      </div>
    </div>
  );
}

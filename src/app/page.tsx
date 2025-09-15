import Image from "next/image";
import { UsersTable } from "@/components/UsersTable";
import { TeamsTable } from "@/components/TeamsTable";
import { MeetingsTable } from "@/components/MeetingsTable";
import { AttendanceTable } from "@/components/AttendanceTable";
import { FeedbackTable } from "@/components/FeedbackTable";
import { PrismaClient } from '../generated/prisma'

export default async function Home() {
  const prisma = new PrismaClient()
  
  // Fetch all data from Prisma
  const users = await prisma.user.findMany({
    include: {
      teamMemberships: {
        include: {
          team: true
        }
      }
    }
  })
  const teams = await prisma.team.findMany({
    include: {
      members: {
        include: {
          user: true
        }
      }
    }
  })
  const meetings = await prisma.meeting.findMany({
    include: {
      attendance: {
        include: {
          user: true
        }
      },
      feedback: true
    }
  })
  const attendance = await prisma.attendance.findMany({
    include: {
      user: true,
      meeting: true
    }
  })
  const feedback = await prisma.feedback.findMany({
    include: {
      meeting: true,
      author: true
    }
  })

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

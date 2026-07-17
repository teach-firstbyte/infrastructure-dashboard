import Image from "next/image";
import { UsersTable } from "@/components/UsersTable";
import { TeamsTable } from "@/components/TeamsTable";
import { MeetingsTable } from "@/components/MeetingsTable";
import { AttendanceTable } from "@/components/AttendanceTable";
import { FeedbackTable } from "@/components/FeedbackTable";
import { prisma } from "@/lib/prisma";
import type { Attendance, Feedback, Meeting, Team, User } from "@/types/dashboard";
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { logOut } from "./login/actions"
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { OfficerDashboard } from "./OfficerDashboard";
import { isOfficer } from "@/lib/auth/roles";
import { MemberDashboard } from "./MemberDashboard";

export default async function Home() {
  const user = await getCurrentUser();
  if(!user) redirect('/login');

  return isOfficer(user) ? <OfficerDashboard /> : <MemberDashboard user={user} />;
}

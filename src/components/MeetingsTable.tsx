'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Meeting {
  id: number
  title: string
  description: string | null
  type: string
  teamId: number | null
  scheduledAt: Date
  startedAt: Date | null
  endedAt: Date | null
  location: string | null
  isRequired: boolean
  maxCapacity: number | null
  createdAt: Date
  team?: {
    name: string
  }
  attendance: Array<{
    user: {
      name: string | null
      email: string
    }
    status: string
  }>
}

interface MeetingsTableProps {
  meetings: Meeting[]
}

export function MeetingsTable({ meetings }: MeetingsTableProps) {
  const getStatusBadge = (meeting: Meeting) => {
    if (meeting.endedAt) return <Badge variant="secondary">Completed</Badge>
    if (meeting.startedAt) return <Badge variant="default">In Progress</Badge>
    return <Badge variant="outline">Scheduled</Badge>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Meetings</CardTitle>
        <CardDescription>All meetings and events</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Team</TableHead>
              <TableHead>Scheduled</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Attendance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {meetings.map((meeting) => (
              <TableRow key={meeting.id}>
                <TableCell className="font-medium">{meeting.id}</TableCell>
                <TableCell>{meeting.title}</TableCell>
                <TableCell>
                  <Badge variant="outline">{meeting.type.replace(/_/g, ' ')}</Badge>
                </TableCell>
                <TableCell>{meeting.team?.name || 'N/A'}</TableCell>
                <TableCell>{new Date(meeting.scheduledAt).toLocaleString()}</TableCell>
                <TableCell>{getStatusBadge(meeting)}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    {meeting.attendance.filter(a => a.status === 'PRESENT').length} / {meeting.attendance.length}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

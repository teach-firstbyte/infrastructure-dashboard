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

interface Team {
  id: number
  name: string
  description: string | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  members: Array<{
    user: {
      name: string | null
      email: string
    }
    role: string
  }>
}

interface TeamsTableProps {
  teams: Team[]
}

export function TeamsTable({ teams }: TeamsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Teams</CardTitle>
        <CardDescription>All teams and their members</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Members</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teams.map((team) => (
              <TableRow key={team.id}>
                <TableCell className="font-medium">{team.id}</TableCell>
                <TableCell>{team.name}</TableCell>
                <TableCell>{team.description || 'N/A'}</TableCell>
                <TableCell>
                  <Badge variant={team.isActive ? "default" : "secondary"}>
                    {team.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {team.members.map((member, index) => (
                      <Badge key={index} variant="outline">
                        {member.user.name || member.user.email} ({member.role})
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>{new Date(team.createdAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

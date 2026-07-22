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
import { Team } from "@/types/dashboard";
import { TableEmptyState } from "./ui/TableEmptyState";

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
              <TableHead className="hidden md:table-cell">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Members</TableHead>
              <TableHead className="hidden md:table-cell">Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teams.length === 0 ? (
              <TableEmptyState colSpan={6} message="No teams established yet." />
            ) : (
            teams.map((team) => (
              <TableRow key={team.id}>
                <TableCell className="font-medium hidden md:table-cell">{team.id}</TableCell>
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
                <TableCell className="hidden md:table-cell">{new Date(team.createdAt).toLocaleDateString()}</TableCell>
              </TableRow>
            )))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

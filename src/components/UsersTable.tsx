'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardButton,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import React, { useEffect, useState } from "react"
import {
  Modal,
  ModalHeader,
  ModalForm,
  ModalButton,
  ModalDropdown,
  ModalCheckboxes,
} from "@/components/ui/modal"
import { User } from "@/types/dashboard";
import { useRouter } from "next/navigation"
import { TableEmptyState } from "./ui/TableEmptyState"

interface UsersTableProps {
  users: User[]
}

export function UsersTable({ users }: UsersTableProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState<Pick<User, "name" | "email">>({
    name: "",
    email: "",
  });
  const [showAssignModal, setShowAssignModal] = useState(false);
  const router = useRouter();

  const [teams, setTeams] = useState<{ id: number; name: string }[]>([]);
  const [teamsLoading, setTeamsLoading] = useState(false);

  useEffect(() => {
    if(!showAssignModal) return;

    setTeamsLoading(true);
    fetch("/api/teams")
      .then((res) => res.json())
      .then((data) => setTeams(data))
      .catch(() => setTeams([]))
      .finally(() => setTeamsLoading(false));
  }, [showAssignModal]);

  // for the assign modal
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedTeams, setSelectedTeams] = useState<number[]>([]);

  const [originalTeamIds, setOriginalTeamIds] = useState<number[]>([]);
  const [membershipIdByTeam, setMembershipIdByTeam] = useState<Record<number, number>>({});

  // for the checkboxes
  const toggleTeam = (teamId: string | number) => {
    const id = typeof teamId === "string" ? Number(teamId) : teamId;
    setSelectedTeams((prev) =>
      prev.includes(id)
        ? prev.filter((tid) => tid !== id)
        : [...prev, id]
    );
  }

  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) return;

    const added = selectedTeams.filter((id) => !originalTeamIds.includes(id));
    const removed = originalTeamIds.filter((id) => !selectedTeams.includes(id));

    const addCalls = added.map((teamId) =>
      fetch("/api/team-members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: selectedUserId, teamId, role: "MEMBER" }),
      })
    )

    const removeCalls = removed.map((teamId) =>
      fetch(`/api/team-members/${membershipIdByTeam[teamId]}`, { method: "DELETE" })
    )

    await Promise.allSettled([...addCalls, ...removeCalls]);

    router.refresh();

    // close modal
    setShowAssignModal(false);
  };


  const handleUserSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const userId = Number(e.target.value);
    setSelectedUserId(userId);

    const user = users.find((u) => u.id === userId);
    const memberships = user?.teamMemberships ?? [];

    const teamIds = memberships.map((m) => m.team.id);
    const idMap = Object.fromEntries(memberships.map((m) => [m.team.id, m.id]));

    setSelectedTeams(teamIds);
    setOriginalTeamIds(teamIds);
    setMembershipIdByTeam(idMap);

  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("New user (not connected to backend):", newUser);

    // close after submission
    setShowAddModal(false);
    // reset form
    setNewUser({ name: "", email: "" });
  };

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 md:grid md:gap-1.5 space-y-2">
        <div className="space-y-2">
          <CardTitle>Users</CardTitle>
          <CardDescription>All registered users in the system</CardDescription>
        </div>
        <div data-slot="card-action" className="flex gap-2">
          <CardButton onClick={() => setShowAssignModal(true)}>Assign Teams</CardButton>
          <CardButton onClick={() => setShowAddModal(true)}>+ Add User</CardButton>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Teams</TableHead>
              <TableHead className="hidden md:table-cell">Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableEmptyState colSpan={4} message="No users yet."/>
            ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name || 'N/A'}</TableCell>
                <TableCell>
                  <a
                    href={`mailto:${user.email}`}
                    className="text-blue-600 hover:underline"
                  >
                    {user.email}
                  </a>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {user.teamMemberships.map((membership, index) => (
                      <Badge key={index} variant="secondary">
                        {membership.team.name} ({membership.role})
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{new Date(user.createdAt).toLocaleDateString()}</TableCell>
              </TableRow>
            )))}
          </TableBody>
        </Table>
        {showAddModal && (
          <Modal onClose={() => setShowAddModal(false)}>
            <ModalHeader>Add New User</ModalHeader>
            <ModalForm
              newUser={newUser}
              onChange={handleChange}
              onSubmit={handleSubmit}
            >
              <ModalButton variant="cancel" onClick={() => setShowAddModal(false)}>
                Cancel
              </ModalButton>
              <ModalButton variant="primary" type="submit">
                Save
              </ModalButton>
            </ModalForm>
          </Modal>
        )}
        {showAssignModal && (
          <Modal onClose={() => setShowAssignModal(false)}>
            <ModalHeader>Assign User to Teams</ModalHeader>
            <form onSubmit={handleAssignSubmit} className="space-y-4 p-4">
              <ModalDropdown
                label="Select User"
                value={selectedUserId ?? ""}
                onChange={handleUserSelect}
                required
                options={users.map((u) => ({ value: u.id, label: u.name || `User ${u.id}` }))}
              />
              <ModalCheckboxes
                label={teamsLoading ? "Loading teams…" : "Assign to Teams"}
                options={teams.map((t) => ({ value: t.id, label: t.name }))}
                selected={selectedTeams}
                onToggle={toggleTeam}
                disabled={!selectedUserId || teamsLoading}
              />
              <div className="flex justify-end gap-2 mt-4">
                <ModalButton variant="cancel" onClick={() => setShowAssignModal(false)}>
                  Cancel
                </ModalButton>
                <ModalButton variant="primary" type="submit">
                  Save
                </ModalButton>
              </div>

            </form>
          </Modal>
        )}
      </CardContent>
    </Card>
  )
}

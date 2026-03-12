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
import React, { useState } from "react"
import {
  Modal,
  ModalHeader,
  ModalForm,
  ModalButton,
  ModalDropdown,
  ModalCheckboxes,
} from "@/components/ui/modal"

interface User {
  id: number
  email: string
  name: string | null
  createdAt: Date
  updatedAt: Date
  teamMemberships: Array<{
    team: {
      name: string
    }
    role: string
  }>
}

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

  // hardcoded foor now
  const teams = [
    { id: 1, name: "Brand and Marketing (LEAD)" },
    { id: 2, name: "Software Events (LEAD)" },
    { id: 3, name: "CS Curricula (LEAD)" },
    { id: 4, name: "STEM Curricula (LEAD)" },
    { id: 5, name: "Software Website (LEAD)" }
  ];

  // local db based on pre-existing team assignments
  const [userTeams, setUserTeams] = useState<Record<number, number[]>>({
    3: [1], // example: user with id 3 already in team with id 1
    4: [2],
    5: [2],
    6: [5],
    7: [3],
    8: [3],
    9: [4],
    10: [4],
    11: [5],
  });

  // for the assign modal
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedTeams, setSelectedTeams] = useState<number[]>([]);

  // for the checkboxes
  const toggleTeam = (teamId: string | number) => {
    const id = typeof teamId === "string" ? Number(teamId) : teamId;
    setSelectedTeams((prev) =>
      prev.includes(id)
        ? prev.filter((tid) => tid !== id)
        : [...prev, id]
    );
  }

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedUserId) return;

    // Update DB
    setUserTeams((prev) => ({
      ...prev,
      [selectedUserId]: selectedTeams,
    }));

    console.log("Updated team assignments:", {
      userId: selectedUserId,
      teams: selectedTeams,
    });

    // close modal
    setShowAssignModal(false);
  };


  const handleUserSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const userId = Number(e.target.value);
    setSelectedUserId(userId);

    // existing team assignments
    const teamsForUser = userTeams[userId] ?? [];
    setSelectedTeams(teamsForUser);
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
      <CardHeader>
        <div>
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
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Teams</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.id}</TableCell>
                <TableCell>{user.name || 'N/A'}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {user.teamMemberships.map((membership, index) => (
                      <Badge key={index} variant="secondary">
                        {membership.team.name} ({membership.role})
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
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
                label="Assign to Teams"
                options={teams.map((t) => ({ value: t.id, label: t.name }))}
                selected={selectedTeams}
                onToggle={toggleTeam}
                disabled={!selectedUserId}
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

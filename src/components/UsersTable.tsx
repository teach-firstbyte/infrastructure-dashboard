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
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState<Pick<User, "name" | "email">>({
    name: "",
    email: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("New user (not connected to backend):", newUser);

    // close after submission
    setShowModal(false);
    // reset form
    setNewUser({ name: "", email: "" });
  };

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div>
          <CardTitle>Users</CardTitle>
          <CardDescription>All registered users in the system</CardDescription>
        </div>
        <CardButton onClick={() => setShowModal(true)}>+ Add User</CardButton>
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
        {showModal && (
          <Modal onClose={() => setShowModal(false)}>
            <ModalHeader>Add New User</ModalHeader>
            <ModalForm
              newUser={newUser}
              onChange={handleChange}
              onSubmit={handleSubmit}
            >
              <ModalButton variant="cancel" onClick={() => setShowModal(false)}>
                Cancel
              </ModalButton>
              <ModalButton variant="primary" type="submit">
                Save
              </ModalButton>
            </ModalForm>
          </Modal>
        )}
      </CardContent>
    </Card>
  )
}

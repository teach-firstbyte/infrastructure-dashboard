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
import { useRouter } from "next/navigation"
import Link from "next/link"
import React, { useEffect, useState } from "react"
import {
  Modal,
  ModalHeader,
  ModalButton,
  ModalDropdown,
} from "@/components/ui/modal"
import { Meeting } from "@/types/dashboard";
import { TableEmptyState } from "./ui/TableEmptyState"

interface MeetingsTableProps {
  meetings: Meeting[]
}

// Mirrors the MeetingType enum in prisma/schema.prisma. The POST /api/meetings
// route validates against this same set, so keep them in sync.
const MEETING_TYPES = [
  "GENERAL_MEETING",
  "BOARD_MEETING",
  "SOCIAL_EVENT",
  "FIRSTBITES",
  "CHV_WORKSHOP",
  "WORKSHOP",
] as const;

interface NewMeeting {
  title: string;
  type: string;
  teamId: string;
  scheduledAt: string;
  description: string;
  location: string;
  isRequired: boolean;
  maxCapacity: string;
}

const emptyMeeting: NewMeeting = {
  title: "",
  type: "",
  teamId: "none",
  scheduledAt: "",
  description: "",
  location: "",
  isRequired: false,
  maxCapacity: "",
};

export function MeetingsTable({ meetings }: MeetingsTableProps) {
  const router = useRouter();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMeeting, setNewMeeting] = useState<NewMeeting>(emptyMeeting);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [teams, setTeams] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    if (!showAddModal) return;
    if (teams.length > 0) return;
    async function loadTeams() {
      try {
        const res = await fetch(`/api/teams`);
        if (!res.ok) return;
        const data = await res.json();
        setTeams(data.map((t: { id: number; name: string }) => ({ id: t.id, name: t.name })));
      } catch {

      }  
    }
    loadTeams();
  }, [showAddModal, teams.length]);

  const getStatusBadge = (meeting: Meeting) => {
    if (meeting.endedAt) return <Badge variant="secondary">Completed</Badge>
    if (meeting.startedAt) return <Badge variant="default">In Progress</Badge>
    return <Badge variant="outline">Scheduled</Badge>
  }

  const closeModal = () => {
    setShowAddModal(false);
    setNewMeeting(emptyMeeting);
    setError(null);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setNewMeeting((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewMeeting((prev) => ({ ...prev, type: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/meetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newMeeting.title,
          type: newMeeting.type,
          teamId: newMeeting.teamId === "none"? null : Number(newMeeting.teamId),
          scheduledAt: new Date(newMeeting.scheduledAt).toISOString(),
          description: newMeeting.description || null,
          location: newMeeting.location || null,
          isRequired: newMeeting.isRequired,
          maxCapacity: newMeeting.maxCapacity ? Number(newMeeting.maxCapacity) : null,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Failed to create meeting");
        return;
      }

      // Re-fetch the server component data so the new meeting renders.
      closeModal();
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Meetings</CardTitle>
          <CardDescription>All meetings and events</CardDescription>
        </div>
        <div data-slot="card-action" className="flex gap-2">
          <CardButton onClick={() => setShowAddModal(true)}>+ Add Meeting</CardButton>
        </div>
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
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {meetings.length === 0 ? (
              <TableEmptyState colSpan={8} message="No meetings scheduled yet." />
            ) : (
            meetings.map((meeting) => (
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
                <TableCell>
                  <div className="flex gap-3">
                    <Link href={`/meetings/${meeting.id}/attendance`} className="text-sm text-primary underline">
                      Attendance
                    </Link>
                    <Link href={`/meetings/${meeting.id}/check-in-display`} className="text-sm text-primary underline">
                      QR Code
                    </Link>

                  </div>
                </TableCell>
              </TableRow>
            )))}
          </TableBody>
        </Table>
        {showAddModal && (
          <Modal onClose={closeModal}>
            <ModalHeader>Add New Meeting</ModalHeader>
            <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
              <input
                type="text"
                name="title"
                value={newMeeting.title}
                onChange={handleChange}
                placeholder="Title"
                className="border rounded p-2"
                required
              />
              <ModalDropdown
                label="Type"
                value={newMeeting.type}
                onChange={handleTypeChange}
                required
                options={MEETING_TYPES.map((t) => ({
                  value: t,
                  label: t.replace(/_/g, " "),
                }))}
              />
              <ModalDropdown 
                label="Team (optional)"
                value={newMeeting.teamId}
                onChange={(e) => setNewMeeting((prev) => ({ ...prev, teamId: e.target.value }))}
                options={[
                  { value: "none", label: "General - all members" },
                  ...teams.map((t) => ({ value: String(t.id), label: t.name })),
                ]}
              />
              <label className="block text-sm font-medium">Scheduled at</label>
              <input
                type="datetime-local"
                name="scheduledAt"
                value={newMeeting.scheduledAt}
                onChange={handleChange}
                className="border rounded p-2"
                required
              />
              <textarea
                name="description"
                value={newMeeting.description}
                onChange={handleChange}
                placeholder="Description (optional)"
                className="border rounded p-2"
              />
              <input
                type="text"
                name="location"
                value={newMeeting.location}
                onChange={handleChange}
                placeholder="Location (optional)"
                className="border rounded p-2"
              />
              <input
                type="number"
                name="maxCapacity"
                value={newMeeting.maxCapacity}
                onChange={handleChange}
                placeholder="Max capacity (optional)"
                className="border rounded p-2"
                min={0}
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isRequired"
                  checked={newMeeting.isRequired}
                  onChange={handleChange}
                />
                Required
              </label>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="flex justify-end space-x-2 pt-2">
                <ModalButton variant="cancel" type="button" onClick={closeModal}>
                  Cancel
                </ModalButton>
                <ModalButton variant="primary" type="submit" disabled={submitting}>
                  {submitting ? "Saving..." : "Save"}
                </ModalButton>
              </div>
            </form>
          </Modal>
        )}
      </CardContent>
    </Card>
  )
}

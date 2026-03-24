export interface User {
  id: number;
  email: string;
  name: string | null;
  createdAt: Date;
  updatedAt: Date;
  teamMemberships: Array<{
    team: {
      name: string;
    };
    role: string;
  }>;
}

export interface Team {
  id: number;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  members: Array<{
    user: {
      name: string | null;
      email: string;
    };
    role: string;
  }>;
}

export interface Meeting {
  id: number;
  title: string;
  description: string | null;
  type: string;
  teamId: number | null;
  scheduledAt: Date;
  startedAt: Date | null;
  endedAt: Date | null;
  location: string | null;
  isRequired: boolean;
  maxCapacity: number | null;
  createdAt: Date;
  team?: {
    name: string;
  };
  attendance: Array<{
    user: {
      name: string | null;
      email: string;
    };
    status: string;
  }>;
}

export interface Attendance {
  id: number;
  userId: number;
  meetingId: number;
  status: string;
  checkedInAt: Date | null;
  checkedOutAt: Date | null;
  notes: string | null;
  createdAt: Date;
  user: {
    name: string | null;
    email: string;
  };
  meeting: {
    title: string;
    scheduledAt: Date;
  };
}

export interface Feedback {
  id: number;
  meetingId: number;
  authorId: number;
  rating: number | null;
  comment: string | null;
  category: string | null;
  isAnonymous: boolean;
  createdAt: Date;
  meeting: {
    title: string;
    scheduledAt: Date;
  };
  author: {
    name: string | null;
    email: string;
  };
}

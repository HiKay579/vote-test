import { Role } from "@prisma/client";

export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: Role;
}

export interface Vote {
  id: string;
  title: string;
  description?: string | null;
  startDate: Date;
  endDate?: Date | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdById: string;
  options: VoteOption[];
  userVotes?: UserVote[];
  _count?: {
    userVotes: number;
  };
}

export interface VoteOption {
  id: string;
  text: string;
  voteId: string;
  _count?: {
    userVotes: number;
  };
}

export interface UserVote {
  id: string;
  userId: string;
  voteId: string;
  optionId: string;
  createdAt: Date;
}

export interface VoteResults {
  voteId: string;
  title: string;
  totalVotes: number;
  options: {
    id: string;
    text: string;
    count: number;
    percentage: number;
  }[];
} 
export type CommunityRole = 'Owner' | 'Admin' | 'Moderator' | 'Member';

export interface MemberDetails {
  id: string;
  username: string;
  role: CommunityRole;
}

export interface FlairDetails {
  id: string;
  name: string;
  hexColor: string;
}

export interface Community {
  id: string;
  name: string;
  numThreads: string;
  categories: string[];
}

export interface CommunityDetails {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  categories: string[];
  members: MemberDetails[];
  flairs: FlairDetails[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
}

/**
 * ====================================================
 * PAYLOADS
 * ====================================================
 */

export interface CreateCommunityPayload {
  name: string;
  description: string;
  categories: string[];
}

export interface CreateCategoryPayload {
  name: string;
}
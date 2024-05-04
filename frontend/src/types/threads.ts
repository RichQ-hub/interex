import { CommunityRole, FlairDetails } from './communities';

export interface ThreadDetails {
  id: string;
  author: string;
  role: CommunityRole;
  pinnedBy: string | null;
  title: string;
  content: string;
  createdAt: string;
  numUpvotes: string;
}

export interface ThreadCard {
  id: string;
  title: string;
  author: string;
  createdAt: string;
  pinnedBy: string | null;
  numComments: string;
  numUpvotes: string;
  flairs: FlairDetails[];
}

/**
 * ====================================================
 * PAYLOADS
 * ====================================================
 */

export interface CreateThreadPayload {
  title: string;
  content: string;
  flairs: string[];
}
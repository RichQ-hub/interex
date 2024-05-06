import { CommunityRole } from './communities';

export interface Comment {
  id: string;
  author: string;
  authorRole: CommunityRole;
  posted: string;
  content: string;
  numUpvotes: string;
  numDownvotes: string;
  replies: Comment[];
}
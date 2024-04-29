export interface Comment {
  id: string;
  author: string;
  content: string;
  replies: Comment[];
}
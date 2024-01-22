export interface Community {
  id: string;
  name: string;
  numThreads: string;
  categories: string[];
}

export interface CreateCommunityPayload {
  name: string;
  description: string;
}
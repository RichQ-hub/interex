import { z } from 'zod';

export const CreateCommunitySchema = z.object({
  name: z.string(),
  description: z.string().nullable(),
  createdAt: z.string(),
});

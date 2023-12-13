import { z } from 'zod';

export const CommunitySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  createdAt: z.string(),
  categories: z.array(z.string())
});

const CommunityCard = CommunitySchema.omit({
  createdAt: true,
  description: true,
});

export type CommunityDetails = z.infer<typeof CommunitySchema>;
export type CommunityCardDetails = z.infer<typeof CommunityCard>;

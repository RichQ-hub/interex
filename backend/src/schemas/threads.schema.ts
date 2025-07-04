import { z } from 'zod';

export const CreateThreadSchema = z.object({
	title: z.string(),
	content: z.string(),
	flairs: z.array(z.string())
});

export const EditThreadSchema = CreateThreadSchema.omit({
	flairs: true,
});

export const VoteThreadSchema = z.object({
	voteType: z.union([z.literal('Upvote'), z.literal('Downvote')])
});
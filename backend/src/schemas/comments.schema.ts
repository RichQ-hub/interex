import { z } from 'zod';

export const CreateCommentSchema = z.object({
	content: z.string()
});

export const EditCommentSchema = CreateCommentSchema;

export const VoteCommentSchema = z.object({
	userId: z.string(),
	voteType: z.union([z.literal('Upvote'), z.literal('Downvote')])
});

export const ReplyCommentSchema = CreateCommentSchema;
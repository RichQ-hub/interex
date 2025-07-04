import { z } from 'zod';

export const CreateCommunitySchema = z.object({
	name: z.string(),
	description: z.string(),
	categories: z.array(z.string())
});

export const EditCommunitySchema = CreateCommunitySchema;

export const CreateCategorySchema = z.object({
	name: z.string()
});

export const CreateFlairSchema = z.object({
	name: z.string(),
	hexColor: z.string()
});

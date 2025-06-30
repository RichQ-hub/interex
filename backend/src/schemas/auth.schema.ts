import { z } from 'zod';

export const RegisterUserSchema = z.object({
	email: z.string().email(),
	username: z.string(),
	password: z.string(),
});

export const LoginUserSchema = RegisterUserSchema.omit({
	username: true,
});
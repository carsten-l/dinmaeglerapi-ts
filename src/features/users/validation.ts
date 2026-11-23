import { z } from "zod";

export const userSchema = z.object({
    id: z.number().optional(),
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
});

export const userTokenSchema = z.object({
    id: z.number().int().positive(),
});

export const updateUserSchema = z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    newPassword: z.string().min(6).optional(),
}).strict().refine((user) => Object.keys(user).length > 0, {
    message: "At least one field is required.",
});

export type User = z.infer<typeof userSchema>;
export type NewUser = Omit<User, 'id'>;
export type LoginUser = Pick<User, 'email' | 'password'>;
export type UpdateUser = z.infer<typeof updateUserSchema>;



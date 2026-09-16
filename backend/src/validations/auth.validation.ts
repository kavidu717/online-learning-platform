import {z} from 'zod';

export const registerSchema = z.object({
    firstName: z
.string()
.min(2, "First name must be at least 2 characters long" )
.max(50, "First name must be at most 50 characters long" )
.trim(),
    lastName: z
.string()
.min(2, "Last name must be at least 2 characters long" )
.max(50, "Last name must be at most 50 characters long" )
.trim(),
    email: z
.string()
.email("please enter a valid email address")
.trim()
.lowercase(),

    password: z
    .string()
    .min(6, "Password must be at least 6 characters long"),
    
    role: z
    .enum(["student", "instructor"])
    .optional(),

    invitationCode: z
    .string()
    .optional()
});

export const loginSchema = z.object({
    email: z
    .string()
    .email("please enter a valid email address")
    .trim()
    .lowercase(),

    password: z
    .string()
    .min(1, "Password is required"),

});

export default registerSchema;
import {z} from 'zod';

export const createCourseSchema = z.object({
    title: z
.string()
.min(5, "Title must be at least 5 characters long" )
.max(100, "Title must be at most 100 characters long" )
    .trim(),

    description: z
.string()
.min(10, "Description must be at least 10 characters long" )
    .max(500, "Description must be at most 500 characters long" )
    .trim(),

    content: z
.string()
    .min(20, "Content must be at least 20 characters long" )
    .trim()
})

export const updateCourseSchema = z.object({
    title: z
.string()
.min(5, "Title must be at least 5 characters long" )
.max(100, "Title must be at most 100 characters long" )
    .trim()
    .optional(),

    description: z
.string()
.min(10, "Description must be at least 10 characters long" )
    .max(500, "Description must be at most 500 characters long" )
    .trim()
    .optional(),

    content: z
.string()
    .min(20, "Content must be at least 20 characters long" )
    .trim()
    .optional()
})
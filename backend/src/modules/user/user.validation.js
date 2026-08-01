import { z } from "zod";

// USERNAME AVAILABILITY VALIDATION SCHEMA
export const usernameSchema = z.object({
    username: z.string().trim().min(3, {
        message: "Username must be at least 3 characters long."
    }).max(18, {
        message: "Username cannot exceed 18 characters."
    })
});

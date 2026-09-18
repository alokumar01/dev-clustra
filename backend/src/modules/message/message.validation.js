import { z } from "zod";

const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid receiver id");

export const messageSchema = z.object({
    receiverId: objectId,
    content: z.string().trim().min(1, "Message is required").max(2000, "Message cannot exceed 2000 characters"),
    type: z.enum(["text", "image", "link", "code"]).default("text")
});

import { z } from "zod";

export const formSchema = z.object({
    title: z.string().min(3).max(100),
    description: z.string().min(20).max(500),
    category: z.string().min(3).max(20),
    pitch: z.string().min(10),
})

export const applySchema = z.object({
    github: z
      .string()
      .url({ message: "Please enter a valid GitHub URL" })
      .min(1, { message: "GitHub URL is required" }),
    discord: z
        .string()
        .min(3, "Discord username is required")

  });
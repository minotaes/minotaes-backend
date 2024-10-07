import { z } from "zod";

export const emailSchema = z.string().email();
export const passwordSchema = z.string().min(6).max(20);

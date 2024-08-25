import { z } from "zod";

export const passwordSchema = z.string().min(6).max(20);

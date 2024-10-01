import { DETAILS } from "#constants/details.js";
import { z } from "zod";

export const stringSchema = z.string({
  required_error: DETAILS.REQUIRED,
  invalid_type_error: DETAILS.EXPECTED_STRING,
});

export const emailSchema = stringSchema.email(DETAILS.INVALID_EMAIL);
export const passwordSchema = stringSchema
  .min(6, { message: DETAILS.PASSWORD_TOO_SHORT })
  .max(20, { message: DETAILS.PASSWORD_TOO_LONG });

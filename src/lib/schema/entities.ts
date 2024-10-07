import { DETAILS } from "#constants/details.js";
import { z } from "zod";

export const stringSchema = z.string({
  required_error: DETAILS.REQUIRED,
  invalid_type_error: DETAILS.EXPECTED_STRING,
});

export const emailSchema = stringSchema
  .email(DETAILS.INVALID)
  .min(5, { message: DETAILS.TOO_SHORT })
  .max(100, { message: DETAILS.TOO_LONG });
export const passwordSchema = stringSchema
  .min(6, { message: DETAILS.TOO_SHORT })
  .max(20, { message: DETAILS.TOO_LONG });

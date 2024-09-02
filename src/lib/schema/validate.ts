import { ZodError, type z, type AnyZodObject } from "zod";

type Result<D> =
  | { success: true; data: D }
  | { success: false; details: Record<string, string> };

export const validateSchema =
  (schema: AnyZodObject) =>
  (data: any): Result<z.infer<typeof schema>> => {
    try {
      schema.parse(data);

      return {
        success: true as const,
        data,
      };
    } catch (err) {
      if (!(err instanceof ZodError)) {
        return {
          success: false as const,
          details: {},
        };
      }

      const parsed = err.issues.reduce(
        (acc, { path, message }) => ({
          ...acc,
          [`${path.join(".")}`]: message,
        }),
        {},
      );

      return {
        success: false as const,
        details: parsed,
      };
    }
  };

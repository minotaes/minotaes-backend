import { ZodError, type z, type AnyZodObject } from "zod";

export const validateSchema =
  (schema: AnyZodObject) => (data: z.infer<typeof schema>) => {
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

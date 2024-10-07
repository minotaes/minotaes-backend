import { BadRequestError } from "../../../lib/http-error/index.js";
import { ValidationError } from "sequelize";

const SequelizeError: Record<string, string> = {
  "unique violation": "UNIQUE_VIOLATION",
};

export const sequelizeErrorHandler = async <T>(cb: () => Promise<T>) => {
  try {
    const result = await cb();
    return result;
  } catch (error) {
    if (error instanceof ValidationError) {
      const details = error.errors.reduce<Record<string, string>>(
        (acc, curr) => {
          acc[curr.path ?? ""] =
            SequelizeError[curr.type ?? ""] ?? curr.message;
          return acc;
        },
        {},
      );

      throw new BadRequestError({
        message: "Something went wrong when registering the user.",
        details,
      });
    }

    throw error;
  }
};

import { z } from "zod";
import { passwordSchema, validateSchema } from "#lib/schema/index.js";
import { NotFoundError } from "#lib/http-error/index.js";
import { isNullish } from "#utils/check.js";
import { controllerHandler } from "#api/middleware/index.js";

const sh = z.object({
  body: z.object({
    email: z.string().email(),
    password: passwordSchema,
  }),
});

export const loginController = controllerHandler(
  {
    test: validateSchema(sh),
  },
  async ({ attrs, deps }) => {
    const user = await deps.models.user.findOne({
      where: {
        email: attrs.body.email,
      },
      attributes: ["password"],
    });

    if (isNullish(user)) {
      throw new NotFoundError({
        message: `Email ${attrs.body.email} not found.`,
        details: {},
      });
    }

    return {
      status: 200,
      body: {
        message: "Login exitoso",
      },
    };
  },
);

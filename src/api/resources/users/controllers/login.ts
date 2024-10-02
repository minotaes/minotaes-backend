import { z } from "zod";
import bcrypt from "bcrypt";

import {
  emailSchema,
  passwordSchema,
  validateSchema,
} from "#lib/schema/index.js";
import { UnauthorizedError } from "#lib/http-error/index.js";
import { isNullish } from "#utils/check.js";
import { controllerHandler } from "#api/middleware/index.js";
import { createJWT } from "#root/lib/jwt/index.js";

const sh = z.object({
  body: z.object({
    email: emailSchema,
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
      attributes: ["userId", "password"],
    });

    const isEqual = await bcrypt.compare(
      attrs.body.password,
      user?.password ?? "",
    );

    if (isNullish(user) || !isEqual) {
      throw new UnauthorizedError({
        message: "Credenciales inválidas",
        details: {},
      });
    }

    const token = createJWT({ expiresIn: "30d" }, { i: user.userId });

    return {
      status: 200,
      body: {
        token,
      },
    };
  },
);

import crypto from "node:crypto";

import { z } from "zod";
import bcrypt from "bcrypt";

import { controllerHandler } from "#api/middleware/index.js";
import {
  passwordSchema,
  stringSchema,
  validateSchema,
} from "#lib/schema/index.js";
import { isNullish } from "#root/utils/check.js";
import { DETAILS } from "#root/constants/details.js";
import { BadRequestError } from "#root/lib/http-error/index.js";
import { createJWT, decodeJWT, verifyJWT } from "#root/lib/jwt/index.js";

const requestSchema = z.object({
  body: z.object({
    token: stringSchema,
    password: passwordSchema,
  }),
});

export const registerController = controllerHandler(
  {
    test: validateSchema(requestSchema),
  },
  async ({ attrs, deps }) => {
    const email = verifyJWT<{ e: string }>(attrs.body.token)?.e;

    if (isNullish(email)) {
      throw new BadRequestError({
        message: "Token is invalid or expired",
        details: { token: DETAILS.INVALID },
      });
    }

    const userId = crypto.randomUUID();

    await deps.models.user.create({
      userId,
      email,
    });

    const token = createJWT({ expiresIn: "30d" }, { i: userId });

    bcrypt.hash(attrs.body.password, 10, function (err, hash) {
      if (err instanceof Error) {
        // TODO: handle error send email
        console.log(err);
        return;
      }

      const tokenPayload = decodeJWT<{ iat: number }>(attrs.body.token);

      deps.models.user
        .update(
          {
            password: hash,
            lastSessionTokenCreatedAt: tokenPayload?.iat ?? 0,
          },
          { where: { userId } },
        )
        .catch((err) => {
          // TODO: handle error send email
          console.log(err);
        });
    });

    return {
      status: 200,
      body: {
        token,
      },
    };
  },
);

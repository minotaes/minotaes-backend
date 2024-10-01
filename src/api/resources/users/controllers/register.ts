import crypto from "node:crypto";

import { z } from "zod";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { controllerHandler } from "#api/middleware/index.js";
import {
  passwordSchema,
  stringSchema,
  validateSchema,
} from "#lib/schema/index.js";
import { ENV } from "#config/env.js";
import { isNullish } from "#root/utils/check.js";
import { DETAILS } from "#root/constants/details.js";
import { BadRequestError } from "#root/lib/http-error/index.js";

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
    let email: string | undefined;

    try {
      const decoded = jwt.verify(attrs.body.token, ENV.SERVER.JWT) as {
        e: string;
      };
      email = decoded.e;
    } catch (error) {
      console.error(error);
    }

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

    const token = jwt.sign({ u: userId }, ENV.SERVER.JWT, {
      expiresIn: "30d",
    });

    bcrypt.hash(attrs.body.password, 10, function (err, hash) {
      if (err instanceof Error) {
        // TODO: handle error send email
        console.log(err);
        return;
      }

      const tokenPayload = jwt.verify(token, ENV.SERVER.JWT) as any;

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

import crypto from "node:crypto";

import { z } from "zod";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { controllerHandler } from "#api/middleware/index.js";
import {
  emailSchema,
  passwordSchema,
  validateSchema,
} from "#lib/schema/index.js";
import { ENV } from "#config/env.js";

const requestSchema = z.object({
  body: z.object({
    email: emailSchema,
    password: passwordSchema,
  }),
});

export const registerController = controllerHandler(
  {
    test: validateSchema(requestSchema),
  },
  async ({ attrs, deps }) => {
    const userId = crypto.randomUUID();

    await deps.models.user.create({
      userId,
      email: attrs.body.email,
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

import { z } from "zod";
import bcrypt from "bcrypt";

import { passwordSchema, validateSchema } from "#lib/schema/index.js";
import { controllerHandler } from "#api/middleware/index.js";
import { createJWT, decodeJWT } from "#root/lib/jwt/index.js";

const sh = z.object({
  body: z.object({
    password: passwordSchema,
  }),
});

export const resetPasswordController = controllerHandler(
  {
    test: validateSchema(sh),
    auth: true,
    user: ["userId"],
  },
  async ({ user, attrs, deps }) => {
    const token = createJWT({ expiresIn: "30d" }, { i: user.userId });

    bcrypt.hash(attrs.body.password, 10, function (err, hash) {
      if (err instanceof Error) {
        // TODO: handle error send email
        console.log(err);
        return;
      }

      const tokenPayload = decodeJWT<{ iat: number }>(token);

      deps.models.user
        .update(
          {
            password: hash,
            lastSessionTokenCreatedAt: tokenPayload?.iat ?? 0,
          },
          { where: { userId: user.userId } },
        )
        .catch((err: any) => {
          // TODO: handle error send email
          console.log(err);
        });
    });

    return { status: 200, body: { token } };
  },
);

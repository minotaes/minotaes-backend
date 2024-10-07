import { z } from "zod";

import { emailSchema, validateSchema } from "#lib/schema/index.js";
import { isNullish } from "#utils/check.js";
import { controllerHandler } from "#api/middleware/index.js";
import { createJWT } from "#root/lib/jwt/index.js";
import { sendForgotPasswordEmail } from "#root/lib/email/index.js";

const sh = z.object({
  body: z.object({
    email: emailSchema,
  }),
});

export const forgotPasswordController = controllerHandler(
  {
    test: validateSchema(sh),
  },
  async ({ attrs, deps }) => {
    const user = await deps.models.user.findOne({
      where: { email: attrs.body.email },
      attributes: ["userId"],
    });

    if (isNullish(user)) {
      return { status: 200, body: {} };
    }

    await sendForgotPasswordEmail({
      to: attrs.body.email,
      data: { token: createJWT({ expiresIn: "6m" }, { i: user.userId }) },
    });

    return { status: 200, body: {} };
  },
);

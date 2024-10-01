import { z } from "zod";
import jwt from "jsonwebtoken";

import { controllerHandler } from "#api/middleware/index.js";
import { emailSchema, validateSchema } from "#lib/schema/index.js";
import { isNullish } from "#root/utils/check.js";
import { ENV } from "#config/env.js";
import { sendRegisterEmail } from "#root/lib/email/index.js";

const requestSchema = z.object({
  body: z.object({
    email: emailSchema,
  }),
});

export const preRegisterController = controllerHandler(
  {
    test: validateSchema(requestSchema),
  },
  async ({ attrs, deps }) => {
    const user = await deps.models.user.findOne({
      where: {
        email: attrs.body.email,
      },
      attributes: ["userId"],
    });

    if (!isNullish(user)) {
      return {
        status: 200,
        body: {},
      };
    }

    const token = jwt.sign({ e: attrs.body.email }, ENV.SERVER.JWT, {
      expiresIn: "6m",
    });

    await sendRegisterEmail({
      to: attrs.body.email,
      data: {
        token,
      },
    });

    return {
      status: 200,
      body: {},
    };
  },
);

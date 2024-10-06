import { DETAILS } from "#root/constants/details.js";
import { verifyJWT } from "#root/lib/jwt/index.js";
import { isNullish } from "#root/utils/check.js";
import { type Request } from "express";

export const authenticate = (req: Request) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (isNullish(token)) {
    return {
      success: false,
      message: "Token is missing",
      details: {
        token: DETAILS.REQUIRED,
      },
    };
  }

  const userId = verifyJWT<{ i: string }>(token)?.i;

  if (isNullish(userId)) {
    return {
      success: false,
      message: "Token is invalid",
      details: {
        token: DETAILS.INVALID,
      },
    };
  }

  return {
    success: true,
    data: userId,
  };
};

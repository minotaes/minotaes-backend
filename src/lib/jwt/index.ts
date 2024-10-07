import jwt, { type SignOptions } from "jsonwebtoken";

import { ENV } from "#config/env.js";
import { isNullish } from "#root/utils/check.js";

export const createJWT = (options: SignOptions, data: string | object) => {
  const secret = ENV.SERVER.JWT;

  if (isNullish(secret)) {
    throw new Error("JWT secret not found");
  }

  const token = jwt.sign(data, secret, options);

  return token;
};

export const verifyJWT = <T>(token: string): T | undefined => {
  const secret = ENV.SERVER.JWT;
  if (isNullish(secret)) {
    throw new Error("JWT secret not found");
  }

  try {
    return jwt.verify(token, secret) as T;
  } catch (error) {
    return undefined;
  }
};

export const decodeJWT = <T>(token: string): T | undefined => {
  try {
    return jwt.decode(token) as T;
  } catch (error) {
    return undefined;
  }
};

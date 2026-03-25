import jwt from "jsonwebtoken";
import type { StringValue } from "ms";

export const generateAccessToken = (id: string, role: string) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN as StringValue,
  });
};

export const generateRefreshToken = (id: string) => {
  return jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET as string, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN as StringValue,
  });
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET as string) as {
    id: string;
  };
};

import { Types } from "mongoose";

declare global {
  namespace Express {
    interface UserPayload {
      _id: Types.ObjectId;
      role: string;
      name?: string;
      email?: string;
    }

    interface Request {
      user?: UserPayload;
    }
  }
}

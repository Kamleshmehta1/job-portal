import bcrypt from "bcryptjs";
import mongoose, { Document, Schema } from "mongoose";

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  role: "client" | "freelancer";
  createdAt: Date;
  updatedAt: Date;

  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ["client", "freelancer"],
      default: "freelancer",
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  const user = this as UserDocument;

  if (!user.isModified("password")) return;

  user.password = await bcrypt.hash(user.password, 10);
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string,
) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<UserDocument>("User", userSchema);
export default User;

// import mongoose, { Document } from "mongoose";

// export interface UserDocument extends Document {
//   _id: mongoose.Types.ObjectId;
//   username: string;
//   email: string;
//   password: string;
//   isVerified: boolean;
//   isAdmin: boolean;
//   createdAt: Date;
//   updatedAt: Date;
// }

// const userSchema = new mongoose.Schema(
//   {
//     username: {
//       type: String,
//       required: true,
//     },

//     email: {
//       type: String,
//       required: true,
//       unique: true,
//     },

//     password: {
//       type: String,
//       required: true,
//     },

//     isVerified: {
//       type: Boolean,
//       required: true,
//       default: false,
//     },

//     isAdmin: {
//       type: Boolean,
//       required: true,
//       default: false,
//     },
//   },
//   { timestamps: true }
// );

// const User = mongoose.model("User", userSchema);

// export default User;

// src/models/user.model.ts
import mongoose, { Document } from "mongoose";

export interface UserDocument extends Document {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  password: string;
  isVerified: boolean;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<UserDocument>(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongoose.model<UserDocument>("User", userSchema);
export default User;

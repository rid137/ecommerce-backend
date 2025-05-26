import mongoose from "mongoose";

export interface ProductFields {
  name: string;
  images: string[];
  brand: string;
  quantity: number;
//   category: string; // or `mongoose.Types.ObjectId` if you're passing an ObjectId directly
//   category: mongoose.Types.ObjectId;
  category: string;
  description: string;
  price: number;
  countInStock: number;
}
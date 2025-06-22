export interface ProductFields {
  name: string;
  images: string[];
  brand: string;
  quantity: number;
//   category: mongoose.Types.ObjectId;
  category: string;
  description: string;
  price: number;
  countInStock: number;
}
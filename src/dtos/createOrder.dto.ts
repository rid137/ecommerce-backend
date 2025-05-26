export interface OrderItemInput {
  _id: string; // Product ID
  name: string;
  qty: number;
  image: string;
  price: number;
}

export interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface CreateOrderDto {
  orderItems: OrderItemInput[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
}
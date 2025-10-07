export interface TraccarPosition {
  deviceId: number;
  latitude: number;
  longitude: number;
  // Add other properties as needed
}

export interface User {
  id: string; // UUID
  email: string;
  createdAt: Date;
}

export interface Product {
  id: string; // UUID
  name: string;
  price: number; // In cents
  imageUrl?: string;
}

export interface LineItem {
  productId: string; // UUID
  name: string;
  quantity: number;
  price: number; // Price per item in cents
}

export type OrderStatus = 'Awaiting Payment' | 'Placed' | 'En Route' | 'Delivered';

export interface Order {
  id: string; // UUID
  userId: string; // UUID
  status: OrderStatus;
  lineItems: LineItem[];
  total: number; // In cents
  deviceId?: string; // Can be null until payment is confirmed
  createdAt: Date;
  start_coords: [number, number];
  destination_coords: [number, number];
  startName?: string;
  destName?: string;
  destImageUrl?: string;
}

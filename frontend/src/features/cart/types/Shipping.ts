/**
 * Shipping Types - Cart Feature
 */

export interface ShippingMethod {
  id: string;
  name: string;
  price: number;
  description: string;
  freeLabel?: string;
}

export interface CheckoutAddress {
  fullname: string;
  phone: string;
  detail: string;
  ward: string;
  district: string;
  city: string;
  isDefault: boolean;
}

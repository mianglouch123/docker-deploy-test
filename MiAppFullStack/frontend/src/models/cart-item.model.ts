import { ProductFromApi } from './product.from.api';

export interface CartItem {
  product: ProductFromApi;
  quantity: number;
}

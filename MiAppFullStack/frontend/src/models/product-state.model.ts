import { ProductFromApi } from './product.from.api';
export interface ProductState {
  data : ProductFromApi[];
  loading : boolean,
  error : string | null
};
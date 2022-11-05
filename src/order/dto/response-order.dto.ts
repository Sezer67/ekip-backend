import { Product } from 'src/product/product.entity';
import { Order } from '../order.entity';

export type SalesResponseType = {
  sales: Order[];
  count: number;
  filterTotalTaking: number;
};

export type BestSalesResponseType = {
  user_id: string;
  user_first_name: string;
  user_last_name: string;
  id: string;
  price: number;
  stock: number;
  images: string[] | null;
  name: string;
  created_at: Date;
  show_count: number;
  categoryIds: string[];
  sum: string;
  count: string;
};

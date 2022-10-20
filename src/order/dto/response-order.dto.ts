import { Order } from '../order.entity';

export type SalesResponseType = {
  sales: Order[];
  count: number;
  filterTotalTaking: number;
};

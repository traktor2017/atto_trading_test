import {OrderBookItem} from './order-book-item.model';

export interface SubjectData {
    name: 'SPY' | 'EQL',
    array: Array<OrderBookItem>
}
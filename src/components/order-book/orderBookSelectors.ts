import { createSelector } from 'reselect';
import { RootState } from '../../app/store';
import { OrderBookProps } from './OrderBook';
import { BookRecord, OrderBook, OrderRecord } from './orderBookSlice';

export const getBook = (state: RootState, props: OrderBookProps): OrderBook => state.orderBook.books[props.bookId];
export const getActiveBookId = (state: RootState): string => state.orderBook.activeBookId;
export const getActiveBookState = (state: RootState): string => state.orderBook.activeBookState;
export const getOrderBooks = (state: RootState): BookRecord => state.orderBook.books;

const bucketReducer =
  (orders: OrderRecord, grouping: number) => (sortedOrders: Array<OrderLevel>, priceLevel: string) => {
    const bucket = +priceLevel - (+priceLevel % grouping);
    if (sortedOrders.length > 0 && sortedOrders[sortedOrders.length - 1].price === bucket) {
      sortedOrders[sortedOrders.length - 1].size += orders[+priceLevel];
      sortedOrders[sortedOrders.length - 1].total += orders[+priceLevel];
      return sortedOrders;
    }
    const prevTotal = sortedOrders.length === 0 ? 0 : sortedOrders[sortedOrders.length - 1].total;
    sortedOrders.push({
      price: bucket,
      size: orders[+priceLevel],
      total: prevTotal + orders[+priceLevel],
    });
    return sortedOrders;
  };

export const getActiveBook = createSelector(
  [getActiveBookId, getOrderBooks],
  (bookId, orderBooks): OrderBook | null => {
    if (bookId in orderBooks) {
      return orderBooks[bookId];
    }
    return null;
  },
);

export const getSortedAsks = createSelector([getBook], (book): Array<OrderLevel> => {
  if (!book) {
    return [];
  }
  const { grouping, asks } = book;
  const sorted = Object.keys(asks).sort().reverse();
  return sorted.reduce(bucketReducer(asks, grouping.value), []);
});

export const getSortedBids = createSelector([getBook], (book): Array<OrderLevel> => {
  if (!book) {
    return [];
  }
  const { bids, grouping } = book;
  const sorted = Object.keys(bids).sort().reverse();
  return sorted.reduce(bucketReducer(bids, grouping.value), []);
});

export const getMaxSize = createSelector([getBook], (book): number => {
  if (!book) {
    return 0;
  }
  const totalAskSize = Object.values(book.asks).reduce((a, b) => a + b, 0);
  const totalBidSize = Object.values(book.bids).reduce((a, b) => a + b, 0);
  return Math.max(totalAskSize, totalBidSize);
});

export const getSpread = createSelector([getSortedAsks, getSortedBids], (asks, bids) => {
  const bestAsk = asks.length > 0 ? asks[0].price : 0;
  const bestBid = bids.length > 0 ? bids[0].price : 0;
  return Math.abs(bestAsk - bestBid);
});

export const getActiveGrouping = createSelector([getActiveBook], (book) => {
  if (book) {
    return book.grouping;
  }
  return null;
});

export type OrderLevel = {
  price: number;
  size: number;
  total: number;
};

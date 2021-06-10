import { createSlice, createAction, PayloadAction } from '@reduxjs/toolkit';
import { Order } from './orderBookMessageHandler';
import { GroupValue, groupValues } from './OrderBookGroupingDropdown';

const initialState: OrderBookState = {
  books: {},
  activeBookId: 'PI_XBTUSD',
  activeBookState: 'disconnected',
};

export const SUBSCRIBE_ORDERBOOK = 'orderBooks/SUBSCRIBE_ORDERBOOK';
export const KILL_ACTIVE_BOOK = 'orderBooks/KILL_ACTIVE_BOOK';
export const RECONNECT_ACTIVE_BOOK = 'orderBooks/RECONNECT_ACTIVE_BOOK';
export const subscribeOrderBook = createAction<string>(SUBSCRIBE_ORDERBOOK);
export const killActiveBook = createAction<undefined>(KILL_ACTIVE_BOOK);
export const reconnectActiveBook = createAction<undefined>(RECONNECT_ACTIVE_BOOK);
export type OrderRecord = Record<number, number>;

function updateSingleBook(state: OrderBookState, bookId: string, bookUpdates: Array<Order>, bookType: string) {
  for (let bookIndex = 0; bookIndex < bookUpdates.length; bookIndex++) {
    const bookUpdatesForIndex = bookUpdates[bookIndex] || [];
    const price = +(bookUpdatesForIndex[0] || 0);
    const size = +(bookUpdatesForIndex[1] || 0);
    const book = bookType === 'bids' ? state.books[bookId].bids : state.books[bookId].asks;
    if (size === 0) {
      if (price in book) {
        delete book[price];
      }
      continue;
    }
    book[price] = size;
  }
}

export const orderBookSlice = createSlice({
  name: 'orderBooks',
  initialState,
  reducers: {
    updateBook: (
      state,
      action: PayloadAction<{
        bookId: string;
        bids: Array<Order>;
        asks: Array<Order>;
      }>,
    ) => {
      const { bookId, bids, asks } = action.payload;
      updateSingleBook(state, bookId, bids, 'bids');
      updateSingleBook(state, bookId, asks, 'asks');
    },
    updateActiveBook: (state, action: PayloadAction<string>) => {
      state.activeBookId = action.payload;
    },
    activeBookConnected: (state) => {
      state.books[state.activeBookId] = {
        grouping: groupValues[state.activeBookId][1],
        bids: {},
        asks: {},
      };
      state.activeBookState = 'connected';
    },
    activeBookConnecting: (state) => {
      state.activeBookState = 'connecting';
    },
    bookDisconnected: (state, action: PayloadAction<string>) => {
      if (action.payload === state.activeBookId) {
        state.activeBookState = 'disconnected';
      }
      delete state.books[action.payload];
    },
    updateGrouping: (state, action: PayloadAction<GroupValue>) => {
      state.books[state.activeBookId].grouping = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(subscribeOrderBook, (state) => {
      state.activeBookState = 'connecting';
      return state;
    });
    builder.addCase(killActiveBook, (state) => {
      state.activeBookState = 'disconnected';
      return state;
    });
  },
});

export const {
  activeBookConnected,
  activeBookConnecting,
  bookDisconnected,
  updateActiveBook,
  updateBook,
  updateGrouping,
} = orderBookSlice.actions;

export type BookRecord = Record<string, OrderBook>;
export type BookState = 'connected' | 'disconnected' | 'connecting';
export type OrderBook = {
  bids: OrderRecord;
  asks: OrderRecord;
  grouping: GroupValue;
};
export type OrderBookState = {
  books: BookRecord;
  activeBookId: string;
  activeBookState: BookState;
};

export default orderBookSlice.reducer;

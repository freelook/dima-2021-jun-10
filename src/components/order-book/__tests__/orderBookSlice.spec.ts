import orderBookReducer, {
  activeBookConnected,
  activeBookConnecting,
  bookDisconnected,
  BookRecord,
  BookState,
  OrderBookState,
  OrderRecord,
  updateActiveBook,
  updateBook,
  updateGrouping,
} from '../orderBookSlice';

const createState = (
  bookId: string,
  bids: OrderRecord,
  asks: OrderRecord,
  bookState = 'disconnected',
  booksValue?: BookRecord,
): OrderBookState => {
  const state = {
    books: {} as BookRecord,
    activeBookId: bookId,
    activeBookState: bookState as BookState,
  };
  if (!booksValue) {
    state.books[bookId] = {
      asks,
      bids,
      grouping: { value: 1, label: 'Group 1.0' },
    };
  }
  return state;
};

describe('order book reducer', () => {
  const initialState: OrderBookState = {
    books: {},
    activeBookId: 'PI_XBTUSD',
    activeBookState: 'disconnected',
  };

  it('should handle initial state', () => {
    expect(orderBookReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle updateBook setting new values', () => {
    const state = createState('PI_XBTUSD', {}, {});
    const actual = orderBookReducer(
      state,
      updateBook({
        bookId: 'PI_XBTUSD',
        bids: [
          [1, 5],
          [2, 10],
        ],
        asks: [
          [3, 15],
          [4, 20],
        ],
      }),
    );
    expect(actual.books).toEqual({
      PI_XBTUSD: {
        asks: {
          3: 15,
          4: 20,
        },
        bids: {
          1: 5,
          2: 10,
        },
        grouping: { value: 1, label: 'Group 1.0' },
      },
    });
  });

  it('should handle updateBook remove and update old values', () => {
    const state = createState(
      'PI_XBTUSD',
      {
        1: 5,
        2: 10,
      },
      {
        3: 15,
        4: 20,
      },
    );
    const actual = orderBookReducer(
      state,
      updateBook({
        bookId: 'PI_XBTUSD',
        bids: [
          [1, 0],
          [2, 15],
        ],
        asks: [
          [3, 0],
          [4, 25],
        ],
      }),
    );
    expect(actual.books).toEqual({
      PI_XBTUSD: {
        asks: {
          4: 25,
        },
        bids: {
          2: 15,
        },
        grouping: { value: 1, label: 'Group 1.0' },
      },
    });
  });

  it('should handle activeBookConnected', () => {
    const expectedState = createState('PI_XBTUSD', {}, {}, 'connected');
    const actual = orderBookReducer(initialState, activeBookConnected());
    expect(actual).toEqual(expectedState);
  });

  it('should handle activeBookConnecting', () => {
    const state = createState('PI_XBTUSD', {}, {}, 'disconnected');
    const expectedState = createState('PI_XBTUSD', {}, {}, 'connecting');
    const actual = orderBookReducer(state, activeBookConnecting());
    expect(actual).toEqual(expectedState);
  });

  it('should handle bookDisconnected when book is active', () => {
    const state = createState('PI_XBTUSD', {}, {}, 'connected');
    const expectedState = createState('PI_XBTUSD', {}, {}, 'disconnected', {});
    const actual = orderBookReducer(state, bookDisconnected('PI_XBTUSD'));
    expect(actual).toEqual(expectedState);
  });

  it('should handle bookDisconnected when book is not active', () => {
    const state = createState('PI_XBTUSD', {}, {}, 'connected');
    const actual = orderBookReducer(state, bookDisconnected('PI_ETHUSD'));
    expect(actual).toEqual(state);
  });

  it('should handle updateActiveBook', () => {
    const state = createState('PI_XBTUSD', {}, {}, 'connected');
    const actual = orderBookReducer(state, updateActiveBook('PI_ETHUSD'));
    expect(actual.activeBookId).toEqual('PI_ETHUSD');
  });

  it('should handle updateGrouping', () => {
    const grouping = { value: 0.1, label: 'Group 0.1' };
    const state = createState('PI_XBTUSD', {}, {}, 'connected');
    const actual = orderBookReducer(state, updateGrouping(grouping));
    expect(actual.books['PI_XBTUSD'].grouping).toEqual(grouping);
  });
});

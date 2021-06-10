import React from 'react';
import KillFeedButton from '../KillFeedButton';
import { render } from '../../../test-utils';
import { BookState } from '../orderBookSlice';
import OrderBookGroupingDropdown from '../OrderBookGroupingDropdown';

test.each([
  ['PI_XBTUSD', 'Group 1.0'],
  ['PI_ETHUSD', 'Group 0.1'],
])(`should render correct group option based on the book id`, (activeBook, groupOption) => {
  const { getByText } = render(<OrderBookGroupingDropdown />, {
    initialState: {
      orderBook: {
        books: {},
        activeBookId: activeBook,
        activeBookState: 'connected',
      },
    },
  });

  expect(getByText(groupOption)).toBeInTheDocument();
});

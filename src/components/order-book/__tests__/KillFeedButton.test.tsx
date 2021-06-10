import React from 'react';
import KillFeedButton from '../KillFeedButton';
import { render } from '../../../test-utils';
import { BookState } from '../orderBookSlice';

test.each([
  ['Kill Feed', 'connected'],
  ['Kill Feed', 'connecting'],
  ['Reconnect', 'disconnected'],
])(`should render %i text when socket is in %i state`, (expectedText, socketState) => {
  const { getByText } = render(<KillFeedButton />, {
    initialState: {
      orderBook: {
        books: {},
        activeBookId: 'PI_XBTUSD',
        activeBookState: socketState as BookState,
      },
    },
  });

  expect(getByText(expectedText)).toBeInTheDocument();
});

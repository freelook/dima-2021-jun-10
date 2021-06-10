import { render } from '@testing-library/react';
import React from 'react';
import OrderBookValueHeader from '../OrderBookValueHeader';
import styles from '../OrderBook.module.css';

test.each([
  ['bid', false, true],
  ['bid', true, false],
  ['ask', false, false]
])(`should render value headers in the correct order`, (type, isVerticallyOriented, shouldReverse) => {
  const { container } = render(<OrderBookValueHeader type={type} isVerticallyOriented={isVerticallyOriented} />);

  const vals = Array.prototype.slice
    .call(container.getElementsByClassName(styles.headerTitle))
    .map((el: HTMLElement) => el.innerHTML);

  if (shouldReverse) {
    expect(vals[0]).toBe('TOTAL');
  } else {
    expect(vals[0]).toBe('PRICE');
  }
});

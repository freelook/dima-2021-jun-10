import { render } from '@testing-library/react';
import React from 'react';
import styles from '../OrderBook.module.css';
import OrderLevelRow, { OrderType } from '../OrderLevelRow';
import { OrderLevel } from '../orderBookSelectors';

const createOrderLevel = (price: number, size: number, total: number): OrderLevel => {
  return { price, size, total };
};

test.each([
  ['bid', false, 100, createOrderLevel(20, 25, 30), '30', '30%'],
  ['bid', true, 100, createOrderLevel(20, 25, 30), '20.00', '30%'],
  ['ask', false, 100, createOrderLevel(20, 25, 35), '20.00', '35%'],
  ['ask', true, 100, createOrderLevel(20, 25, 30), '20.00', '30%'],
])(
  `should render values in the correct order`,
  (type, isVerticallyOriented, maxSize, orderLevel, expectedFirstNum, expectedBackgroundSizePercent) => {
    const { container } = render(
      <OrderLevelRow
        maxSize={maxSize}
        orderLevel={orderLevel}
        type={type as OrderType}
        isVerticallyOriented={isVerticallyOriented}
      />,
    );

    const vals = Array.prototype.slice
      .call(container.getElementsByClassName(styles.val))
      .map((el: HTMLElement) => el.innerHTML);

    const backgroundSize = container.getElementsByClassName(styles[`${type}Row`])[0].style['background-size'];

    expect(backgroundSize.split(' ')[0]).toBe(expectedBackgroundSizePercent);
    expect(vals[0]).toBe(expectedFirstNum);
  },
);

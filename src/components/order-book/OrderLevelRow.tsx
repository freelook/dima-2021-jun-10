import React from 'react';
import { OrderLevel } from './orderBookSelectors';
import styles from './OrderBook.module.css';
import cx from 'classnames';

export type OrderType = 'bid' | 'ask';

type OrderLevelProps = {
  orderLevel: OrderLevel;
  maxSize: number;
  isVerticallyOriented: boolean;
  type: OrderType;
};

function OrderLevelRow({ maxSize, orderLevel, type, isVerticallyOriented, ...props }: OrderLevelProps) {
  const { price, size, total } = orderLevel;
  const rowClass = type === 'bid' ? styles.bidRow : styles.askRow;
  const percentageOrders = (total / maxSize) * 100;
  const priceClass = type === 'bid' ? styles.bidPrice : styles.askPrice;
  const areHeadingsReversed = !isVerticallyOriented && type === 'bid';
  const values = [
    <div className={cx(styles.val, priceClass)} key="price">
      {price.toFixed(2)}
    </div>,
    <div className={styles.val} key="size">
      {size}
    </div>,
    <div className={styles.val} key="total">
      {total}
    </div>,
  ];
  return (
    <div className={rowClass} style={{
      backgroundSize: `${percentageOrders}% 100%`,
      backgroundPosition: isVerticallyOriented ? 'right': undefined
    }} {...props}>
      {areHeadingsReversed ? values.reverse().map((value) => value) : values.map((value) => value)}
    </div>
  );
}

export default React.memo(OrderLevelRow);

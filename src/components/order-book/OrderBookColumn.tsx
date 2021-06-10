import React from 'react';
import OrderLevelRow from './OrderLevelRow';
import OrderBookValueHeader from './OrderBookValueHeader';
import { OrderLevel } from './orderBookSelectors';
import styles from './OrderBook.module.css';
import cx from 'classnames';

type OrderBookColumnProps = {
  type: 'bid' | 'ask';
  orders: Array<OrderLevel>;
  maxSize: number;
  loading: boolean;
  isVerticallyOriented: boolean;
};

export default function OrderBookColumn({
  isVerticallyOriented,
  loading,
  type,
  orders,
  maxSize,
}: OrderBookColumnProps): JSX.Element {
  const loadingClass = loading ? styles.loading : '';
  // todo sort orders
  return (
    <div className={cx(styles.orderBookCol, loadingClass)}>
      <OrderBookValueHeader type={type} isVerticallyOriented={isVerticallyOriented} />
      <div className={styles.rows}>
        {orders.map((order) => (
          <OrderLevelRow
            orderLevel={order}
            maxSize={maxSize}
            key={order.price}
            type={type}
            isVerticallyOriented={isVerticallyOriented}
          />
        ))}
      </div>
    </div>
  );
}

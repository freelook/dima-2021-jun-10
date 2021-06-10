import React from 'react';
import styles from './OrderBook.module.css';

type OrderBookValueHeaderProps = {
  type: string;
  isVerticallyOriented: boolean;
};

function OrderBookValueHeader({ type, isVerticallyOriented }: OrderBookValueHeaderProps) {
  const areHeadingsReversed = !isVerticallyOriented && type === 'bid';
  const isNoHeader =  isVerticallyOriented && type === 'ask';
  const headings = areHeadingsReversed ? ['TOTAL', 'SIZE', 'PRICE'] : ['PRICE', 'SIZE', 'TOTAL'];
  return (
    !isNoHeader ? <div className={styles.header}>
      {headings.map((heading) => (
        <div className={styles.headerTitle} key={heading}>
          {heading}
        </div>
      ))}
    </div> : <br/>
  );
}

export default React.memo(OrderBookValueHeader);

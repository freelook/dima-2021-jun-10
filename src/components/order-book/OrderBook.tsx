import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { getSortedBids, getSortedAsks, getActiveBookState } from './orderBookSelectors';
import styles from './OrderBook.module.css';
import OrderBookColumn from './OrderBookColumn';
import { useThrottle } from 'react-use';
import { useRef } from 'react';
import KillFeedButton from './KillFeedButton';
import ToggleFeedButton from './ToggleFeedButton';
import OrderBookLoader from './OrderBookLoader';
import OrderBookGroupingDropdown from './OrderBookGroupingDropdown';

export type OrderBookProps = {
  bookId: string;
  isVerticallyOriented: boolean;
};

const RATE_OF_UPDATE_MS = 250;

export default function OrderBook(props: OrderBookProps): JSX.Element {
  const { isVerticallyOriented } = props;
  const elOrders = useRef<HTMLDivElement>(null);
  const rowFontSize = parseInt(styles['row-font-size']);
  const rowLineHeight = parseFloat(styles['row-line-height']);
  const rowBottomMargin = parseInt(styles['row-bottom-margin']);
  let numRowsToRender =
    elOrders && elOrders.current
      ? Math.floor(elOrders.current.offsetHeight / (rowFontSize * rowLineHeight + rowBottomMargin)) - 1
      : 0;
  const activeBookState = useSelector(getActiveBookState);
  const isConnecting = activeBookState === 'connecting';
  const isDisconnected = activeBookState === 'disconnected';
  if (isVerticallyOriented) {
    numRowsToRender = Math.floor(numRowsToRender / 2);
  }

  let bids = useSelector((state: RootState) => getSortedBids(state, props)).slice(0, numRowsToRender);
  if(isVerticallyOriented) {
    bids = bids.sort((a, b) => b.total - a.total);
  }
  const asks = useSelector((state: RootState) => getSortedAsks(state, props)).slice(0, numRowsToRender);
  const maxBidSize = bids.length > 0 ? bids[bids.length - 1].total : 0;
  const maxAskSize = asks.length > 0 ? asks[asks.length - 1].total : 0;
  const maxSize = Math.max(maxBidSize, maxAskSize);

  const throttledBids = useThrottle(bids, RATE_OF_UPDATE_MS);
  const throttledAsks = useThrottle(asks, RATE_OF_UPDATE_MS);
  const throttledMaxSize = useThrottle(maxSize, RATE_OF_UPDATE_MS);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.orderHeader}>
          <span>Order Book</span>
          {isDisconnected ? <span className={styles.disconnectedText}>Disconnected</span> : null}
          <OrderBookGroupingDropdown />
        </div>
        <div className={styles.orders} ref={elOrders}>
          {isConnecting ? <OrderBookLoader /> : null}
          <OrderBookColumn
            loading={isConnecting}
            orders={throttledBids}
            maxSize={throttledMaxSize}
            isVerticallyOriented={isVerticallyOriented}
            type="bid"
          />
          <OrderBookColumn
            loading={isConnecting}
            orders={throttledAsks}
            maxSize={throttledMaxSize}
            type="ask"
            isVerticallyOriented={isVerticallyOriented}
          />
        </div>
      </div>
      <div className={styles.actions}>
        <ToggleFeedButton />
        <KillFeedButton />
      </div>
    </>
  );
}

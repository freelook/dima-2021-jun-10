import React, { useEffect } from 'react';
import styles from './App.module.css';
import { subscribeOrderBook } from './components/order-book/orderBookSlice';
import { useAppDispatch } from './app/hooks';
import OrderBook from './components/order-book/OrderBook';
import { useSelector } from 'react-redux';
import { getActiveBookId } from './components/order-book/orderBookSelectors';
import { useWindowWidth } from '@react-hook/window-size';
import cx from 'classnames';

function App(): JSX.Element {
  const dispatch = useAppDispatch();
  const activeBookId = useSelector(getActiveBookId);
  const windowWidth = useWindowWidth();
  const isVerticallyOriented = windowWidth <= 1024;
  const verticalClass = isVerticallyOriented ? 'vertical' : '';

  useEffect(() => {
    dispatch(subscribeOrderBook(activeBookId));
  }, [dispatch, activeBookId]);

  return (
    <div className={cx(styles.app, verticalClass)}>
      <header className={styles.header}>{activeBookId}</header>
      <OrderBook bookId={activeBookId} isVerticallyOriented={isVerticallyOriented} />
    </div>
  );
}

export default App;

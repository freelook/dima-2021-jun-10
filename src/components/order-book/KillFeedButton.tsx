import { useCallback } from 'react';
import { useAppDispatch } from '../../app/hooks';
import Button from '../../components/common/Button';
import DangerIcon from '../../components/common/DangerIcon';
import { killActiveBook, reconnectActiveBook } from './orderBookSlice';
import styles from './OrderBook.module.css';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';

export default function KillFeedButton(): JSX.Element {
  const dispatch = useAppDispatch();
  const activeBookState = useSelector((state: RootState) => state.orderBook.activeBookState);
  const isDisconnected = activeBookState === 'disconnected';
  const handleClick = useCallback(() => {
    if (isDisconnected) {
      dispatch(reconnectActiveBook());
    } else {
      dispatch(killActiveBook());
    }
  }, [dispatch, isDisconnected]);
  const buttonText = isDisconnected ? 'Reconnect' : 'Kill Feed';

  return (
    <Button className={styles.killBtn} onClick={handleClick}>
      <DangerIcon />
      <span>{buttonText}</span>
    </Button>
  );
}

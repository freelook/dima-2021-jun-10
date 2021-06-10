import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../app/hooks';
import Button from '../../components/common/Button';
import ToggleIcon from '../../components/common/ToggleIcon';
import { updateActiveBook } from './orderBookSlice';
import styles from './OrderBook.module.css';
import { getActiveBookId } from './orderBookSelectors';

const FEEDS = ['PI_XBTUSD', 'PI_ETHUSD'];

export default function ToggleFeedButton(): JSX.Element {
  const dispatch = useAppDispatch();
  const activeBookId = useSelector(getActiveBookId);
  const handleClick = useCallback(() => {
    if (activeBookId === FEEDS[0]) {
      dispatch(updateActiveBook(FEEDS[1]));
    } else {
      dispatch(updateActiveBook(FEEDS[0]));
    }
  }, [dispatch, activeBookId]);

  return (
    <Button className={styles.toggleBtn} onClick={handleClick}>
      <ToggleIcon />
      Toggle feed
    </Button>
  );
}

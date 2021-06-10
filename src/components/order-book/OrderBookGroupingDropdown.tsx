import { useSelector } from 'react-redux';
import React, { useCallback } from 'react';
import Select, { StylesConfig } from 'react-select';
import { getActiveBookId, getActiveGrouping } from './orderBookSelectors';
import styles from './OrderBook.module.css';
import { useAppDispatch } from '../../app/hooks';
import { updateGrouping } from './orderBookSlice';

export type GroupValue = {
  value: number;
  label: string;
};
export type GroupRecord = Record<string, Array<GroupValue>>;
export const groupValues: GroupRecord = {
  PI_XBTUSD: [
    { value: 0.5, label: 'Group 0.5' },
    { value: 1, label: 'Group 1.0' },
    { value: 2.5, label: 'Group 2.5' },
  ],
  PI_ETHUSD: [
    { value: 0.05, label: 'Group 0.05' },
    { value: 0.1, label: 'Group 0.1' },
    { value: 0.25, label: 'Group 0.25' },
  ],
};

const customStyles: StylesConfig<GroupValue, true> = {
  option: (provided) => ({
    ...provided,
    width: 150,
    borderBottom: '0',
    color: styles['ghost-white'],
    backgroundColor: styles['mid-gray'],
    padding: 20,
    cursor: 'pointer',
    '&:hover': {
      opacity: 0.8,
    },
  }),
  control: () => ({
    width: 150,
    color: styles['ghost-white'],
    backgroundColor: styles['mid-gray'],
    display: 'flex',
    cursor: 'pointer',
  }),
  singleValue: (provided, state) => {
    const opacity = state.isDisabled ? 0.5 : 1;
    const transition = 'opacity 300ms';

    return {
      ...provided,
      opacity,
      transition,
      color: styles['ghost-white'],
      backgroundColor: styles['mid-gray'],
      fontSize: 16,
    };
  },
  menuList: () => {
    return {
      padding: 0,
    };
  },
};

function OrderBookGroupingDropdown() {
  const dispatch = useAppDispatch();
  const activeBookId = useSelector(getActiveBookId);
  const groupingValue = useSelector(getActiveGrouping);

  const handleValueChanged = useCallback(
    (newVal) => {
      dispatch(updateGrouping(newVal));
    },
    [dispatch],
  );

  return (
    <Select
      value={groupingValue ? groupingValue : groupValues[activeBookId][1]}
      styles={customStyles}
      defaultValue={groupValues[activeBookId][1]}
      name="group"
      options={groupValues[activeBookId]}
      onChange={handleValueChanged}
    />
  );
}

export default React.memo(OrderBookGroupingDropdown);

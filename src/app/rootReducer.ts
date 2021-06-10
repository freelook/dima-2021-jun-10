import { combineReducers } from '@reduxjs/toolkit';
import orderBookReducer from '../components/order-book/orderBookSlice';

export const rootReducer = combineReducers({
  orderBook: orderBookReducer,
});

import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { orderBookMessageHandlerMiddleware } from '../components/order-book/orderBookMessageHandlerMiddleware';
import { rootReducer } from './rootReducer';

export const store = configureStore({
  reducer: rootReducer,
  middleware: [orderBookMessageHandlerMiddleware],
});

export type AppStore = typeof store;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof rootReducer>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;

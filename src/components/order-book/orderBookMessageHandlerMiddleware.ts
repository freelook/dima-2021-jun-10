import { Middleware } from 'redux';
import type { RootState } from '../../app/store';
import OrderBookMessageHandler from './orderBookMessageHandler';
import {
  activeBookConnecting,
  KILL_ACTIVE_BOOK,
  RECONNECT_ACTIVE_BOOK,
  SUBSCRIBE_ORDERBOOK,
  updateActiveBook,
} from './orderBookSlice';

const socketMap: OrderBookMessageHandlerRecord = {};

export type OrderBookMessageHandlerRecord = Record<string, OrderBookMessageHandler>;
export const orderBookMessageHandlerMiddleware: Middleware<Record<string, unknown>, RootState> =
  (storeApi) => (next) => (action) => {
    const activeBook = storeApi.getState().orderBook.activeBookId;
    let actualAction = action;

    switch (action.type) {
      case updateActiveBook.type: {
        if (activeBook in socketMap) {
          socketMap[activeBook].disconnect();
          delete socketMap[activeBook];
        }
        break;
      }
      case SUBSCRIBE_ORDERBOOK: {
        if (activeBook in socketMap) {
          socketMap[activeBook].disconnect();
          delete socketMap[activeBook];
        }
        const orderBookMessageHandler = new OrderBookMessageHandler(action.payload, storeApi.dispatch);
        socketMap[action.payload] = orderBookMessageHandler;
        actualAction = activeBookConnecting();
        break;
      }
      case KILL_ACTIVE_BOOK: {
        if (activeBook in socketMap) {
          socketMap[activeBook].socket.close();
          delete socketMap[activeBook];
        }
        break;
      }
      case RECONNECT_ACTIVE_BOOK: {
        const orderBookMessageHandler = new OrderBookMessageHandler(activeBook, storeApi.dispatch);
        socketMap[activeBook] = orderBookMessageHandler;
        actualAction = activeBookConnecting();
        break;
      }
    }
    return next(actualAction);
  };

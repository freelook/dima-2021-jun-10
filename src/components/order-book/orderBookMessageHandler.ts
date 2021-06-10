import MessageHandler from '../../app/messageHandler';
import { AppDispatch } from '../../app/store';
import { activeBookConnected, bookDisconnected, updateBook } from './orderBookSlice';

export const endpoint = 'wss://www.cryptofacilities.com/ws/v1';

export type Order = Array<{price: number, size: number}>;
export type OrderBookMessage = {
  feed: string;
  product_id: string;
  bids: Array<Order>;
  asks: Array<Order>;
};

export default class OrderBookMessageHandler extends MessageHandler {
  productId: string;
  dispatch: AppDispatch;

  constructor(productId: string, dispatch: AppDispatch) {
    super(productId, endpoint);
    this.productId = productId;
    this.dispatch = dispatch;
  }

  subscribe(productId: string): void {
    this.productId = productId;
    this.sendMessage(
      JSON.stringify({
        event: 'subscribe',
        feed: 'book_ui_1',
        product_ids: [this.productId],
      }),
    );
  }

  unsubscribe(): void {
    this.sendMessage(
      JSON.stringify({
        event: 'unsubscribe',
        feed: 'book_ui_1',
        product_ids: [this.productId],
      }),
    );
  }

  handleMessage(message: MessageEvent): void {
    try {
      const data: OrderBookMessage = JSON.parse(message.data);
      this.dispatch(
        updateBook({
          bookId: data.product_id,
          bids: data.bids,
          asks: data.asks,
        }),
      );
    } catch (err) {
      // pass through invalid messages
    }
  }

  handleConnected(): void {
    this.subscribe(this.productId);
    this.dispatch(activeBookConnected());
  }

  handleDisconnect(): void {
    this.dispatch(bookDisconnected(this.productId));
  }

  disconnect(): void {
    this.unsubscribe();
    super.disconnect();
  }
}

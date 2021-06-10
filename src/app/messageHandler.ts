export default class MessageHandler {
  id: string;
  socket: WebSocket;

  constructor(id: string, socketUrl: string) {
    this.id = id;
    this.socket = new WebSocket(socketUrl);
    this.socket.onopen = () => {
      this.addEventListeners();
      this.handleConnected();
    };
  }

  addEventListeners(): void {
    this.socket.onmessage = (message: MessageEvent) => {
      this.handleMessage(message);
    };

    this.socket.onclose = () => {
      this.handleDisconnect();
    };

    this.socket.onerror = () => {
      this.handleError();
    };
  }

  sendMessage(message: string): void {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    }
  }

  disconnect(): void {
    this.socket.close();
  }

  handleMessage(message: MessageEvent): void {
    // handle message
  }

  handleConnected(): void {
    // handle connected
  }

  handleDisconnect(): void {
    // handle disconnect
  }

  handleError(): void {
    // handle error
  }
}

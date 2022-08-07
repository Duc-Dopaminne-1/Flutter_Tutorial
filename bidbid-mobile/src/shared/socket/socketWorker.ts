export class SocketWorker {
  isConnected(socket: any): boolean {
    return socket ? socket.connected : false;
  }

  emitSocket(socket: any, eventName: string, param: any) {
    if (socket) {
      socket.emit(eventName, param);
    }
  }

  addEventListener(socket: any, eventName: string, listener: (e: any) => void) {
    if (socket) {
      socket.on(eventName, listener);
    }
  }

  isDisconnected(socket: any): boolean {
    return socket ? socket.disconnected : false;
  }
}

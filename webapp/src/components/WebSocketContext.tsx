import { io, Socket } from 'socket.io-client';
import React, { createContext, PropsWithChildren } from 'react';

const WebSocketContext = createContext<Socket | null>(null);
let websocket: Socket | null = null;
export const WebSocketProvider = ({ children }: PropsWithChildren<{}>) => {
  if (!websocket) {
    websocket = io(process.env.REACT_APP_API_ORIGIN || {});
  }
  return (
    <WebSocketContext.Provider value={websocket}>
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketContext;

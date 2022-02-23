import { io, Socket } from 'socket.io-client';

let socket: Socket;
const useSocket = () =>
  socket || (socket = io(process.env.REACT_APP_API_ORIGIN || {}));

export default useSocket;

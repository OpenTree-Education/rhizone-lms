import { io, Socket } from 'socket.io-client';

let socket: Socket;
const useSocket = () =>
  socket ||
  (socket = io(String(process.env.REACT_APP_API_ORIGIN), {
    withCredentials: true,
  }));

export default useSocket;

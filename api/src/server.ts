import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { Server } from 'socket.io';
import { createServer } from 'http';

/*
app.listen(app.get('port'), app.get('host'), () => {
  const host = app.get('host');
  const port = app.get('port');
  console.log(`api listening on port ${host}:${port}`);
});
*/

const httpServer = createServer(app);
const io = new Server(httpServer, {
  path: '/collab',
  cors: {
    origin: process.env.WEBAPP_ORIGIN,
    methods: ['GET', 'POST'],
  },
});

const agendaTextArr: string[] = [];

io.on('connection', socket => {
  console.log('user is connected');
  socket.on('send-agenda-text', agendaText => {
    agendaTextArr.push(agendaText);
    socket.broadcast.emit('recieve-agenda-text', agendaTextArr);
    console.log(agendaText, agendaTextArr);
  });
});

httpServer.listen(app.get('port'), app.get('host'), () => {
  const host = app.get('host');
  const port = app.get('port');
  console.log(`api listening on port ${host}:${port}`);
});

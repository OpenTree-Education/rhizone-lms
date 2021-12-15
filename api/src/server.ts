import dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';
dotenv.config();
import { createServer } from 'http';
import { Server } from 'socket.io';
import app, { sessionMiddleware } from './app';
import { UnauthorizedError } from './httpErrors';

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.WEBAPP_ORIGIN,
    methods: ['GET', 'POST'],
  },
});
io.use((socket, next) => {
  const req = socket.request as Request;
  const res = req.res as Response;
  sessionMiddleware(req, res || ({} as Response), next as NextFunction);
});

io.use((socket, next) => {
  const req = socket.request as Request;
  if (!req.session.principalId) {
    next(new UnauthorizedError('Please log in to connect with websocket'));
  } else {
    next();
  }
});

io.on('connect', socket => {
  app.set('socketio', socket);
  // const req = socket.request as Request
});

server.listen(app.get('port'), app.get('host'), () => {
  const host = app.get('host');
  const port = app.get('port');
  console.log(`api listening on port ${host}:${port}`);
});

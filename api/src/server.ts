import dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';
dotenv.config();
import { createServer } from 'http';
import { Server } from 'socket.io';

import app, { configureApp, mountAppRoutes } from './app';
import { getSessionMiddleware } from './authMiddleware';
import { UnauthorizedError } from './httpErrors';

declare module 'express-serve-static-core' {
  export interface Request {
    io?: Server;
  }
}
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.WEBAPP_ORIGIN,
    methods: ['GET', 'POST'],
    credentials: true,
  },
  serveClient: false,
});

io.use((socket, next) => {
	const secure = app.get('secure')
  const sessionMiddleware = getSessionMiddleware(secure);
  sessionMiddleware(
    socket.request as Request,
    {} as Response,
    next as NextFunction
  );
});

io.use((socket, next) => {
  const req = socket.request as Request;
  if (!req.session.principalId) {
    next(new UnauthorizedError('Please log in to connect with websocket'));
  } else {
    next();
  }
});
configureApp(app);
app.use((req, res, next) => {
  req.io = io;
  next();
});
mountAppRoutes(app);

server.listen(app.get('port'), app.get('host'), () => {
  const host = app.get('host');
  const port = app.get('port');
  console.log(`api listening on port ${host}:${port}`);
});

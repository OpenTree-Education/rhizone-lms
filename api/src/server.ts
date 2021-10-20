import * as bodyParser from 'body-parser';
import express from 'express';
import helmet from 'helmet';
import session from 'express-session';

const app = express();

app.use(helmet());

app.use(bodyParser.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'default session secret',
    name: 'session_id',
    resave: true,
    saveUninitialized: true,
    cookie: {
      sameSite: true,
      secure: true,
    },
  })
);

app.get('/', (_, res) => {
  res.json({});
});

const port = process.env.PORT || 8491;

app.listen(port, () => {
  console.log(`api listening on port ${port}`);
});

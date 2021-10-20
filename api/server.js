const bodyParser = require('body-parser');
const express = require('express');
const helmet = require('helmet');
const session = require('express-session');

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

app.get('/', (req, res) => {
  res.json({});
});

const port = process.env.PORT || 8491;

app.listen(port, () => {
  console.log(`api listening on port ${port}`);
});

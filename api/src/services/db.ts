import knex from 'knex';

import { findConfig } from './configService';

const db = knex({
  client: 'mysql',
  connection: {
    database: findConfig('MYSQL_DATABASE', ''),
    host: findConfig('MYSQL_HOST', 'localhost'),
    password: findConfig('MYSQL_PASSWORD', ''),
    user: findConfig('MYSQL_USER', ''),
  },
});

export default db;

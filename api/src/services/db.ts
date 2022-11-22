import knex from 'knex';
import { DateTime, IANAZone } from 'luxon';

import { findConfig } from './configService';

// Calculate the numerical time zone offset for the specified time zone
// at the current moment. (mysqljs doesn't support IANA time zones.)
const tzOffset = new IANAZone(
  findConfig('TZ', 'America/Los_Angeles')
).formatOffset(DateTime.now().toMillis(), 'short');

const db = knex({
  client: 'mysql',
  connection: {
    database: findConfig('MYSQL_DATABASE', ''),
    host: findConfig('MYSQL_HOST', 'localhost'),
    password: findConfig('MYSQL_PASSWORD', ''),
    user: findConfig('MYSQL_USER', ''),
    timezone: tzOffset,
    dateStrings: true,
  },
});

export default db;

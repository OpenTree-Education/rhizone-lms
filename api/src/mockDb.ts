import { getTracker, mock as mockKnex } from 'mock-knex';

import db from './db';

mockKnex(db);
export const tracker = getTracker();

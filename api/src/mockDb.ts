import mockKnex from 'mock-knex';

import db from './db';

mockKnex.mock(db);

export const tracker = mockKnex.getTracker();

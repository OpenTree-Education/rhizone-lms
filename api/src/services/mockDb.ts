import mockKnex from 'mock-knex';

import db from './db';

mockKnex.mock(db);

const tracker = mockKnex.getTracker();

declare interface MockedQuery {
  bindings?: unknown[];
  response?: unknown;
  sql: string;
}

const mockedQueries: Map<MockedQuery, boolean> = new Map();

beforeEach(() => {
  tracker.install();
  tracker.on('query', ({ bindings, response, sql }) => {
    for (const mockedQuery of mockedQueries.keys()) {
      if (sql === mockedQuery.sql) {
        expect(bindings).toEqual(mockedQuery.bindings);
        response(mockedQuery.response);
        mockedQueries.set(mockedQuery, true);
        return;
      }
    }
    // istanbul ignore next
    throw new Error(
      `Error: Unexpected query.\n\tsql=${JSON.stringify(
        sql
      )}\n\tbindings=${JSON.stringify(bindings)}`
    );
  });
});

afterEach(() => {
  for (const [{ bindings, response, sql }, wasCalled] of mockedQueries) {
    // istanbul ignore next
    if (!wasCalled) {
      throw new Error(
        `Error: Mocked query was never called.\n\tsql=${JSON.stringify(
          sql
        )}\n\tbindings=${JSON.stringify(bindings)}\n\tresponse=${JSON.stringify(
          response
        )}`
      );
    }
  }
  mockedQueries.clear();
  tracker.uninstall();
});

export const mockQuery = (
  sql: string,
  bindings?: unknown[],
  response?: unknown
) => {
  mockedQueries.set({ bindings, response, sql }, false);
};

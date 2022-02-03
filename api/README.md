# `api`

The `api` module is an [Express v4](https://expressjs.com/en/api.html) app.

## Getting Started

1. Ensure you are using the right version of Node and Yarn. If you have `nvm`,
   run `nvm use`. To install Yarn globally for the current managed version of
   Node, run `npm install --global yarn`.
2. Install project dependencies with `yarn install`.
3. Run the development server with `yarn develop`.
4. If needed, update any environment variables related to this project in the
   shared `.env` file one directory above this one.

## Hints and troubleshooting

### Debug messages

Express and many of its modules use
[`debug`](https://www.npmjs.com/package/debug). To view all debug messages, set
the `DEBUG` environment variable to `*`. This can be in a number of places, but
if the dev server is already running, the most convenient place might be in the
code itself. Try adding the following line to the top of `src/server.ts` and
saving the file.

```typescript
process.env.DEBUG = '*';
```

Nodemon should restart the server and the console will have debug messages.

## Testing

To run the tests, run `yarn test`.

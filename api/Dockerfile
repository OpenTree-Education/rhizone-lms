FROM node:16.13-alpine AS build
WORKDIR /app/
COPY ./ ./
RUN yarn install --ignore-platform --frozen-lockfile
RUN yarn build

FROM node:16.13-alpine
WORKDIR /app/
COPY --from=build /app/dist/ ./dist/
COPY --from=build /app/package.json /app/yarn.lock ./
ENV NODE_ENV=production
RUN yarn install --frozen-lockfile && yarn cache clean
CMD yarn start

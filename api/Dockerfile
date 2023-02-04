FROM node:18.14-alpine AS build
WORKDIR /app/
COPY package.json yarn.lock ./
RUN yarn install --ignore-platform --frozen-lockfile --network-timeout 600000
COPY ./ ./
RUN yarn build

FROM node:18.14-alpine
WORKDIR /app/
COPY --from=build /app/dist/ ./dist/
COPY --from=build /app/package.json /app/yarn.lock ./
COPY --from=build /usr/local/share/.cache/yarn/ /usr/local/share/.cache/yarn/
ENV NODE_ENV=production
RUN yarn install --frozen-lockfile --network-timeout 600000 --production && yarn cache clean
CMD yarn start

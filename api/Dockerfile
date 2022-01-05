FROM node:16
WORKDIR /api
COPY package.json yarn.lock /api/
RUN yarn install
CMD yarn start

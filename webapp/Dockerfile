FROM node:16
WORKDIR /webapp
COPY package.json yarn.lock /webapp/
RUN yarn install
CMD yarn start

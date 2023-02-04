FROM node:18.14-alpine AS build
ARG REACT_APP_API_ORIGIN
ENV REACT_APP_API_ORIGIN $REACT_APP_API_ORIGIN
ARG REACT_APP_ROLLBAR_ACCESS_TOKEN
ENV REACT_APP_ROLLBAR_ACCESS_TOKEN $REACT_APP_ROLLBAR_ACCESS_TOKEN
WORKDIR /app/
COPY package.json yarn.lock ./
RUN yarn install --ignore-platform --frozen-lockfile --network-timeout 600000
COPY ./ ./
RUN yarn build

FROM nginx:1.23-alpine
COPY ./default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build/ /usr/share/nginx/html/

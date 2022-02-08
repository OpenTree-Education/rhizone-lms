FROM node:16.13-alpine AS build
ARG REACT_APP_API_ORIGIN
ENV REACT_APP_API_ORIGIN $REACT_APP_API_ORIGIN
WORKDIR /app/
COPY ./ ./
RUN yarn install --ignore-platform --frozen-lockfile
RUN yarn build

FROM nginx:1.21-alpine
COPY ./default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build/ /usr/share/nginx/html/

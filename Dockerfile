FROM node:24-slim AS builder

WORKDIR /app

COPY package.json package-lock.json /app/
RUN npm ci

COPY . /app/

RUN npm run build

FROM nginxinc/nginx-unprivileged:1.29 AS server

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

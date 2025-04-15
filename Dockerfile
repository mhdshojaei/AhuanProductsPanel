FROM node:22.14.0-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

FROM alpine:latest AS production

WORKDIR /dist
COPY --from=builder /app/dist .


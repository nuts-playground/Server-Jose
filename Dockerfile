# Build Local
FROM node:18.16.0 AS development
RUN npm install -g pnpm@8.12.0

WORKDIR /usr/src/app

COPY pnpm-lock.yaml ./

RUN pnpm fetch --prod

COPY . .

RUN pnpm install

# Build Production
FROM node:18.16.0 AS builder
RUN npm install -g pnpm@8.12.0

WORKDIR /usr/src/app

COPY pnpm-lock.yaml ./

COPY --from=development /usr/src/app/node_modules ./node_modules

COPY . .

RUN pnpm build

# Production
FROM node:18.16.0-alpine AS production

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist ./dist

CMD ["node", "dist/main.js"]
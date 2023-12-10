# Build Local
FROM node:18.16.0 AS development
RUN npm install -g pnpm@8.12.0

WORKDIR /usr/src/app

COPY pnpm-lock.yaml ./

RUN pnpm fetch --prod

COPY . .

RUN pnpm install

RUN pnpm prisma init --datasource-provider mysql

RUN pnpm prisma generate

# Build Production
FROM node:18.16.0 AS builder
RUN npm install -g pnpm@8.12.0

WORKDIR /usr/src/app

COPY pnpm-lock.yaml ./

COPY --from=development /usr/src/app/node_modules ./node_modules

COPY --from=development /usr/src/app/prisma ./prisma

COPY . .

RUN pnpm build

RUN pnpm install --prod

# Production
FROM node:18.16.0-alpine AS production

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma

CMD ["node", "dist/main.js"]
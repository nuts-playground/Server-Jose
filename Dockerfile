# Build Local
FROM node:18.16.0 AS development

WORKDIR /usr/src/app

COPY pnpm-lock.yaml ./

RUN pnpm fetch --prod

COPY . .

RUN pnpm install


# Build Production
FROM node:18.16.0 AS builder

WORKDIR /usr/src/app

COPY pnpm-lock.yaml ./

COPY --from=development /usr/src/app/node_modules ./node_modules

COPY . .

RUN pnpm build

ENV NODE_ENV production

RUN pnpm install --prod

# Production
FROM node:18.16.0-alpine AS production

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist

CMD ["node", "dist/main.js"]
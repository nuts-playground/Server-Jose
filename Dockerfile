# Development
FROM node:18.16.0 AS development
RUN npm install -g pnpm@8.12.0

WORKDIR /usr/src/app

COPY pnpm-lock.yaml ./

RUN pnpm fetch --prod

COPY . .

RUN pnpm install

# Production
FROM node:18.16.0-alpine AS production

WORKDIR /usr/src/app

COPY --from=development /usr/src/app/node_modules ./node_modules
COPY . .

RUN pnpm build
RUN pnpm install --prod

CMD ["node", "dist/main.js"]
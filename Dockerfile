FROM node:18.16.0-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

FROM node:18.16.0-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --production --frozen-lockfile

COPY --from=builder /app/dist ./dist
# COPY --from=builder /app/dist /app/dist
# COPY --from=builder /app/.pnp.cjs /app/.pnp.cjs
# COPY --from=builder /app/.pnp.loader.mjs /app/.pnp.loader.mjs
# COPY --from=builder /app/.yarnrc.yml /app/.yarnrc.yml
# COPY --from=builder /app/.yarn /app/.yarn
# COPY --from=builder /app/package.json /app/package.json
# COPY --from=builder /app/yarn.lock /app/yarn.lock

CMD ["yarn", "start:prod"]
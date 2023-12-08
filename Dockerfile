FROM node:18.16.0-alpine AS build

ENV NODE_ENV production

WORKDIR /app

COPY . .

RUN yarn install

RUN yarn build

FROM node:18.16.0-alpine

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/.pnp.cjs ./.pnp.cjs
# COPY --from=build /app/.pnp.loader.mjs /app/.pnp.loader.mjs
COPY --from=build /app/.yarnrc.yml ./.yarnrc.yml
COPY --from=build /app/.yarn ./.yarn
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/yarn.lock ./yarn.lock

# yarn berry 4.x 부터는 Zero Install 지원하지 않음
# RUN yarn install

EXPOSE 3000

ENV NODE_ENV production

CMD ["yarn", "start:prod"]
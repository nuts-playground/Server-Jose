FROM node:18.16.0-alpine AS build

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

RUN ls .yarn
RUN ls ./.yarn

EXPOSE 3000

CMD ["yarn", "start:prod"]
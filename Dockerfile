FROM node:18.16.0-alpine AS build

RUN apk add --no-cache tzdata && \
    echo 'Etc/UTC' > /etc/timezone

WORKDIR /usr/src/app

COPY . .

RUN yarn install

RUN yarn build

FROM node:18.16.0-alpine

WORKDIR /app

COPY --from=build /usr/src/app/dist /app/dist
COPY --from=build /usr/src/app/.pnp.cjs /app/.pnp.cjs
# COPY --from=build /usr/src/app/.pnp.loader.mjs /app/.pnp.loader.mjs
COPY --from=build /usr/src/app/.yarnrc.yml /app/.yarnrc.yml
COPY --from=build /usr/src/app/.yarn /app/.yarn 
COPY --from=build /usr/src/app/package.json /app/package.json
COPY --from=build /usr/src/app/yarn.lock /app/yarn.lock

EXPOSE 3000

CMD ["yarn", "start:prod"]
FROM node:18.16.0-alpine AS build

RUN apk add --no-cache tzdata && \
    echo 'Etc/UTC' > /etc/timezone

WORKDIR /usr/src/app

COPY . .

RUN yarn install

RUN yarn build

FROM node:18.16.0-alpine

WORKDIR /app

COPY --from=build /usr/src/app/dist ./
COPY --from=build /usr/src/app/.pnp.cjs ./.pnp*
COPY --from=build /usr/src/app/.yarnrc.yml ./
COPY --from=build /usr/src/app/.yarn ./.yarn 
COPY --from=build /usr/src/app/package.json ./package.json
COPY --from=build /usr/src/app/yarn.lock ./yarn.lock

EXPOSE 3000

CMD ["yarn", "start:prod"]
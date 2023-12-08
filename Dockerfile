FROM node:18.16.0-alpine

WORKDIR /usr/src/app

COPY . .

RUN yarn install

RUN yarn build

FROM node:18.16.0-alpine

WORKDIR /app

COPY --from=build /usr/src/app/dist /nest-dev/app/dist
COPY --from=build /usr/src/app/.pnp.cjs /nest-dev/app/.pnp.cjs
COPY --from=build /usr/src/app/.pnp.loader.mjs /nest-dev/app/.pnp.loader.mjs
COPY --from=build /usr/src/app/.yarnrc.yml /nest-dev/app/.yarnrc.yml
COPY --from=build /usr/src/app/.yarn /nest-dev/app/.yarn 
COPY --from=build /usr/src/app/package.json /nest-dev/app/package.json
COPY --from=build /usr/src/app/yarn.lock /nest-dev/app/yarn.lock

EXPOSE 3000

CMD ["yarn", "start:prod"]
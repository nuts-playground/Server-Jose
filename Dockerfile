FROM node:18.16.0

RUN mkdir -p /app
WORKDIR /app
COPY . .
RUN yarn install
RUN yarn build

FROM node:18.16.0-alpine
WORKDIR /app
COPY --from=builder /app ./

CMD ["yarn", "start:prod"]
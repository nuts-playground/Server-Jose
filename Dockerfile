FROM node:18.16.0-alpine

WORKDIR /usr/src/app

COPY package.json .
COPY .yarn .
COPY . .

RUN yarn install
RUN yarn build

CMD ["yarn", "start:prod"]
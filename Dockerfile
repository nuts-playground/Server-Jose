FROM node:18.16.0-alpine
WORKDIR /app

COPY package.json .
COPY .yarn .
ADD . .
RUN yarn install
RUN yarn build

CMD ["yarn", "start:prod"]
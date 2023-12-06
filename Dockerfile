FROM node:18.16.0
WORKDIR /app

COPY package.json .
ADD . .
RUN yarn install
RUN yarn build

CMD ["yarn", "start:prod"]
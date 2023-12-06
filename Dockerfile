FROM node:18.16.0-alpine
WORKDIR /

COPY package.json .
ADD . .
RUN yarn install
RUN yarn build

EXPOSE 3000
CMD ["yarn", "start:prod"]
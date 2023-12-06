FROM node:18.16.0-alpine
WORKDIR /

RUN yarn install
RUN yarn build

EXPOSE 3000
CMD ["yarn", "start:prod"]
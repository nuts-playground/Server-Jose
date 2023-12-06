# FROM node:18.16.0
# WORKDIR /app

# COPY package.json .
# ADD . .
# RUN yarn install
# RUN yarn build

# EXPOSE 3000
# CMD ["yarn", "start:prod"]


FROM node:18.16.0

WORKDIR /app

COPY package.json ./

RUN yarn install

COPY . .

RUN yarn build

FROM node:18.16.0

WORKDIR /app

COPY package.json ./

RUN yarn install

COPY . .

COPY --from=development /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main"]
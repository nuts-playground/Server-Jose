# FROM node:18.16.0
# WORKDIR /app

# COPY package.json .
# ADD . .
# RUN yarn install
# RUN yarn build

# EXPOSE 3000
# CMD ["yarn", "start:prod"]


FROM node:18.16.0 As development

WORKDIR /app

COPY package*.json ./

RUN yarn install --only=development

COPY . .

RUN yarn build

FROM node:18.16.0 as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

COPY package*.json ./

RUN yarn install --only=production

COPY . .

COPY --from=development /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main"]
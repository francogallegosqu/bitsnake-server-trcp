FROM node:16.3.0-alpine

WORKDIR /usr/local

COPY package.json ./

RUN npm install && npm cache clean --force

WORKDIR /usr/local/app

COPY . .

EXPOSE 3000
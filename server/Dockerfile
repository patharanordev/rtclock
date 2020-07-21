FROM node:10-alpine

WORKDIR /app

COPY ./package.json .

RUN apk add --no-cache && npm i

COPY . .

EXPOSE 3000

CMD ["node", "server"]
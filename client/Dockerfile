FROM node:10-alpine

WORKDIR /app

COPY ./package.json .

RUN apk add --no-cache && npm i

COPY . .
RUN chmod +x /app/docker-entrypoint.sh

EXPOSE 3000

CMD ["sh", "docker-entrypoint.sh"]
CMD ["npx", "serve", "out", "-p", "3000"]
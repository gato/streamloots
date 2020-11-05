FROM node:15.1.0-alpine3.12 AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
COPY build.ts ./
COPY ./src ./src
RUN npm ci --quiet && npm run compile

FROM node:15.1.0-alpine3.12

RUN mkdir -p /app/dist                  
WORKDIR /app                            
COPY package*.json ./                   
RUN npm i --only=production             
COPY .env ./
COPY ./public ./public
COPY --from=builder /app/dist ./dist

ENV MONGODB_HOST=mongo
ENV MONGODB_PORT=27017

EXPOSE 3000
ENTRYPOINT ["node", "./dist/index.js"]
# Streamloots

Streamloots Card API

## Quick Start

This API needs a MongoDB running, by default it will look for it in localhost:27017 but you could change that by editing .env file in the root of the directory or setting environment variables
```shell
export MONGODB_HOST=localhost
export MONGODB_PORT=27017
```

Get started developing...

```shell
# install deps
npm install

# run in development mode
npm run dev
```

## Try It
Open you're browser to [http://localhost:3000](http://localhost:3000). This will open the swagger interfase of the api.

Invoke the `/cards` endpoint.
```shell
curl http://localhost:3000/api/v1/cards
```

## Docker
Project has been completely dockerized. There is a Dockerfile that creates a running image. And also there is a docker-compose file that will start 3 containers and run mongo, mongo web client, and build and deploy the API. so you just need to run 

```
docker-compose up 
```
in project root and will have api accessible @ localhost:3000 
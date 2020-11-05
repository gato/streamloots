# streamloots

Streamloots Card API

## Quick Start

Get started developing...

```shell
# install deps
npm install

# run in development mode
npm run dev

```

---

## How do I modify the example API and make it my own?

There are two key files:
1. `src/routes.js` - This references the implementation of all of your routes. Add as many routes as you like and point each route your express handler functions.
2. `src/common/api.yaml` - This file contains your [OpenAPI spec](https://swagger.io/specification/). Describe your API here. It's recommended that you to declare any and all validation logic in this YAML. `express-no-stress-typescript`  uses [express-openapi-validator](https://github.com/cdimascio/express-openapi-validator) to automatically handle all API validation based on what you've defined in the spec.

## Install Dependencies

Install all package dependencies (one time operation)

```shell
npm install
```

## Run It
#### Run in *development* mode:
Runs the application is development mode. Should not be used in production

```shell
npm run dev
```

or debug it

```shell
npm run dev:debug
```

#### Run in *production* mode:

Compiles the application and starts it in production production mode.

```shell
npm run compile
npm start
```

## Try It
* Open you're browser to [http://localhost:3000](http://localhost:3000)
* Invoke the `/cards` endpoint 
  ```shell
  curl http://localhost:3000/api/v1/cards
  ```


## Debug It

#### Debug the server:

```
npm run dev:debug
```
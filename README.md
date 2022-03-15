## Installation

```bash
$ npm install
```
## Database (dev) need Docker installed

```bash
$ docker-compose up -d
```
## Migration

### Run
```bash
$ npm run typeorm migration:run
```
### Create
```bash
$ npm run typeorm:migration:run CreateUser
```

### Seed

```bash
$ npm run seed migration:run
```
## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Swagger (API Documentation)

```
http://localhost:8000/docs
```


## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

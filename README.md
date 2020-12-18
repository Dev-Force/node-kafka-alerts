
# node-kafka-alerts

Tired of writing code every time you need to send an alert/notification? 
Then this repository is made for you.

I 've given life to this repository since we usually need to notify our application users for an event. This can be for example an email or an SMS which a user should receive after a certain event has happened (either from himself/herself or from another source).

This application supports instant notifications (which are sent directly to the end-users) and two types of windowed alerts/notifications. The first is notifying the end-user once for every alert/notification we should receive but discards duplicate values for the given window dynamically. The second is that is groups all notifications sent in the last time window and uses a batch template to show them all to the end user.

Templates should be already in place by the developer who's deploying the application and they should reside in `templates` folder.

## Installation

### Development

```bash
npm install
cp .env.example .env
```

Change .env values to the correct ones.

Also check `config/default.json` file in order to change configuration values to your liking.

  
### Production

 ```bash
cp .env.example .env
cp config/default.json config/production.json
```

Change `.env` values to the correct ones including setting `COMPOSE_FILE` variable to `docker-compose.yml:docker-compose.prod.yml`.
Change `config/production.json` file in order to change configuration values to your liking.


## Commands

### Make 

- `make build-and-run` *(Build docker container and run the application)*

### NPM Commands

- `start:dist` => node ./dist/index.js *(Runs transpiled Javascript from `dist` folder)*
- `start:watch` => nodemon *(Runs nodemon and listens to file changes)*
- `start:dev` => ts-node src/index.ts *(Runs index.ts directly without any transpilation)*
- `build` => tsc *(Transpiles Typescript to Javascript and places it to `dist` folder)*
- `coverage` => nyc -r lcov -e .ts -x "*.test.ts" npm run test *(Runs tests)*
- `prettier:check` => prettier --check ./src *(Checks if the formatting is OK)*
- `prettier:format` => prettier --write ./src *(Formats the codebase)*
- `eslint` => eslint ./src *(Checks for linting issues)*

## Features

Enforces *Clean Architecture's Dependency Rule* using *ESLint*.
Uses *prettier* for *formatting*.
Uses *husky* for *git hooks*.
Uses *pm2* for production deployments.
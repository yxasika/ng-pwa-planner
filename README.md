# Planner

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.3.4.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Local PWA deployment

First run `ng build --prod` to build a production level version of this application including the service-worker (needed for an installable pwa).
The build artifacts will be stored in the `dist/` directory.

For the deployment, you can use any installed webserver like `serve` for example.
To install `serve`, run `npm install serve --dev` (you can install it globally with the `-g` flag).

After the installation-process completed,
run `serve dist/planner` to serve the web assets. Now you can visit and install the resulting pwa on `http://localhost:5000/` or the path specified at console output
(be sure to use the `localhost:*` path instead of the explicit ip-address, otherwise the app won't be installable in browser).

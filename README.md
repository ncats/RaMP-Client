# RaMP DB Web Client and API

This are the web client and API for the RaMP DB R package. You can find details on the capabilities on its repository (https://github.com/ncats/RaMP-DB).

## Technology Stack

- [TypeScript](https://www.typescriptlang.org/)
- [Angular](https://angular.io/)
- [Angular CLI](https://github.com/angular/angular-cli)
- [Angular Material](https://material.angular.io/) based on [Google's Material Design methodology](https://material.io/design/)
- [R](https://www.r-project.org/)

## Dependencies

To run this application localy or on a server, you'll need to have the following software installed:

- [Node](https://nodejs.org/en/)
- [npm](https://www.npmjs.com/) - usually included in the node installation
- Angular CLI - after you install npm, on any command line run `npm install -g @angular/cli@latest`
- Optional: [Docker](https://docs.docker.com/), if you want to run the application in a container

## Running the Applications

There are two application to run, the client and the API. They communicate with each other via the HTTPS protocol and send data back and forth in JSON format.

Please follow [these instructions](apps/ramp-client/CLIENT_INSTRUCTIONS.md) to run the client application and [these instructions](apps/ramp-server/SERVER_INSTRUCTIONS.MD) to run the API.

## API

API documentation can be found [here](https://rampdb.nih.gov/api)

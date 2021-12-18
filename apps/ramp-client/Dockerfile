FROM node:16-alpine AS build
# Set the source folder
ARG SOURCE_FOLDER="./"
ARG BUILD_VERSION
ARG NPM_TOKEN
# Create app directory
WORKDIR /var/www/app

# Get all the code needed to run the app
COPY --from=buildContainer /app/dist/ramp-client /app/dist/ramp-client

# Bundle app source
COPY ${SOURCE_FOLDER} .
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh && \
    npm config set unsafe-perm true && \
    echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > .npmrc && \
    npm i --quiet --cache=./npm-cache && \
    npm i -g @angular/cli && \
    npm run build && \
  rm -f .npmrc
FROM labshare/docker-base-web
COPY --from=build /var/www/app/dist/ /var/www/app

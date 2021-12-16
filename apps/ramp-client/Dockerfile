FROM node:12-alpine AS build
# Set the source folder
ARG SOURCE_FOLDER="./"
ARG BUILD_VERSION
ARG NPM_TOKEN
# Create app directory
WORKDIR /var/www/app
# Bundle app source
COPY ${SOURCE_FOLDER} .
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh && \
    npm config set unsafe-perm true && \
    echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > .npmrc && \
    npm i --quiet --cache=./npm-cache && \
    npm i -g @angular/cli && \
    ng build --configuration=production && \
  rm -f .npmrc
FROM labshare/docker-base-web
COPY --from=build /var/www/app/dist/ /var/www/app

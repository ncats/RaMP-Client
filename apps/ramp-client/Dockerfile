FROM node:16.10-alpine AS build

# Set the source folder
ARG SOURCE_FOLDER="./"

# Create app directory
WORKDIR /var/www/app
COPY ${SOURCE_FOLDER} .

# Bundle app source
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh && \
    npm config set unsafe-perm true && \
    npm i -g @angular/cli && \
    npm install -g nx && \
    npm i && \
    NODE_OPTIONS=--max_old_space_size=4096 nx run ramp-client:prerender:production --verbose

FROM registry.ncats.nih.gov:5000/labshare/docker-base-web

# Install NCATS required packages
RUN apt-get update && apt-get install -y net-tools

COPY --from=build /var/www/app/dist/ramp-client/browser /var/www/app

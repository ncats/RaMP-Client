FROM node:18.16-alpine3.17 AS build

ENV npm_config_unsafe_perm=true

# Set the source folder
ARG SOURCE_FOLDER="./"

# Create app directory
WORKDIR /var/www/app

COPY ${SOURCE_FOLDER} .

# Bundle app source
RUN apk update && apk upgrade
RUN apk add --no-cache bash git openssh
#RUN npm install --unsafe-perm=true
#RUN npm config set unsafe-perm true
RUN npm i -g @angular/cli
RUN npm install -g nx
RUN npm install
RUN nx g @nrwl/workspace:fix-configuration
RUN npm i
RUN NODE_OPTIONS=--max_old_space_size=4096 nx run ramp-client:prerender:production --verbose

FROM registry.ncats.nih.gov:5000/labshare/docker-base-web

# Install NCATS required packages
RUN apt-get update && apt-get install -y net-tools

# Add read permissions to all files under assets directory
RUN chmod -R o+r assets/*
RUN echo "Checkout assets file permissions" && ls -la assets/*

COPY --from=build /var/www/app/dist/ramp-client/browser /var/www/app

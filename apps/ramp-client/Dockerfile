FROM node:16-alpine AS build
# Set the source folder
ARG SOURCE_FOLDER="./"

# Create app directory
WORKDIR /var/www/app

# Bundle app source
COPY ${SOURCE_FOLDER} .
FROM labshare/docker-base-web

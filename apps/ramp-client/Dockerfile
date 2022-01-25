FROM node:16-alpine AS build

# Set the source folder
ARG SOURCE_FOLDER="./"

# Create app directory
WORKDIR /var/www/app
COPY ${SOURCE_FOLDER} .

# Bundle app source
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh && \
    npm config set unsafe-perm true && \
    npm i && \
    npm i -g @angular/cli && \
    NODE_OPTIONS=--max_old_space_size=4096 ng build ramp-client --prod

FROM labshare/docker-base-web

# Install NCATS required packages
RUN apt-get update && apt-get install -y net-tools

COPY --from=build /var/www/app/dist/apps/ramp-client/ /var/www/app

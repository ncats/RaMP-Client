FROM node:16-alpine as buildContainer
# Set the source folder
ARG SOURCE_FOLDER="./"
ARG BUILD_VERSION
ARG NPM_TOKEN
# Create app directory
WORKDIR /var/www/app
# Bundle app source
COPY ${SOURCE_FOLDER} .

RUN npm install -g npm@7.24.0
RUN npm install

# max-old-space is needed to avoid any compilation issues because of missing memory
ENV NODE_OPTIONS --max-old-space-size=4096
RUN npm run build

# Create app directory
WORKDIR /var/www/app

# Get all the code needed to run the app
COPY --from=buildContainer /app/dist/ramp-client /app/dist/ramp-client

# Bundle app source
COPY ${SOURCE_FOLDER} .
FROM labshare/docker-base-web

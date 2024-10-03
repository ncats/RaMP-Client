FROM node:20.11-alpine3.18 AS build

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
RUN NODE_OPTIONS=--max_old_space_size=8192 nx run ramp-client:build:production --verbose

# FROM registry.ncats.nih.gov:5000/labshare/docker-base-web

# # Install NCATS required packages
# RUN apt-get update && apt-get install -y net-tools

# COPY --from=build /var/www/app/dist/ramp-client/browser /var/www/app

# # Add read permissions to all files under assets directory
# RUN chmod -R o+r /var/www/app/assets/*
# # RUN echo "Checkout assets file permissions" && ls -la /var/www/app/assets/*

# Stage 2: Nginx configuration stage
FROM ncats/docker-base-web:latest AS nginx-conf

# Stage 3: Final nginx image
FROM nginx:stable-alpine-slim

# Copy the build output and nginx configuration
COPY --from=build /var/www/app/dist/ramp-client/browser /var/www/app
COPY --from=nginx-conf /etc/nginx/conf.d/app-nginx.conf /etc/nginx/conf.d

# Set ownership and permissions for NGINX directories, files and create the Nginx process ID file
RUN chown -R nginx:nginx /var/www/app /var/cache/nginx /var/log/nginx /etc/nginx \
    && touch /var/run/nginx.pid \
    && chown nginx:nginx /var/run/nginx.pid \
    && rm /etc/nginx/conf.d/default.conf

# Install net-tools to provide network diagnostic tools
RUN apk add --no-cache net-tools

# Set the Nginx user
USER 101

# Run Nginx with the command "nginx -g daemon off;"
CMD ["nginx","-g","daemon off;"]
# Since the original image was 2GB, we use multi-stage builds to optimise the nextjs image.

# MULTI-STAGE BUILDS:
# With multi-stage builds, you use multiple FROM statements in your Dockerfile. Each FROM
# instruction can use a different base, and each of them begins a new stage of the build.
# You can selectively copy artifacts from one stage to another, leaving behind everything
# you don't want in the final image.

# Resource: https://javascript.plainenglish.io/reduce-docker-image-size-for-your-next-js-app-bcb65d322222

# DEPENDENCY STAGE:
FROM node:22-alpine as deps
WORKDIR /usr/src/app

COPY yarn.lock ./

# BUILD STAGE:
FROM node:22-alpine as builder
WORKDIR /usr/src/app










# OLD VERSION:
# # version of node to use
# FROM node:22-alpine
# # this is the working directory inside the container
# WORKDIR /usr/src/app
# # copy package.json and package-lock.json to the working directory (required to install dependencies)
# COPY package*.json ./
# # command that is run to install dependencies
# RUN yarn install
# # copy all files from the current directory to the working directory
# COPY . .
# # Expose port 3000 to the outside world (required to access the app at port 3000 however, we map this
# # internal 3000 to an external port in the docker-compose file)
# EXPOSE 3000
# # command that is run to start the app (can be overriden in the docker-compose file)
# CMD ["yarn", "dev"]

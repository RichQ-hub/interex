# Build the dependencies and compile the application.
FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json yarn.lock ./
# Install dependencies.
RUN yarn install --frozen-lockfile
COPY . .
# Compiles all the source code into native javascript.
RUN yarn build

# Build the optimised image containing only the necessary files.
FROM node:22-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package.json yarn.lock ./
# Reinstall dependencies for this image and install curl for healthcheck.
RUN yarn install --production && apk --no-cache add curl
EXPOSE 4000
CMD ["sh", "-c", "if [ \"$NODE_ENV\" = 'test' ]; then yarn test; else yarn start; fi"]

# DOCKER IMAGE LAYERS:
# From the wiki, Docker creates a layer for each command above. For each instruction, Docker checks if you can reuse
# the instruction from the previous build (i.e. if we can copy the same layer from the previous build). We can reuse
# a previous layer only if it is the exact same for the same layer in the current build, hence we use what's called
# the 'cached' result. This way, your build process becomes faster and more efficient.

# If the previous layer was not the same, then we rebuild the current layer and ALL SUBSEQUENT LAYERS (i.e. subsequent
# commands). 

# Here are a few examples of situations that can cause cache to be invalidated:

# 1) Any changes to the command of a RUN instruction invalidates that layer. Docker detects the change and invalidates
# the build cache if there's any modification to a RUN command in your Dockerfile.

# 2) Any changes to files copied into the image with the COPY or ADD instructions. Docker keeps an eye on any
# alterations to files within your project directory. Whether it's a change in content or properties like permissions,
# Docker considers these modifications as triggers to invalidate the cache.

# 3) Changes to a previous layer. This is because all layers DEPENDS ON the previous layer to build its app because
# of dependencies. Hence, if a previous layer were changed, then the current layer needs to be rebuilt to use those
# updated files.

# BUILDER STAGE:
# Here we first only copy the package.json and yarn.lock files, which are the only files needed to build the dependencies.
# After, we then copy all the files. We don't copy all the files first because if we did {COPY . .}, then had us install
# the dependencies. What happens is that if we made changes to the code in our files that COPY command becomes invalidated
# so we have to rebuild it, causing the next layer/command to rebuild which is {RUN yarn build}. Hence, everytime we 
# make changes to the code, we have to rebuild the dependencies which is extremely time consuming. The solution is we 
# build dependencies which rarely change BEFORE copying all the course code files, so that when changes are made to the code,
# the dependencies don't change and so we don't have to rebuild the dependencies every time.

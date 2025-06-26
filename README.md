# Interex

Interex is a Reddit-like clone developed as a social media platform that manages
communities, threads, comments, etc. 

## Table of Contents

- [1. Planned Features](#1-planned-features)
- [2. Technology Stack](#2-technology-stack)
- [3. Getting Started](#3-getting-started)
- [4. Startup Script](#4-startup-script)
- [5. Environment Variables](#5-environment-vairables)
- [6. Docker Optimisations](#6-docker-optimisations)

## 1. Planned Features

- [ ] Add a docker watch feature in **startup.sh** to watch for file changes during development.
  - Could include the note in the relevant README section: Frontend has docker
    watch enabled to allow automatic updates as you edit and save your files. 
    More details here: https://docs.docker.com/compose/file-watch/

## 2. Technology Stack

**Frontend**
- NextJS
- Typescript
- TailwindCSS

**Backend**
- NodeJS
- Express
- PostgreSQL

## 3. Getting Started

### Step 1: Install [Docker Desktop](https://www.docker.com/products/docker-desktop/)

- Install Docker Desktop.
- Run Docker Desktop.

### Step 2: Clone the project

```bash
git clone https://github.com/RichQ-hub/interex.git
# or
git clone git@github.com:RichQ-hub/interex.git
```

### Step 3: Copy .env.example file

- On OSX run `cp .env.example .env`
- On Windows run `copy .env.example .env`

### Step 4: Run the server

**On Linux:**

```bash
./startup.sh -p prod
```

> [!IMPORTANT]
> You must have docker desktop running!

This starts the backend, frontend and postgresql containers with `docker-compose up` inside 
the startup script. The frontend server will be running on `http://localhost:3333`, while the
backend will be running on `http://localhost:4000`.

The first time the script is ran will take 5-10 minutes. Subsequent executions will be much
faster due to docker's layering caches.

#### Ready Indication

Make sure frontend container is running the terminal. You know it's ready when it displays
the following:

```bash
frontend-1  |   ▲ Next.js 14.2.14
frontend-1  |   - Local:        http://4dce54a37d7a:3000
frontend-1  |   - Network:      http://172.18.0.4:3000
frontend-1  | 
frontend-1  |  ✓ Starting...
frontend-1  |  ✓ Ready in 248ms
```

> [!TIP]
> Should you encounter an **internal load** error during the build phase, e.g:
> ```bash
> ERROR [internal] load metadata for mcr.microsoft.com/dotnet/sdk:5.0.
> ```
>
> **Solution**
> 
> Run: `rm  ~/.docker/config.json `
>
> **Explanation**
>
> The file can get corrupted, likely with vscode extensions, etc.

### Step 5: Stopping the server

When you want to stop the server, and subsequently all the docker containers, simply press
`Ctrl+C` in the terminal. This will handle the cleanup of **unused** images and volumes too.

#### Data Persistence

Your database data will still persist even after stopping the server.



## 4. Startup Script

### Usage

```bash
Usage: ./startup.sh [-p <prod|test>] [-c] [-h]

where:
  -p <prod|test>   Start production or test containers.
  -h               Show this help text.
  -c               Cleanse unseen and unused docker files from the system.

The script must contain at least 1 of the above options.
```

> [!NOTE]
> If your terminal complains with the error `Error: cannot execute: required file not
> found`, startup.sh could have CRLF line endings. To fix this, ensure LF line endings are
> used instead.

#### Make sure the file is executable

Run `chmod +x startup.sh` to provide executable permissions for the file.

### Startup containers (-p)

The relevant docker containers pertaining to the given profile argument (-p) are
started (i.e. either `prod` or `test`).

It essentially runs the following:

```bash
docker-compose --profile prod build
docker-compose --profile prod up

# Shutting down (when Ctrl+C is entered)
docker-compose --profile prod down

# ... cleanup code run
```

### Docker Sytem Prune (-c)

You should periodically run `./startup.sh -c` which will subsequently run `docker system
prune --all` to cleanse unseen docker files installed as you tear down and rebuild images.

## 5. Environment Vairables

| Name         | Description                                                               | Optional | Default value |
| ------------ | ------------------------------------------------------------------------- | -------- | ------------- |
| NODE_ENV     | Used to state whether an environment is a production or test environment. | ✔️        | prod          |
| BACKEND_PORT | Backend server port.                                                      | ✔️        | 3000          |
| JWT_SECRET   | String used to sign jwt tokens for authorised requests.                   | ❌        |
| DB_HOST      | Name of the service container name defined in docker-compose.yml.         | ❌        |
| DB_PORT      | Database port.                                                            | ❌        | 5432          |
| DB_USER      | Database user.                                                            | ❌        | postgres      |
| DB_PASSWORD  | Database password.                                                        | ❌        |               |
| DB_NAME      | Database name.                                                            | ❌        |               |
| TEST_DB_NAME | Test database name.                                                       | ❌        |               |
| TEST_DB_HOST | Test database host.                                                       | ❌        |               |
| TEST_DB_PORT | Database port.                                                            | ❌        | 5432          |

> [!NOTE]
> **DB_NAME** refers to the database name defined in the env variable POSTGRES_DB for the postgres image.

## 6. Docker Optimisations

### Image Layers

**Consider the following `Dockerfile`**

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN yarn install --production
CMD ["node", "./src/index.js"]
```

From the wiki, Docker creates a layer for each command above. For each instruction, Docker checks if you can reuse
the instruction from the previous build (i.e. if we can copy the same layer from the previous build). We can reuse
a previous layer only if it is the exact same for the same layer in the current build, hence we use what's called
the 'cached' result. This way, your build process becomes faster and more efficient.

If the previous layer was not the same, then we rebuild the current layer and ALL SUBSEQUENT LAYERS (i.e. subsequent
commands).

**What causes cache invalidation?**

Here are a few examples of situations that can cause cache to be invalidated:

1. Any changes to the command of a RUN instruction invalidates that layer. Docker detects the change and invalidates
the build cache if there's any modification to a RUN command in your Dockerfile.

1. Any changes to files copied into the image with the COPY or ADD instructions. Docker keeps an eye on any
alterations to files within your project directory. Whether it's a change in content or properties like permissions,
Docker considers these modifications as triggers to invalidate the cache.

1. Changes to a previous layer. This is because all layers DEPEND ON the previous layer to build its app because
of dependencies. Hence, if a previous layer were changed, then the current layer needs to be rebuilt to use those
updated files.

### Optimised Dockerfiles

Our docker architecture applies optimisations taking full advantage of the layer cache invalidation system by minimising the amount of invalidations as much as possible. In turn, enjoying faster build times and more efficient space.

**Take the following `Dockerfile` from the backend folder.**

```dockerfile
# Build the dependencies and compile the application.
FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
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
```

**Builder stage:**

Here we first only copy the package.json and yarn.lock files, which are the only files needed to build the dependencies.
After, we then copy all the files. We don't copy all the files first because if we did `COPY . .`, then had us install
the dependencies. What happens is that if we made changes to the code in our files that `COPY` command becomes invalidated
so we have to rebuild it, causing the next layer/command to rebuild which is `RUN yarn build`. Hence, everytime we 
make changes to the code, we have to rebuild the dependencies which is extremely time consuming. The solution is we 
build dependencies which rarely change BEFORE copying all the course code files, so that when changes are made to the code,
the dependencies don't change and so we don't have to rebuild the dependencies every time.

> [!NOTE]
> The same applies in the **runner** stage.

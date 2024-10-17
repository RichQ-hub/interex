# Interex

Interex is a Reddit-like clone developed as a social media platform that manages
communities, threads, comments, etc. 

## Table of Contents

- [Planned Features](#planned-features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Startup Script](#startup-script)
- [Environment Variables](#environment-vairables)

## Planned Features

- [ ] Add a docker watch feature in **startup.sh** to watch for file changes during development.
  - Could include the note in the relevant README section: Frontend has docker
    watch enabled to allow automatic updates as you edit and save your files. 
    More details here: https://docs.docker.com/compose/file-watch/

## Technology Stack

**Frontend**
- NextJS
- Typescript
- TailwindCSS

**Backend**
- NodeJS
- Express
- PostgreSQL

## Getting Started

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

```bash
./startup.sh -p prod
```

> Note: You must have docker desktop running!

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

### Step 5: Stopping the server

When you want to stop the server, and subsequently all the docker containers, simply press
`Ctrl+C` in the terminal. This will handle the cleanup of **unused** images and volumes too.

#### Data Persistence

Your database data will still persist even after stopping the server.

## Startup Script

### Usage

```bash
Usage: ./startup.sh [-p <prod|test>] [-c] [-h]

where:
  -p <prod|test>   Start production or test containers.
  -h               Show this help text.
  -c               Cleanse unseen and unused docker files from the system.

The script must contain at least 1 of the above options.
```

> Note: If your terminal complains with the error `Error: cannot execute: required file not
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

## Environment Vairables

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

> Note: **DB_NAME** refers to the database name defined in the env variable POSTGRES_DB for the postgres image.
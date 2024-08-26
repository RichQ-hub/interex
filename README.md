# Interex

## Setup

1. Clone this repository.
2. Run Docker Desktop ([Installation](https://www.docker.com/products/docker-desktop/))
3. From the project directory, run `docker-compose up` to start all the services defined in docker-compose.yml
4. Visit `localhost:3333` on a web browser to see the app running.

### Making changes in the code

To see changes you've made in the repository, run the following commands to rebuild and run the images created by `docker-compose up`.

```bash
docker-compose down
docker-compose build
docker-compose up --watch
```

> Note: Frontend has docker watch enable to allow automatic updates as you edit and save your files.  
> 
> More details here: https://docs.docker.com/compose/file-watch/
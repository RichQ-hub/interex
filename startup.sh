#!/bin/sh

# Automates docker setup and cleanup. As of now, must be run on linux terminals.

USAGE_MSG="Usage: $0 [-p <prod|test>] [-c] [-h]

where:
  -p <prod|test>  Start production or test containers.
  -h              Show this help text.
  -c              Cleanse unseen and unused docker files from the system.

The script must contain at least 1 of the above options.
"

usage() {
  echo "$USAGE_MSG"
  exit 1
}

# Assert at least 1 argument is passed.
if [ $# -lt 1 ]
then
  usage
fi

# Assert .env and docker-compose.yml files exist.
if ! [ -r ".env" -a -r "docker-compose.yml" ]
then
  echo "Error: Files '.env' and 'docker-compose.yml' must exist."
  exit 1
fi

# Loops through the flag options supplied to the script.
while getopts ":p:ch" opt; do
  case $opt in
    p)
      NODE_ENV=$OPTARG

      case $NODE_ENV in
        prod|test)
          # Set the NODE_ENV variable baesd on the given arg in .env
          sed -i -e "s/\(^NODE_ENV\s*=\s*\).*/\1$NODE_ENV/" .env &&
          docker-compose --profile $NODE_ENV build &&
					docker image prune -f &&
          docker-compose --profile $NODE_ENV up

					# Could add docker prune between build and up.

          # Once exited (Crtl+C), we delete all running containers.
          docker-compose --profile $NODE_ENV down
          ;;
        *)
          echo "Error: Invalid argument '$NODE_ENV'. Must be either 'prod' or 'test'.\n"
          usage
          ;;
      esac
      ;;
    c)
      docker system prune --all -f
      ;;
    h)
      usage
      ;;
    *)
      echo "Invalid option: -$OPTARG" >&2
      exit 1
      ;;
  esac
done

# Cleanup anonymous images and anonymous volumes.
docker image prune -f &&
docker volume rm $(docker volume ls -q | awk -F, 'length($0) == 64 { print }') -f 2> /dev/null

# ==================================================================================
# Pruning Anonymous Volumes:
# https://github.com/moby/moby/issues/31757 (Answer by mesuutt)
# ==================================================================================
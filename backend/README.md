# Backend

## Docker Compose File

### Why create an anonymous bind mount for node_modules?

```yaml
volumes:
  - ./backend:/app
  - /app/node_modules
```

**Prevents Overwriting Node Modules**

When you mount a directory from the host (e.g., ./backend) to a directory in the container (e.g., /app), everything in that host directory replaces what’s in the corresponding directory in the container.

If you didn’t have the - /app/node_modules volume, the node_modules directory inside the container (which might be installed by running npm install within the container) would be overwritten by whatever is in the ./backend/node_modules directory on the host. If the node_modules directory doesn’t exist on the host, the container’s node_modules would be effectively removed.

By specifying - /app/node_modules without a corresponding host path, you’re instructing Docker to create an anonymous volume specifically for that directory. This keeps the node_modules inside the container separate from the host, avoiding accidental overwriting or deletion.

**References**

- https://www.digitalocean.com/community/tutorials/containerizing-a-node-js-application-for-development-with-docker-compose#step-4-defining-services-with-docker-compose
# www.starbug.com

This is the source repo for the www.starbug.com website.

This implementation is designed to run as microservices
in [docker](https://www.docker.com/) containers.

It is based on [nginx ](https://nginx.org/) running as a reverse proxy
in one container.
It routes traffic to a 
[flask](https://flask.palletsprojects.com/en/stable/) server running
in an adjacent container.
These are managed by [docker compose](https://docs.docker.com/compose/) 

# Local testing

From the root directory of the clone of this repo

```
docker compose up -d --remove-orphans
```

```
docker compose down
```
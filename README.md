# Install NodeJS and NPM
```bash
sudo apt-get install curl software-properties-common

curl -sL https://deb.nodesource.com/setup_12.x | sudo bash -

sudo apt-get install nodejs
```

# Check if NodeJS and NPM properly installed
```bash
node -v 

npm -v 
```

# Install node modules
```bash
sudo npm install && sudo npm install -g env-cmd
```

# To run STAGING environment 
```bash
npm run start
```

# To run PRODUCTION environment 
```bash
npm run start:production
```

# To build STAGING environment 
```bash
npm run build:staging
```

# To build PRODUCTION environment 
```bash
npm run build:production
```

## Installation with Docker
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

sudo usermod -aG docker <username> # Logout after to take effect

sudo curl -L "https://github.com/docker/compose/releases/download/1.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose


```

## Docker commands commonly use
```bash
docker image build -t <output name> . # To built image (Dockerfile)  
docker image ls # show all docker images
docker ps -a # show all docker containers
docker run -it <image id> /bin/bash # To run and connect docker image
docker rmi <image id> # To delete docker image
docker container exec -it <container id> bash # To connect in Docker container


# RUN DOCKER COMPOSE
docker-compose -f docker-compose.yml up -d 

# To connect to the shell of running container
docker container exec -it <container id> bash 

# Docker Volume commands
docker volume ls # List all volumes
docker volume inspect # Inspect volumes

# Clean up docker
docker network prune
docker container stop $(docker container ls -aq)
docker container rm $(docker container ls -aq)
docker image rm $(docker image ls -aq)
# ----------------------------------------
# To remove any stopped containers and all unused images
docker system prune -a 
# ----------------------------------------
```
## Commands to fixed errors
```bash
# ----------------------------------------
# To connect in Docker container
docker container exec -it <container id> bash
# ----------------------------------------
# To check logs of running containers
docker logs --tail 50 --follow --timestamps ecc5bc1e7e41
# ----------------------------------------
# File permission
sudo chmod -R 777 <Folder>
# ----------------------------------------
# To check running process on a port
sudo lsof -i:<port>
```

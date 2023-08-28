# Use Node.js LTS version
FROM node:16

# Update package list and install dependencies
RUN apt-get update \
    && apt-get install -y build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev

# Set working directory
WORKDIR /usr/src/app

# Install Fastify and other npm packages
COPY package.json ./
RUN npm install

# Bundle app source
COPY . .

# Expose port 3000
EXPOSE 80

# Run the Fastify server
CMD [ "npm", "start" ]

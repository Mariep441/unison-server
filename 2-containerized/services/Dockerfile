
FROM node:latest
RUN mkdir -p /usr/src/server
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . /usr/src/server
EXPOSE 8000
CMD ["node", "server.js"]

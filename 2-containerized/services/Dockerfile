
FROM node:latest
RUN mkdir -p /usr/src/server
WORKDIR /usr/src/app
COPY package.json /usr/src/server/
RUN npm install
COPY . /usr/src/server
EXPOSE 4000
CMD ["node", "server.js"]

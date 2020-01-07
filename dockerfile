FROM node:10

WORKDIR /ram

COPY package*.json ./

RUN npm install

COPY . /ram

EXPOSE 3000

CMD [ "node", "server.js" ]


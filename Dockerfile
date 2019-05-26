FROM node:10

WORKDIR /home/vidit/Code Red/chat

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]


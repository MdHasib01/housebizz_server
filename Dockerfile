FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm install -g dotenv-cli

EXPOSE 8080

CMD ["dotenv", "-e", ".env", "--", "node", "src/index.js"]

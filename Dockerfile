FROM node:22 as builder

RUN npm install -g npm@latest
WORKDIR /build

COPY package*.json ./
RUN npm install

COPY . .


# Stage 2

FROM node:22 as runner

WORKDIR /app

COPY --from=builder build/package*.json .
COPY --from=builder build/node_modules node_modules/
COPY --from=builder build/. .

CMD ["npm", "start"]

FROM node:20-alpine AS development-dependencies-env
ENV NODE_ENV=development
COPY . /app
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app

EXPOSE 3000
CMD ["npm", "run", "start"]
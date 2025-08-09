# syntax=docker/dockerfile:1.7
FROM node:22-alpine
ENV NODE_ENV=production
WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev --no-audit --no-fund && npm cache clean --force

COPY src ./src
USER node
EXPOSE 3000
CMD ["node", "src/server.js"]
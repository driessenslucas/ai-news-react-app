# backend/Dockerfile
FROM node:18

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 5600

CMD ["node", "Scraper.js"]

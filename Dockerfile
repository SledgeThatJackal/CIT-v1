FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock-json* ./

RUN npm install --force

COPY . .

RUN chmod +x start.sh

RUN npm run build

EXPOSE 3000

CMD ["./start.sh"]

LABEL org.opencontainers.image.source="https://github.com/sledgethatjackal/cit-prototype"

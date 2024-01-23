FROM node:latest
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 5800
CMD [ "npm","start" ]
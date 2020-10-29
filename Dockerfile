FROM node
WORKDIR /index
COPY package*.json ./
RUN npm i
COPY . .
EXPOSE 8081
CMD ["npm","start"]

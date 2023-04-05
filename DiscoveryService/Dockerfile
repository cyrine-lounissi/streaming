FROM node:alpine

WORKDIR /usr/app

COPY  package.json /usr/app/
RUN npm install


COPY ./ /usr/app/

EXPOSE 8080

# Set the MongoDB connection string as an environment variable



CMD [ "npm", "start" ]
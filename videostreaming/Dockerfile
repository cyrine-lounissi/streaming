FROM node:alpine

WORKDIR /usr/app

COPY  package.json /usr/app/
RUN npm install


COPY ./ /usr/app/

EXPOSE 4001

# Set the MongoDB connection string as an environment variable
ENV MONGO_URI=localhost:27017
ENV RABBITMQ_URI=rabbitmq-clusterip-svc:5672
ENV CONTENTMANAGEMENTURL = contentmanagement-clusterip-srv:4000

CMD [ "npm", "start" ]
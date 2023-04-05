const amqp = require('amqplib');
var ObjectId = require("mongodb").ObjectId;
var mongoClient = require("mongodb").MongoClient;
const rabbitmqUri = process.env.RABBITMQ_URI
const mongoUri =process.env.MONGO_URI
async function consumeVideoDeletedMessage() {

try {
  const connection = await amqp.connect(`amqp://${rabbitmqUri}`);
  console.log('Connected to RabbitMQ server');
  const channel = await connection.createChannel();
  const queueName = 'video_deleted';

  await channel.assertQueue(queueName, { durable: true });
  console.log(`Waiting for messages in ${queueName} queue...`);

  channel.consume(queueName, async (message) => {
    const content = JSON.parse(message.content.toString());
    const id= content.contentId;
    console.log(id);
    console.log(id.toString());
    const databaseName = "streaming";
    const client = await mongoClient.connect(`mongodb://${mongoUri}`, { useUnifiedTopology: true });
    const database = client.db(databaseName);
    console.log("Connected to MongoDB database:", databaseName);
    const contentVerification = await database.collection('videos').findOne({ contentID: id.toString()});
    if (contentVerification) {
     await database.collection('videos').deleteOne({ contentId: id.toString() });
    } else {
        console.log("Content not found to be deleted ");
      }
     
    console.log(`Received message: ${JSON.stringify(content)}`);
    
    channel.ack(message);
  });
} catch (error) {

  console.error('Error connecting to RabbitMQ server:', error.message);
}
 
}
module.exports={consumeVideoDeletedMessage};
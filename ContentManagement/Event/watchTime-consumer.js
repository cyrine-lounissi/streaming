const amqp = require('amqplib');
var ObjectId = require("mongodb").ObjectId;
var mongoClient = require("mongodb").MongoClient;
const rabbitmqUri = process.env.RABBITMQ_URI
const mongoUri =process.env.MONGO_URI
async function consumeWatchTimeMessage() {
  try {
    const connection = await amqp.connect(`amqp://${rabbitmqUri}`);
    console.log('Connected to RabbitMQ server');
    const channel = await connection.createChannel();
    const queueName = 'video_watchTime';
     await channel.assertQueue(queueName, { durable: true });
    console.log(`Waiting for messages in ${queueName} queue...`);
     channel.consume(queueName, async (message) => {
    const content = JSON.parse(message.content.toString());
    const id= content.contentId;
    const watchTime=content.watchTime;
    const databaseName = "ytest";
    const client = await mongoClient.connect(`mongodb://${mongoUri}`, { useUnifiedTopology: true });
    const database = client.db(databaseName);
    console.log("Connected to MongoDB database:", databaseName);
    const contentVerification = await database.collection('content').findOne({ _id: new ObjectId(id),watchTime: { $exists: true }});
    if (contentVerification) {
        await database.collection('content').updateOne({ _id: new ObjectId(id) }, { $inc: {  watchTime: watchTime } });
    } else {

        await database.collection('content').updateOne({ _id: new ObjectId(id) }, { $set: { watchTime: watchTime } });

      }
     
    console.log(`Received message: ${JSON.stringify(content)}`);
    
    channel.ack(message);
  });
  } catch (error) {
    console.error('Error connecting to RabbitMQ server:', error.message);
  }
  
}
module.exports={consumeWatchTimeMessage};
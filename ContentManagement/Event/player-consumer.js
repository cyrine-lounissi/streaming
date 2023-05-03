const amqp = require('amqplib');
var ObjectId = require("mongodb").ObjectId;
var mongoClient = require("mongodb").MongoClient;
const rabbitmqUri = process.env.RABBITMQ_URI
const mongoUri =process.env.MONGO_URI
async function consumeVideoPlayedMessage() {
   try {
    const connection = await amqp.connect(`amqp://${rabbitmqUri}`);
    console.log('Connected to RabbitMQ server');
    const channel = await connection.createChannel();
    const queueName = 'video_played';
    await channel.assertQueue(queueName, { durable: true });
    console.log(`Waiting for messages in ${queueName} queue...`);
    channel.consume(queueName, async (message) => {
    const content = JSON.parse(message.content.toString());
    console.log(`Received message: ${JSON.stringify(content)}`);
    const id= content.contentId;
    console.log(id);
    const contentID =parseInt(id);
    console.log(contentID);
    const uid= content.userId;
    const userId = new ObjectId(uid);
    const databaseName = "ytest";
    const client = await mongoClient.connect(`mongodb://${mongoUri}`, { useUnifiedTopology: true });
    const database = client.db(databaseName);
    console.log("Connected to MongoDB database:", databaseName);
    const contentVerification = await database.collection('content').findOne({ _id: new ObjectId(id), views: { $exists: true } });
    if (contentVerification) {
        await database.collection('content').updateOne({ _id: new ObjectId(id) }, { $inc: { views: 1 } ,  $addToSet: { history: uid }});
      } else {
        await database.collection('content').updateOne({ _id: new ObjectId(id) }, { $set: { views: 1 },  $addToSet: { history: uid } });
      }
      console.log(`Saved content with ID ${id} and user  ${uid} to MongoDB!`);

    
    
    channel.ack(message);
  });
  } catch (error) {
    console.error('Error connecting to RabbitMQ server:', error.message);
  }
  
}
module.exports={consumeVideoPlayedMessage};
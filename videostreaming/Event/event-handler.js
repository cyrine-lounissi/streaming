const amqp = require('amqplib');
const axios =require('axios');
const path =require('path');
const fs =require('fs');
const { MongoClient, ObjectId } = require('mongodb');
const rabbitmqUri = process.env.RABBITMQ_URI
const mongoUri =process.env.MONGO_URI
const contentManagement =process.env.CONTENTMANAGEMENTURL
const url = `mongodb://${mongoUri}`;
const dbName = 'streaming';

module.exports = async function() {
  console.log("starting event handler");
  
  try {
    const conn = await amqp.connect(`amqp://${rabbitmqUri}`);
    const ch = await conn.createChannel();
    const queue = 'video_upload_queue';
    await ch.assertQueue(queue, { durable: true });
    console.log(`Waiting for messages in ${queue}. To exit press CTRL+C`);
    await ch.consume(queue, async function(msg) {
      console.log(`Received message from queue: ${msg.content.toString()}`);
      const client = await MongoClient.connect(url);
    const db = client.db(dbName);
    const collection = db.collection('videos');
    console.log("Connected to MongoDB!");
      const data = JSON.parse(msg.content.toString());
      const contentId = data.contentId;
      //const contentID=contentId.toString();
      //const contentId = new ObjectId(contentID);
      const videoPath = data.videoPath;
      // Save content and video path to MongoDB
      const document = { contentId, videoPath };
    
      await collection.insertOne(document);
      client.close();
      console.log(`Saved content with ID ${contentId} and video path ${videoPath} to MongoDB!`);
      const videosDir = path.join(__dirname, '..', 'uploads');
          console.log(videosDir);
          const videoName = path.basename(videoPath);
          console.log(videoName);
          const filePath = path.join(videosDir, videoName);
          console.log(filePath);
         axios({
        method: 'get',
        url: `http://contentmanagement-clusterip-srv:4000/content/video/${videoPath}`,
        responseType: 'stream'
      })
        .then(response => {
         const writeStream = fs.createWriteStream(filePath);
          response.data.pipe(writeStream);
          writeStream.on('finish', () => {
            console.log('File saved successfully');
          });
        })
        .catch(error => {
          console.error(`Error retrieving file: ${error}`);
        });
    
    }, { noAck: true });
    
  } catch (err) {
    console.error(err);
  }
};

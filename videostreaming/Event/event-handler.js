const amqp = require('amqplib');
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
      client.close()
      
      console.log(`Saved content with ID ${contentId} and video path ${videoPath} to MongoDB!`);
       /*axios({
        method: 'get',
        url: `http://${contentManagement}/content/video/${videoPath}`,
        responseType: 'stream'
      })
        .then(response => {
          // create a write stream to save the video file
          const videosDir = path.join(__dirname, '..', 'uploads');
          const videoName = path.basename(videoPath);
          const filePath = path.join(videosDir, videoName);
          console.log(filePath);
          const writeStream = fs.createWriteStream(filePath);
          
          // pipe the response data to the write stream
          response.data.pipe(writeStream);
          
          // listen for completion of writing the file
          writeStream.on('finish', () => {
            console.log('File saved successfully');
          });
        })
        .catch(error => {
          console.error(`Error retrieving file: ${error}`);
        });*/
    }, { noAck: true });
    
  } catch (err) {
    console.error(err);
  }
};

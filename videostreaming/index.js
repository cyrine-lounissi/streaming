const express = require('express');
const StreamingService = require('./Services/StreamingService');
const eventHandler =require('./Event/event-handler');
var mongoClient = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const { sendMessage } = require('./Event/event-playing');
const{sendwatchTime}=require('./Event/event-watchTime')
const{consumeVideoDeletedMessage}=require('./Event/event-deleting');
const registerService = require('./consulRegister');
const port=4001;
app.use(bodyParser.json());
app.use(cors());
var streamingService= new StreamingService();
let eventEmitted = false;
let streamEnded = false; // flag to determine whether stream has ended or not
const mongoUri =process.env.MONGO_URI
const client = mongoClient.connect(`mongodb://${mongoUri}`, { useUnifiedTopology: true });

eventHandler();
consumeVideoDeletedMessage();
app.get('/healthcheck', (req, res) => {
  res.send('OK');
});
app.get('/watch/:contentId/:userId', async (req, res) => {
  try {
    const id = req.params.contentId ;
    const ID =id.toString();
    userId= req.params.userId;
    const range = req.headers.range;
    const databaseName = "streaming";
    const client = await mongoClient.connect(`mongodb://${mongoUri}`, { useUnifiedTopology: true });
    const database = client.db(databaseName);
    console.log("Connected to MongoDB database yeyy:", databaseName);

   const content = await database.collection("videos").findOne( {contentId: ID});

    const { headers, stream } =  streamingService.PlayVideo(content.videoPath, range);
    if (!eventEmitted) {
      await sendMessage(ID, userId);
      eventEmitted = true;
    }
       
    res.writeHead(206, headers); 
    stream.pipe(res);
    let startTime = Date.now();
    let watchTime = 0;
    
    stream.on('data', (chunk) => {
      watchTime += chunk.length;
    });
    
    stream.on('end', async () => {
      streamEnded = true; 
      const endTime = Date.now();
      watchTime = Math.floor(watchTime / 1024); 
      const watchDuration = Math.floor((endTime - startTime) / 1000); 
      console.log(`User watched ${watchTime} KB for ${watchDuration} seconds.`);
      if(watchDuration!==0)
      {
        await sendwatchTime(ID, userId, watchDuration);

      }
      eventEmitted = false;

    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while processing your request.' });
  }
});
app.post('/playbackRate', (req, res) => {
  try {
    const playbackRate = req.body.playbackRate;
    streamingService.SetPlaybackRate(playbackRate);
    res.status(200).json({ message: `Playback rate set to ${playbackRate}.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while processing your request.' });
  }
});
app.post('/forwardVideo', (req, res) => {
  try {
    const seconds = req.body.seconds;
    const stream = req.body.stream;
    streamingService.ForwardVideo(seconds, stream);
    res.status(200).json({ message: `Fast forwarded video by ${seconds} seconds.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while processing your request.' });
  }
});

app.post('/rewindVideo', (req, res) => {
  try {
    const seconds = req.body.seconds;
    const stream = req.body.stream;
    streamingService.RewindVideo(seconds, stream);
    res.status(200).json({ message: `Rewound video by ${seconds} seconds.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while processing your request.' });
  }
});
app.post('/setVolume', (req, res) => {
  try {
    const volume = req.body.volume;
    const stream = req.body.stream;
    streamingService.SetVolume(volume, stream);
    res.status(200).json({ message: `Changed volume to ${volume}.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while processing your request.' });
  }
});
app.post('/setQuality', (req, res) => {
  try {
    const quality = req.body.quality;
    const stream = req.body.stream;
    streamingService.SetQuality(quality, stream);
    res.status(200).json({ message: `Changed video quality to ${quality}.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while processing your request.' });
  }
});

  app.listen(port, () => {
    console.log(`Server listening on port 4001`);
  });
  
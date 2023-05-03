const express = require('express');
const ServiceRating = require('./Services/ServiceRating');
const  ServiceContent  = require('./Services/ServiceContent');
const  ServiceWatchList  = require('./Services/ServiceWatchList');
const  ServiceReview  = require('./Services/ServiceReview');
const  ServiceAnalytics  = require('./Services/ServiceAnalytics');
var mongoClient = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const {consumeVideoPlayedMessage}= require('./Event/player-consumer')
const {emitNewContentEvent}=require('./Event/event-handler');
const{sendMessageDeleted}=require('./Event/content-delete');
const{consumeWatchTimeMessage}=require('./Event/watchTime-consumer');
//const registerService = require('./consulRegister') ;
const path = require('path');
const port=4000;
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // save files to the 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // use the original file name as the file name
  }
});
const upload = multer({ storage });
app.use(bodyParser.json());
app.use(cors());
consumeVideoPlayedMessage();
consumeWatchTimeMessage();


var serviceContent= new ServiceContent();
var serviceAnalytics= new ServiceAnalytics();
var serviceAnalytics= new ServiceAnalytics();
var serviceRating = new ServiceRating();
var serviceReview =  new ServiceReview();
var serviceWatchList = new ServiceWatchList();

serviceContent.connect()
  .then(() => {
    console.log("ServiceContent  connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });
  var serviceAnalytics= new ServiceAnalytics();
serviceAnalytics.connect()
  .then(() => {
    console.log("serviceAnalytics connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });
serviceRating.connect()
  .then(() => {
    console.log("serviceRating connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });
serviceReview.connect()
  .then(() => {
    console.log("serviceReview connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });
serviceWatchList.connect()
  .then(() => {
    console.log("serviceWatchList connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });

app.get('/healthcheck', (req, res) => {
  res.send('OK');
});

app.post('/content', upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]), async(req, res) => {

  try {
    const result = await serviceContent.addNewContent(req,res);
    await emitNewContentEvent(result.contentId, result.videoPath);
    if (result && result.message ) {
      res.status(201).json({ message: result.message });
    } else {
      res.status(500).json({ message: 'Unknown error occurred.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while processing your request.' });
  }
 
});


app.get('/content', upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]), async(req, res) => {

  try {
    const result = await serviceContent.ListAllContent();
    if (result.success) {
      res.status(201).json({ message: result.message, content: result.content });
      console.log(result.content);
      console.log("success retreiving data");
      
    } else {
      res.status(500).json({ message: result.message, error: result.error });
      console.log("failed");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while processing your request.' });
  }
 
});

app.get('/content/:id', async(req, res) => {

  try {
    const id = req.params.id;
    const result = await serviceContent.ListContentbyId(id);
    if (result.success) {
      res.status(201).json({ message: result.message, content: result.content });
      console.log(result.content);
      console.log("success retreiving data");
      
    } else {
      res.status(500).json({ message: result.message, error: result.error });
      console.log("failed");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while processing your request.' });
  }
 
});
app.post('/delete', async(req, res) =>{
  var id = req.body.id; // assume the id is in the request body
try{
 const result = await serviceContent.DeleteContent(id);
 await sendMessageDeleted(id);
 if (result === true) {
  res.status(200).json({ message: 'Content deleted successfully.' });
} else {
  res.status(404).json({ message: 'Content not found.' });
}
} catch (error) {
console.error(error);
res.status(500).json({ message: 'An error occurred while processing your request.' });
}
});

app.post('/edit', upload.fields([
  { name: 'thumbnail', maxCount: 1 }
]), async (req, res) => {
  

  try {
    const result = await serviceContent.EditContent(req);
    if (result.modifiedCount === 1) {
      res.status(200).json({ message: 'Content updated successfully.' });
    } else {
      res.status(404).json({ message: 'Content not found.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while processing your request.' });
  }
});

app.post('/comment', async(req, res) => {
  try {
   const result = await serviceReview.CommentContent(req);
    if (result.modifiedCount === 1) {
      res.status(200).json({ message: 'Comment added successfully.' });
    } else {
      res.status(404).json({ message: 'Content not found.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while processing your request.' });
  }
});
app.get('/comment/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const result = await serviceReview.ListAllComment(id);
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: 'Content not found.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while processing your request.' });
  }
});
app.post('/rate', async (req, res) => {
  try {
    const result = await serviceRating.RateContent(req);
    if (result.modifiedCount === 1) {
      res.status(200).json({ message: 'Rating added successfully.' });
    } else {
      res.status(404).json({ message: 'Content not found.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while processing your request.' });
  }
});
app.get('/rate/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const result = await serviceRating.ListAllRatings(id);
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: 'Content not found.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while processing your request.' });
  }
});
app.post('/watchlist', async (req, res) => {
  try {
    const result = await serviceWatchList.WatchList(req);
    if (result.modifiedCount === 1) {
      res.status(200).json({ message: 'conntent added successfully to Watch List.' });
    } else {
      res.status(404).json({ message: 'Content was not added!' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while processing your request.' });
  }
});
app.post('/analyse', async(req, res) => {
  // assume the user ID is in the request body

  try {
   const result = await serviceAnalytics.AnalysePerformance(req);
    if (result == true ) {
      res.status(200).json({ message: 'analytics added successfully.' });
    } else {
      res.status(404).json({ message: 'Content not found.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while processing your request.' });
  }
});
app.get('/analyse/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const result = await serviceAnalytics.ListAllAnalytics(id);
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: 'Content not found.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while processing your request.' });
  }
});
app.use('/content/thumbnail/:thumbnailPath(*)', (req, res) => {
  const thumbnailPath = req.params.thumbnailPath;
  console.log(thumbnailPath);
  const IMAGES_DIR = path.join(__dirname);
  const filePath = path.join(IMAGES_DIR, thumbnailPath);
  console.log(filePath);
  res.sendFile(filePath, {
    headers: {
      'Content-Type': 'image/jpeg' // set the content type of the response
    }
  }, (err) => {
    if (err) {
      console.error(`Error sending file: ${err}`);
      res.sendStatus(404); // send a 404 error if the file can't be found
    }
  });
});
app.use('/content/video/:videoName(*)', (req, res) => {
  const videoName = req.params.videoName;
  console.log(videoName);
  const VIDEOS_DIR = path.join(__dirname);
  const filePath = path.join(VIDEOS_DIR, videoName);
  console.log(filePath);
  res.sendFile(filePath, {
    headers: {
      'Content-Type': 'video/mp4' // set the content type of the response
    }
  }, (err) => {
    if (err) {
      console.error(`Error sending file: ${err}`);
      res.sendStatus(404); // send a 404 error if the file can't be found
    }
  });
});
app.listen(port, () => {
  console.log('Starting eyy');
  console.log(`Server listening on port 4000`);
});

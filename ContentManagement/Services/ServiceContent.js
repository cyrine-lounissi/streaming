const Content = require('../Entities/Content');
const Metadata = require('../Entities/Metadata');
const Review = require('../Entities/Review');
const Rating = require('../Entities/Rating');
const Analytics = require('../Entities/Analytics');
const Video = require('../Entities/Video');
const Watchlist = require('../Entities/WatchList');
var express = require("express");
var app = express();
var http = require("http").createServer(app);
var socketIO = require("socket.io")(http);
var formidable = require("formidable");
var fileSystem = require("fs");
var ObjectId = require("mongodb").ObjectId;
var bodyParser = require("body-parser");
var expressSession = require("express-session");
var bcrypt = require("bcryptjs");
var mongoClient = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectId;
const { getVideoDurationInSeconds } = require('get-video-duration');
var nodemailer = require("nodemailer");
//const {emitNewContentEvent}=require('./Event/event-handler');

const databaseName = "ytest";
const mongoUri =process.env.MONGO_URI
const client = new mongoClient(`mongodb://${mongoUri}`, {
  useUnifiedTopology: true,
});

class ServiceContent {
  constructor() {
    this.database = null;
  }
  async connect() {
    return new Promise(async (resolve, reject) => {
      try {
        await client.connect();
        this.database = client.db(databaseName);
        console.log("Connected to MongoDB database:", databaseName);
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }

async  addNewContent(req) {
    try {
      
      const videoName = req.files.video[0].originalname;
      const oldPath = req.files.video[0].path;
      const thumbnailName = req.files.thumbnail[0].originalname;
      const oldPathThumbnail = req.files.thumbnail[0].path;
      const title = req.body.title;
      const description = req.body.description;
      const genre = req.body.category;
      const tags = req.body.tags;
      const releaseDate = req.body.releaseDate;
      const id = new ObjectId();
      const metadata = new Metadata();
      metadata.setTitle(title);
      metadata.setId(id);
      metadata.setDescription(description);
      metadata.setGenre(genre);
      metadata.setReleaseDate(releaseDate);
      metadata.setThumbnail(oldPathThumbnail);
      if (typeof oldPath !== 'string') {
        throw new Error('invalid path ');
      }
      const duration = await getVideoDurationInSeconds(oldPath);
      const hours = Math.floor(duration / 60 / 60);
      const minutes = Math.floor(duration / 60) - (hours * 60);
      const seconds = Math.floor(duration % 60);
      const video = new Video();
      video.setHours(hours);
      video.setMinutes(minutes);
      video.setSeconds(seconds);
      video.setUrl(oldPath);
      video.setId(id);
      video.setDuration(duration);
      const content = new Content();
      content.setId(id);
      content.setMetadata(metadata);
      content.setVideo(video);

      const result = await this.database.collection("content").insertOne({
        "_id": content.getId(),
        "metadata": content.getMetadata(),
        "video": content.getVideo(),
        
      });
      console.log('Content saved to MongoDB');
      const contentId = content.getId();
      const videoPath = content.getVideo().getUrl();
      return { 
        message: 'File uploaded successfully',
        contentId,
        videoPath
      };
    } catch (err) {
      console.log('Error adding content:', err);
      return{message: 'Error adding content'};
    }
  }
 async ListAllContent(){
 try{
 
 const content = await this.database.collection("content").find().toArray();

 return { success: true, content: content };

} 
catch (error) {
 console.error(error);
 res.status(500).send("Internal server error");
}
}
async ListContentbyId(id){
  try{
 
    const content = await this.database.collection("content").findOne({_id: new ObjectId(id)});
    return { success: true, content: content };
   
   } 
   catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
   }
}
async DeleteContent(id) {
 try{
 
    const result = await this.database.collection('content').deleteOne({ _id: new  ObjectId(id) });
    return  result ;
 }
 catch (error) {
  console.error(error);
  res.status(500).send("Internal server error");
 }
}
async EditContent( req) {
  try {
  const id = req.body.id; 

 
    const thumbnailName = req.files.thumbnail[0].originalname;
    const oldPathThumbnail = req.files.thumbnail[0].path;
     var title = req.body.title;
     var description = req.body.description;
     var genre = req.body.category;
     //var tags = req.body.tags;
     var releaseDate=req.body.releaseDate;
     const metadata = new Metadata();
     metadata.setTitle(title);
     metadata.setId(id);
     metadata.setDescription(description);
     metadata.setGenre(genre);
     metadata.setReleaseDate(releaseDate);
     metadata.setThumbnail(oldPathThumbnail)
    const result = await this.database.collection('content').updateOne({ _id: new ObjectId(id) }, { $set: { metadata: metadata } });
    return result;
  } catch (error) {
    console.error(error);
    throw new Error('Internal server error');
  }
}


}


module.exports = ServiceContent;
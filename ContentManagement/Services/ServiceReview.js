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
const databaseName = "ytest";
const mongoUri =process.env.MONGO_URI
const client = new mongoClient(`mongodb://${mongoUri}`, {
  useUnifiedTopology: true,
});
var nodemailer = require("nodemailer");


class ServiceReview {
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

async  CommentContent(req) {
    try{
     
     const id = req.body.id; 
     const comment = req.body.comment; // assume the comment string is in the request body
     const userId = req.body.userId; 
     const review = new Review();
     var rv = Math.random().toString(36).substr(2, 9); // generate random ID
     review.setId(rv);
     review.setUserId (userId);
     review.setContentId(id);
     review.setComment (comment);
     console.log("Review created");
   
     const result = await this.database.collection('content').updateOne(
       { _id: new  ObjectId(id) },
       { $push: { comments:  review } } 
     );
   
     return  result ;
    }
    catch (error) {
     console.error(error);
     throw new Error('Internal server error');
   }
   }
   async ListAllComment(id) {
    try {
     
      const result = await this.database.collection('content').findOne({ _id: new ObjectId(id) });
      if (result) {
        return result.comments;
      } else {
        return null;
      }
    } catch (error) {
      console.error(error);
      throw new Error('Internal server error');
    }
  }
}
module.exports = ServiceReview;
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
const databaseName = "ytest";
const mongoUri =process.env.MONGO_URI
const client = new mongoClient(`mongodb://${mongoUri}`, {
  useUnifiedTopology: true,
});
const { getVideoDurationInSeconds } = require('get-video-duration');

var nodemailer = require("nodemailer");


class ServiceWatchList {
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
  async  WatchList(req) {
    try {
    
      const contentId = req.body.id;
      console.log(contentId);
      const userId = req.body.userId;
      console.log(userId);
      const watchlist = new Watchlist();
      watchlist.setId(userId);
      watchlist.setUserId(userId);
      watchlist.setContentIds(contentId);
     
      const contentIdObj = new ObjectId(contentId);
      if (!ObjectId.isValid(userId)) {
        throw new Error('Invalid userId');
      }
      const userIdObj = new ObjectId(userId);
      console.log(userIdObj);
      if (!userIdObj || userIdObj.toString() !== userId) {
        console.error(`Invalid user id: ${userId}`);
        throw new Error('Invalid user id');
      }
      const result = await this.database.collection('watchlist').updateOne(
        { _id: userIdObj },
        { $addToSet: { contentIds: contentId } },
        { upsert: true }
      );
  
      return  result;
    } catch (error) {
      console.error(error);
      throw new Error('Internal server error');
    }
  }
  
}
module.exports = ServiceWatchList;
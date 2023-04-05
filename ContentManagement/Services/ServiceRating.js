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
//const uri = process.env.MONGO_URI;

const mongoUri =process.env.MONGO_URI
const client = new mongoClient(`mongodb://${mongoUri}`, {
  useUnifiedTopology: true,
});

var nodemailer = require("nodemailer");


class ServiceRating {
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
  async  RateContent(req) {
    try {
      
      const contentId = req.body.id;
      const rate = req.body.rate;
      const userId = req.body.userId;
      
      if (rate < 1 || rate > 5) {
        throw new Error('Invalid rate value. Rate must be between 1 and 5.');
      }
  
      const newRate = new Rating();
      newRate.setId(Math.random().toString(36).substr(2, 9));
      newRate.setUserId(userId);
      newRate.setContentId(contentId);
      newRate.setRating(rate);
  
      const result = await this.database.collection('content').updateOne(
        { _id: new ObjectId(contentId) },
        { $push: { Ratings: newRate } }
      );
  
      return  result;
    } catch (error) {
      console.error(error);
      throw new Error('Internal server error');
    }
  }
  async ListAllRatings(id) {
    try {
      const result = await this.database.collection('content').findOne({ _id: new ObjectId(id) });
      if (result) {
        return result.Ratings;
      } else {
        return null;
      }
    } catch (error) {
      console.error(error);
      throw new Error('Internal server error');
    }
  }
  


}

module.exports = ServiceRating;
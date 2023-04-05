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


class ServiceAnalytics {
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
  async AnalysePerformance(req) {
    try {
     const  contentId  = req.body.id; 
    const content = await this.database.collection('content').findOne({ _id: new ObjectId(contentId) });
  
      if (!content) {
        throw new Error(`Content with id ${contentId} not found`);
      }
  
      const analytics = new Analytics();
      analytics.setId(new ObjectId());
      analytics.setContentId(contentId);
      analytics.setViews(content.views);
      analytics.setWatchTime(content.watchTime);
  
      const engagementMetrics = [];
      const watchTimePerView = content.watchTime / content.views;
      engagementMetrics.push({
        type: 'watchTimePerView',
        value: watchTimePerView,
        weight: 1,
        score: watchTimePerView
      });
      const watchTimeRatio = content.watchTime / (content.views * content.video.minutes);
      engagementMetrics.push({
        type: 'watchTimeRatio',
        value: watchTimeRatio,
        weight: 1,
        score: watchTimeRatio
      });
      
      const uniqueUsers = content.history.length;
      const viewsPerUser = content.views / uniqueUsers;
      engagementMetrics.push({
        type: 'viewsPerUser',
        value: viewsPerUser,
        weight: 1,
        score: viewsPerUser
      });
      analytics.setEngagementMetrics(engagementMetrics);
  
      const result = await this.database.collection('analytics').insertOne(analytics);
  
      return result;
    } catch (error) {
      console.error(error);
      throw new Error('Internal server error');
    }
  }
  async ListAllAnalytics(id) {
    try {
     
      const result = await this.database.collection('analytics').findOne({ contentId: id });
      if (result) {
        return result;
      } else {
        return null;
      }
    } catch (error) {
      console.error(error);
      throw new Error('Internal server error');
    }
  }
}
module.exports = ServiceAnalytics;



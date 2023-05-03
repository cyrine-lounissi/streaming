const { expect } = require('chai');
const mongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const getVideoDurationInSeconds = require('get-video-duration').getVideoDurationInSeconds;
const  ServiceContent  = require('../Services/ServiceContent');
const mongoUri =process.env.MONGO_URI

describe('Content Management System', function() {
    this.timeout(5000);

    describe('addNewContent', function () {
        this.timeout(5000);

        
        it('should return an error if an invalid path is provided', async function () {
            const req = {
              files: {
                video: [
                  {
                    originalname: 'video.mp4',
                    path: null, // Invalid path
                  },
                ],
                thumbnail: [
                  {
                    originalname: 'thumbnail.jpg',
                    path: '/path/to/thumbnail.jpg',
                  },
                ],
              },
              body: {
                title: 'Test Video',
                description: 'This is a test video',
                category: 'Test',
                tags: ['test', 'video'],
                releaseDate: '2022-01-01',
              },
            };
            const serviceContent= new ServiceContent();
  
            const result = await serviceContent.addNewContent(req);
        
           
            expect(result.message).to.equal('Error adding content');
            // Check if the error object is present in the result if needed
          });
        });
    });


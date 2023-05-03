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

        /*it('should add new content to the database', async function () {
            const req = {
                files: {
                    video: [{
                        originalname: 'test-video.mp4',
                        path: '/Users/cyrinelounissi/Downloads/lesson8.mp4'
                    }],
                    thumbnail: [{
                        originalname: 'test-thumbnail.jpg',
                        path: '/Users/cyrinelounissi/Downloads/téléchargement.png '
                    }]
                },
                body: {
                    title: 'Test Video',
                    description: 'A test video',
                    category: 'Test Category',
                    tags: ['test', 'video'],
                    releaseDate: '2023-03-24'
                }
            };

            const expectedMetadata = {
                title: 'Test Video',
                id: new ObjectId(),
                description: 'lalall test video',
                genre: 'Test Category',
                releaseDate: new Date('2023-03-24'),
                thumbnail: '../uploads/demandeur2.png'
            };

            const expectedVideo = {
                id: new ObjectId(),
                hours: 0,
                minutes: 0,
                seconds: 0,
                url: '../uploads/lesson8.mp4'
            };

            const databaseName = 'ytest';
            const connectionUrl = `mongodb://${mongoUri}` + databaseName;
            const client = await mongoClient.connect(connectionUrl, { useUnifiedTopology: true });
            const database = client.db(databaseName);
            
            // insert test data into the test collection
            //await database.collection('content').insertOne({ metadata: expectedMetadata, video: expectedVideo });
            const serviceContent= new ServiceContent();

            const addNewContentResult = await serviceContent.addNewContent(req);
           
            expect(addNewContentResult.message).to.equal('File uploaded successfully');
            /*const insertedContent = await database.collection('content').findOne({ 'metadata.id': expectedMetadata.id });
            expect(insertedContent).to.exist;
            expect(insertedContent.metadata).to.deep.equal(expectedMetadata);
            expect(insertedContent.video).to.deep.equal(expectedVideo);

            // clean up the test collection by deleting the test data
            await database.collection('content').deleteOne({ metadata: { title: 'Test Data' } });

            client.close(); // close the client connection
        });*/
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


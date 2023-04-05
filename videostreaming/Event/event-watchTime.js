const amqp = require('amqplib');
const rabbitmqUri = process.env.RABBITMQ_URI
async function sendwatchTime(contentId, userId,watchTime) {
  try {
    const connection = await amqp.connect(`amqp://${rabbitmqUri}`);
    console.log('Connected to RabbitMQ server');
    const channel = await connection.createChannel();
  
    const queueName = 'video_watchTime';
    await channel.assertQueue(queueName);
  
    const message = { contentId, userId ,watchTime};
    const payload = Buffer.from(JSON.stringify(message));
  
    channel.sendToQueue(queueName, payload);
    console.log(`New watchTime event emitted with contentId: ${contentId} and userID: ${userId} with a watch time of${watchTime} `);

    await channel.close();
    await connection.close();
  } catch (error) {
    console.error('Error connecting to RabbitMQ server:', error.message);
  }
    
  }
  module.exports={sendwatchTime};
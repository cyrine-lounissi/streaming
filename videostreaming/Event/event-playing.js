const amqp = require('amqplib');
const rabbitmqUri = process.env.RABBITMQ_URI;
async function sendMessage(contentId, userId) {
  try {
    const connection = await amqp.connect(`amqp://${rabbitmqUri}`);
    console.log('Connected to RabbitMQ server');
    const channel = await connection.createChannel();
  
    const queueName = 'video_played';
    await channel.assertQueue(queueName);
  
    const message = { contentId, userId };
    const payload = Buffer.from(JSON.stringify(message));
  
    channel.sendToQueue(queueName, payload);
    console.log(`New content event emitted with contentId: ${contentId} and userID: ${userId}`);

    await channel.close();
    await connection.close();
  } catch (error) {
    console.error('Error connecting to RabbitMQ server:', error.message);
  }
   
  }
  module.exports={sendMessage};
const amqp = require('amqplib');
const rabbitmqUri = process.env.RABBITMQ_URI
async function sendMessageDeleted(contentId, userId) {
  
  try {
    const connection = await amqp.connect(`amqp://${rabbitmqUri}`);
    console.log('Connected to RabbitMQ server');
    const channel = await connection.createChannel();
  
    const queueName = 'video_deleted';
    await channel.assertQueue(queueName);
  
    const message = { contentId };
    const payload = Buffer.from(JSON.stringify(message));
  
    channel.sendToQueue(queueName, payload);
    console.log(`Content deleted  event emitted with contentId: ${contentId} `);

    await channel.close();
    await connection.close();
  } catch (error) {
    console.error('Error connecting to RabbitMQ server:', error.message);
  }
    
  }
  module.exports={sendMessageDeleted};
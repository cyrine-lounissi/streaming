const amqp = require('amqplib');
const ServiceContent = require('../Services/ServiceContent');
const rabbitmqUri = process.env.RABBITMQ_URI
const rabbitMQUrl = `amqp://${rabbitmqUri}`;
const rabbitMQExchange = 'myExchange';
const rabbitMQRoutingKey = 'video_upload';
const rabbitMQQueue = 'video_upload_queue';
async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect(rabbitMQUrl);
    const channel = await connection.createChannel();
    await channel.assertExchange(rabbitMQExchange, 'direct', { durable: true });
    await channel.assertQueue(rabbitMQQueue, { durable: true });
    await channel.bindQueue(rabbitMQQueue, rabbitMQExchange, rabbitMQRoutingKey);

    return channel;
  } catch (error) {
    console.log('Error connecting to RabbitMQ:', error);
  }
}

async function emitNewContentEvent(contentId, videoPath) {
  try {
    const channel = await connectRabbitMQ();

      await channel.sendToQueue(rabbitMQQueue, Buffer.from(JSON.stringify({ contentId, videoPath })), { persistent: true });   
      console.log(`New content event emitted with contentId: ${contentId} and videoPath: ${videoPath}`);
      console.log(contentId);
      console.log(videoPath);
  
  } catch (error) {
    console.log('Error emitting new content event:', error);
  }
}
module.exports= {emitNewContentEvent};


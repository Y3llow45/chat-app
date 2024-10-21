const amqp = require('amqplib');

let channel;

const connectRabbitMQ = async () => {
  const connection = await amqp.connect(process.env.RABBITMQ_URI);
  channel = await connection.createChannel();
  console.log('RabbitMQ connected');
};

const publishToQueue = async (queueName, message) => {
  if (!channel) throw new Error('No RabbitMQ channel found');
  await channel.assertQueue(queueName);
  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
};

module.exports = { connectRabbitMQ, publishToQueue };

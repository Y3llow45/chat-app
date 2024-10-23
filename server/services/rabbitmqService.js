const amqp = require('amqplib');
require('dotenv').config()
const RABBITMQ_URI = process.env.RABBITMQ_URI

let channel;

const connectRabbitMQ = async () => {
  const connection = await amqp.connect(RABBITMQ_URI);
  channel = await connection.createChannel();
  return channel
};

const publishToQueue = async (queueName, message) => {
  if (!channel) throw new Error('No RabbitMQ channel found');
  await channel.assertQueue(queueName);
  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
};

const getChannel = () => channel;

module.exports = { connectRabbitMQ, publishToQueue, getChannel };

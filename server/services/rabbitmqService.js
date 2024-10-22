const amqp = require('amqplib');
require('dotenv').config()
const RABBITMQ_URI = process.env.RABBITMQ_URI

let channel;

const connectRabbitMQ = async () => {
  console.log("URI: " + RABBITMQ_URI)
  const connection = await amqp.connect(RABBITMQ_URI);
  channel = await connection.createChannel();
  console.log('RabbitMQ connected');
  return channel
};

const publishToQueue = async (queueName, message) => {
  if (!channel) throw new Error('No RabbitMQ channel found');
  await channel.assertQueue(queueName);
  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
};

module.exports = { connectRabbitMQ, publishToQueue, getChanel: () => channel };

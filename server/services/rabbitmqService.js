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
  await channel.assertQueue(queueName, { durable: true });
  const sent = channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
  if (sent) {
    console.log(`Message successfully sent to queue ${queueName}`);
  } else {
    console.error(`Failed to send message to queue ${queueName}`);
  }
};

const getChannel = () => channel;

module.exports = { connectRabbitMQ, publishToQueue, getChannel };

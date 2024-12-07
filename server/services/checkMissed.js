const amqp = require('amqplib');
require('dotenv').config();

const RABBITMQ_URI = process.env.RABBITMQ_URI;

const checkRabbitMQForUser = async (username) => {
    try {
        const connection = await amqp.connect(RABBITMQ_URI);
        const channel = await connection.createChannel();

        const queueName = `missedMessages_${username}`;
        await channel.assertQueue(queueName, { durable: true });

        const messages = [];
        let msg;

        while ((msg = await channel.get(queueName))) {
            const parsedMsg = JSON.parse(msg.content.toString());
            messages.push(parsedMsg);
            channel.ack(msg);
        }

        await channel.close();
        await connection.close();
        return messages;
    } catch (err) {
        console.error(`Failed to retrieve missed messages for ${username}:`, err);
        return [];
    }
};

module.exports = { checkRabbitMQForUser };

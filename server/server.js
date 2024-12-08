require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const { connectRabbitMQ } = require('./services/rabbitmqService');

const app = express()
const PORT = parseInt(process.env.PORT, 10)

connectRabbitMQ()
    .then(() => {
        console.log('Connected to RabbitMQ');
        app.listen(PORT, () => {
            console.log(`Server is listening on port: ${PORT}`);
        });
    }).catch((err) => {
        console.error('Error starting server: ', err);
});

app.use(cors())
app.use(bodyParser.json())

module.exports = app;

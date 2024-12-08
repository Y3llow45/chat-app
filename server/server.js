require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const { connectRabbitMQ } = require('./services/rabbitmqService');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');

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

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/chat', chatRoutes);

module.exports = app;

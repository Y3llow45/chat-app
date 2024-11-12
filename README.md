# 🗨️ Chat-App
![Vite badge](https://img.shields.io/badge/Vite-5.4.10-orange)
![Static Badge](https://img.shields.io/badge/React-18.2.0-blue)
![Express badge](https://img.shields.io/badge/Express-4.19.2-green)
![amqplib badge](https://img.shields.io/badge/amqplib-0.10.4-purple)
![Socket badge](https://img.shields.io/badge/Socket-4.7.5-yellow)
![Bcrypt badge](https://img.shields.io/badge/Bcrypt-5.1.1-blue)
![JWT badge](https://img.shields.io/badge/JWT-9.0.2-purple)
![Mongoose badge](https://img.shields.io/badge/mongoose-7.4.5-lightgreen)
![PostgreSQL badge](https://img.shields.io/badge/PostgreSQL-15.8.0-orange)
![Nodemon badge](https://img.shields.io/badge/Nodemon-3.1.4-blue)
![framer-motion badge](https://img.shields.io/badge/framerMotion-11.5.4-red)

## 🚀 Project Overview

Chato is an encrypted, real-time chat platform built for secure communication with a focus on privacy and speed.

## 📌 Features

1. AES Encryption
2. Real-time messaging
3. Offline queuing with RabbitMQ
4. Searchable chat history
5. Friend requests and notifications
6. Edit and delete messages
7. Scalable architecture
    
## 🛠️ Tech Stack
Frontend:          React, TypeScript, JavaScript, HTML, CSS <br>
Backend:           Express (Node.js) <br>
Message queuing:   RabbitMQ <br>
Database:          MongoDB and PostgreSQL <br>
CI/CD:             GitHub Actions <br>
Testing:           Cypress and Postman <br>

### Start Project
1. Download RabbitMQ 4.0.2 and Erlang 27.1.2. <br>
    1.1. Run `rabbitmq-plugins.bat enable rabbitmq_management` to enable the management plugin. <br>
    1.2. Stop and restart the RabbitMQ service. <br>
    1.3. Access the RabbitMQ Management Dashboard at http://localhost:15672 (username: guest, password: guest).
2. Create a PostgreSQL database locally and copy the connection URI to use in the environment variables.
3. Create database inside cluster using MongoDB atlas.
4. Create a .env file in the root of your project directory and add the following:
    `PORT=5242` <br>
    `SPORT=5243` <br>
    `ATLASURI="mongodb://{Copy the connection uri from connections tab}.mongodb.net:27017/chatappusers?` <br>
    `ssl=true&replicaSet=atlas-347qvn-shard-0&authSource=admin&retryWrites=true&w=majority&appName=MyCluster"` <br>
    `saltRounds=6` <br>
    `SSKEY='secrete*'` <br>
    `RABBITMQ_URI=amqp://127.0.0.1:5672` <br>
5. Run these commands
   5.1 `git clone https://github.com/Y3llow45/chat-app` <br>
   5.2 `cd chat-app` <br>
   5.3 `npm install` <br>
   5.4 `npm start` <br>

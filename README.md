# chat-app
Encrypted chat app

### Tech Stack
    Frontend:        React, TypeScript, JavaScript, HTML, CSS
    Backend:         Express (Node.js)
    Message Queue:   RabbitMQ (for message brokering, like friend request notifications)
    Database:        MongoDB
    CI/CD:           GitHub Actions (with Super-Linter for code quality)
    Testing:         Jest/Cypress and Postman

### Start Project
    Download and install RabbitMQ 4.0.2 and Erlang 27.1.2
    Open cmd and run "rabbitmq-plugins.bat enable rabbitmq_management"
    Stop then start rabbitmq service
    Open RabbitMQ Managment from http://localhost:15672/ (username: guest, password: guest)
    Create databse inside cluster using MongoDB atlas
    Copy the connection uri from connections tab and paste it in .env (ATLASURI="your connection string")
    Run "npm install" and then "npm start"

# chat-app
Encrypted chat app

### Tech Stack
    Frontend:        React, TypeScript, JavaScript, HTML, CSS
    Backend:         Express (Node.js)
    Message Queue:   RabbitMQ (for message brokering, like friend request notifications)
    Database:        MongoDB
    CI/CD:           GitHub Actions (with Super-Linter for code quality)
    Testing:         Jest/Cypress and Postman

### Set up RabbitMQ server (you can use it with Docker as well)
    Download Erlang and RabbitMQ
    Open cmd and run "rabbitmq-plugins.bat enable rabbitmq_management"
    Stop then start rabbitmq service
    Open RabbitMQ Managment from http://localhost:15672/ (username: guest, password: guest)

const request = require('supertest');
const app = require('../server');
const pool = require('../services/db');

describe('POST /signup', () => {
    it('should create a new user', async () => {
        const response = await request(app)
        .post('/signup')
        .send({
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password123',
        });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Account created');
  });

    it('should return error if username already exists', async () => {
        await request(app)
        .post('/signup')
        .send({
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password123',
        });

        const response = await request(app)
        .post('/signup')
        .send({
            username: 'testuser',
            email: 'another@example.com',
            password: 'password123',
        });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Username already exists');
  });
});

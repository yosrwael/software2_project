// tests/rateLimiter.test.js
const request = require('supertest');
const express = require('express');
const rateLimiter = require('../middlewares/rateLimiter'); // تستدعي middleware هنا

const app = express();
app.use(rateLimiter);
app.get('/auth', (req, res) => {
  res.status(200).send('OK');
});

describe('Rate Limit', () => {
  it('should block after 3 requests', async () => {
    await request(app).get('/auth').expect(200);
    await request(app).get('/auth').expect(200);
    await request(app).get('/auth').expect(200);
    await request(app).get('/auth').expect(429); // blocked
  });
});

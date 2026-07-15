const request = require('supertest');
const app = require('../app');
const { closeDatabase } = require('../models/db');

describe('GiftLink backend', () => {
  afterAll(async () => {
    await closeDatabase();
  });

  it('responds to the health check', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('rejects registration with an invalid email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ firstName: 'Lav', lastName: 'T', email: 'not-an-email', password: '123456' });
    expect(res.statusCode).toBe(400);
  });

  it('rejects login with missing credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({});
    expect(res.statusCode).toBe(400);
  });
});

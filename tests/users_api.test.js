const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);

test('users are returned as json', async () => {
  await api
    .get('/api/users/')
    .expect(200)
    .expect('Content-Type', /application\/json/);
}, 30000);

afterAll(() => {
  mongoose.connection.close();
});

test('invalid user is created', async () => {
  const invalidUser = {
    name: 'divino',
    passwordHash: 'dakdla',
  };

  const initialDb = await api.get('/api/users/');
  await api.post('/api/users/').send(invalidUser).expect(400);

  const userInDb = await api.get('/api/users/');

  expect(userInDb.body).toHaveLength(initialDb.body.length);
});

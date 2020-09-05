const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs/')
    .expect(200)
    .expect('Content-Type', /application\/json/);
}, 30000);

test('id property is define', async () => {
  const blogs = await api.get('/api/blogs/');
  console.log(blogs.body);
  const id = blogs.body.map((blog) => blog.id);
  expect(id[0]).toBeDefined();
}, 30000);

test('successfully created a new blog', async () => {
  const newBlog = {
    title: 'tite kubo',
    author: 'aaron alkabalki',
    url: 'twitter.com',
    likes: 10000,
  };

  const blogInitial = await api.get('/api/blogs/');

  await api.post('/api/blogs/').send(newBlog);

  const blogFinal = await api.get('/api/blogs/');
  expect(blogFinal.body).toHaveLength(blogInitial.body.length + 1);
}, 30000);

test('like set default to zero', async () => {
  const newBlog = {
    title: 'tite kubo',
    author: 'aaron alkabalki',
    url: 'twitter.com',
  };

  const blog = await api.post('/api/blogs/').send(newBlog);

  expect(blog.body.likes).toBe(0);
}, 30000);

test('required fields', async () => {
  const newBlog = {
    url: 'twitter.com',
  };

  await api.post('/api/blogs/').send(newBlog).expect(400);
}, 30000);

afterAll(() => {
  mongoose.connection.close();
});

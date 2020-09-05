const blogsRouter = require('express').Router();
const Blog = require('../models/blogs');
const User = require('../models/users');
const jwt = require('jsonwebtoken');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
  const body = request.body;

  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }
  const user = await User.findById(decodedToken.id);

  if (body.title === undefined || body.author === undefined) {
    return response.status(400).json({ error: 'something is missing' });
  }

  const newblog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id,
  });
  const savedBlogs = await newblog.save();
  user.blogs = user.blogs.concat(savedBlogs.id);
  await user.save();
  response.json(savedBlogs);
});

blogsRouter.delete('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id);

  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }
  const user = await User.findById(decodedToken.id);

  if (blog.user.toString() === user._id.toString()) {
    const deletedBlog = await Blog.findByIdAndRemove(blog._id);
    user.blogs = user.blogs.filter((b) => b.toString() !== blog._id.toString());
    await user.save();
    response.json(deletedBlog);
  } else {
    return response.status(400).json({ error: 'bad request' });
  }
});

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body;

  if (body.title === undefined || body.author === undefined) {
    return response.status(400).json({ error: 'something is missing' });
  }

  const newblog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  const update = await Blog.findByIdAndUpdate(request.params.id, newblog);

  response.json(update);
});

module.exports = blogsRouter;

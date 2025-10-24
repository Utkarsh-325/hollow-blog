const express = require('express');
const Post = require('../models/Post');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all
router.get('/', async (req, res) => {
  const posts = await Post.find().sort({date: -1});
  res.json(posts);
});

// Create
router.post('/', auth, async (req, res) => {
  const post = new Post({...req.body, author: req.user.username});
  await post.save();
  res.json(post);
});

// Edit
router.put('/:id', auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post.author !== req.user.username) return res.status(403).json({msg:'Not authorized'});
  Object.assign(post, req.body);
  await post.save();
  res.json(post);
});

// Delete
router.delete('/:id', auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post.author !== req.user.username) return res.status(403).json({msg:'Not authorized'});
  await post.deleteOne();
  res.json({msg:'Deleted'});
});

module.exports = router;

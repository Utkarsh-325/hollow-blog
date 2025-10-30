// backend/routes/posts.js
import express from 'express';
import Post from '../models/Post.js';
import User from '../models/User.js';
import { protect, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/posts
// @desc    Get all posts with filtering, sorting, and pagination
// @access  Public
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      sort = '-createdAt',
      category,
      tag,
      search,
      author,
      status = 'published'
    } = req.query;

    const query = { status };

    // Filters
    if (category) query.category = category;
    if (tag) query.tags = tag;
    if (author) query.author = author;
    if (search) {
      query.$text = { $search: search };
    }

    const posts = await Post.find(query)
      .populate('author', 'username avatar')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Post.countDocuments(query);

    res.json({
      success: true,
      posts,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/posts/trending
// @desc    Get trending posts
// @access  Public
router.get('/trending', async (req, res, next) => {
  try {
    const posts = await Post.find({ status: 'published' })
      .populate('author', 'username avatar')
      .sort('-views -likes')
      .limit(5)
      .lean();

    res.json({
      success: true,
      posts
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/posts/featured
// @desc    Get featured posts
// @access  Public
router.get('/featured', async (req, res, next) => {
  try {
    const posts = await Post.find({ status: 'published', featured: true })
      .populate('author', 'username avatar')
      .sort('-publishedAt')
      .limit(3)
      .lean();

    res.json({
      success: true,
      posts
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/posts/:slug
// @desc    Get single post by slug
// @access  Public
router.get('/:slug', optionalAuth, async (req, res, next) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug })
      .populate('author', 'username avatar bio')
      .populate({
        path: 'comments',
        populate: { path: 'author', select: 'username avatar' }
      });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Increment views (don't await to not slow down response)
    post.incrementViews();

    res.json({
      success: true,
      post
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/posts
// @desc    Create new post
// @access  Private
router.post('/', protect, async (req, res, next) => {
  try {
    const { title, content, tags, category, coverImage, status } = req.body;

    const post = await Post.create({
      title,
      content,
      tags: tags || [],
      category,
      coverImage,
      status: status || 'published',
      author: req.user.id
    });

    const populatedPost = await Post.findById(post._id)
      .populate('author', 'username avatar');

    res.status(201).json({
      success: true,
      post: populatedPost
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: messages.join(', ') });
    }
    next(error);
  }
});

// @route   PUT /api/posts/:id
// @desc    Update post
// @access  Private (author only)
router.put('/:id', protect, async (req, res, next) => {
  try {
    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check ownership
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ 
        error: 'You are not authorized to edit this post' 
      });
    }

    const { title, content, tags, category, coverImage, status } = req.body;

    post = await Post.findByIdAndUpdate(
      req.params.id,
      { title, content, tags, category, coverImage, status },
      { new: true, runValidators: true }
    ).populate('author', 'username avatar');

    res.json({
      success: true,
      post
    });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/posts/:id
// @desc    Delete post
// @access  Private (author only)
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check ownership
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ 
        error: 'You are not authorized to delete this post' 
      });
    }

    await post.deleteOne();

    res.json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/posts/:id/like
// @desc    Like/unlike a post
// @access  Private
router.put('/:id/like', protect, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const likeIndex = post.likes.indexOf(req.user.id);

    if (likeIndex === -1) {
      // Like the post
      post.likes.push(req.user.id);
    } else {
      // Unlike the post
      post.likes.splice(likeIndex, 1);
    }

    await post.save();

    res.json({
      success: true,
      likes: post.likes.length,
      liked: likeIndex === -1
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/posts/:id/save
// @desc    Save/unsave a post
// @access  Private
router.put('/:id/save', protect, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const user = await User.findById(req.user.id);
    const saveIndex = user.savedPosts.indexOf(req.params.id);

    if (saveIndex === -1) {
      user.savedPosts.push(req.params.id);
    } else {
      user.savedPosts.splice(saveIndex, 1);
    }

    await user.save();

    res.json({
      success: true,
      saved: saveIndex === -1
    });
  } catch (error) {
    next(error);
  }
});

export default router;
import express from 'express';
import User from '../models/User.js';
import Post from '../models/Post.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/users/:username
// @desc    Get user profile by username
// @access  Public
router.get('/:username', async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select('-password')
      .populate('followers', 'username avatar')
      .populate('following', 'username avatar');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user's posts
    const posts = await Post.find({ 
      author: user._id, 
      status: 'published' 
    })
      .sort('-createdAt')
      .limit(10)
      .select('title slug excerpt createdAt views likes');

    res.json({
      success: true,
      user: user.getPublicProfile(),
      posts,
      stats: {
        postsCount: posts.length,
        followersCount: user.followers.length,
        followingCount: user.following.length
      }
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/users/:id/follow
// @desc    Follow/unfollow a user
// @access  Private
router.put('/:id/follow', protect, async (req, res, next) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({ error: 'You cannot follow yourself' });
    }

    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!userToFollow) {
      return res.status(404).json({ error: 'User not found' });
    }

    const followIndex = currentUser.following.indexOf(req.params.id);

    if (followIndex === -1) {
      // Follow
      currentUser.following.push(req.params.id);
      userToFollow.followers.push(req.user.id);
    } else {
      // Unfollow
      currentUser.following.splice(followIndex, 1);
      userToFollow.followers.splice(
        userToFollow.followers.indexOf(req.user.id), 
        1
      );
    }

    await currentUser.save();
    await userToFollow.save();

    res.json({
      success: true,
      following: followIndex === -1
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/users/:id/posts
// @desc    Get all posts by user
// @access  Public
router.get('/:id/posts', async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const posts = await Post.find({ 
      author: req.params.id,
      status: 'published'
    })
      .populate('author', 'username avatar')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Post.countDocuments({ 
      author: req.params.id,
      status: 'published'
    });

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

export default router;
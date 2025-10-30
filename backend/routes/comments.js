import express from 'express';
import Comment from '../models/Comment.js';
import Post from '../models/Post.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/comments/post/:postId
// @desc    Get all comments for a post
// @access  Public
router.get('/post/:postId', async (req, res, next) => {
  try {
    const comments = await Comment.find({ 
      post: req.params.postId,
      parentComment: null
    })
      .populate('author', 'username avatar')
      .populate({
        path: 'replies',
        populate: { path: 'author', select: 'username avatar' }
      })
      .sort('-createdAt');

    res.json({
      success: true,
      comments
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/comments
// @desc    Create a comment
// @access  Private
router.post('/', protect, async (req, res, next) => {
  try {
    const { content, postId, parentCommentId } = req.body;

    if (!content || !postId) {
      return res.status(400).json({ 
        error: 'Content and post ID are required' 
      });
    }

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const comment = await Comment.create({
      content,
      author: req.user.id,
      post: postId,
      parentComment: parentCommentId || null
    });

    const populatedComment = await Comment.findById(comment._id)
      .populate('author', 'username avatar');

    res.status(201).json({
      success: true,
      comment: populatedComment
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/comments/:id
// @desc    Update a comment
// @access  Private
router.put('/:id', protect, async (req, res, next) => {
  try {
    let comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({ 
        error: 'You are not authorized to edit this comment' 
      });
    }

    comment.content = req.body.content;
    comment.isEdited = true;
    comment.editedAt = Date.now();

    await comment.save();

    const populatedComment = await Comment.findById(comment._id)
      .populate('author', 'username avatar');

    res.json({
      success: true,
      comment: populatedComment
    });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/comments/:id
// @desc    Delete a comment
// @access  Private
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (comment.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ 
        error: 'You are not authorized to delete this comment' 
      });
    }

    // Delete all replies as well
    await Comment.deleteMany({ parentComment: req.params.id });
    await comment.deleteOne();

    res.json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/comments/:id/like
// @desc    Like/unlike a comment
// @access  Private
router.put('/:id/like', protect, async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    const likeIndex = comment.likes.indexOf(req.user.id);

    if (likeIndex === -1) {
      comment.likes.push(req.user.id);
    } else {
      comment.likes.splice(likeIndex, 1);
    }

    await comment.save();

    res.json({
      success: true,
      likes: comment.likes.length,
      liked: likeIndex === -1
    });
  } catch (error) {
    next(error);
  }
});

export default router;
// frontend/src/components/CommentSection.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const CommentItem = ({ comment, onReply, onDelete, onEdit, onLike }) => {
  const { user } = useAuth();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const isAuthor = user?._id === comment.author._id;

  const handleReply = async () => {
    if (!replyContent.trim()) return;
    await onReply(comment._id, replyContent);
    setReplyContent('');
    setShowReplyForm(false);
  };

  const handleEdit = async () => {
    if (!editContent.trim()) return;
    await onEdit(comment._id, editContent);
    setIsEditing(false);
  };

  return (
    <div className="border-l-2 border-blue-500/30 pl-4 py-3">
      <div className="flex items-start gap-3">
        <Link to={`/user/${comment.author.username}`}>
          <img
            src={comment.author.avatar}
            alt={comment.author.username}
            className="w-10 h-10 rounded-full border-2 border-blue-500/50"
          />
        </Link>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Link
              to={`/user/${comment.author.username}`}
              className="font-semibold text-gray-200 hover:text-blue-400 transition-colors"
            >
              {comment.author.username}
            </Link>
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
            </span>
            {comment.isEdited && (
              <span className="text-xs text-gray-500 italic">(edited)</span>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-gray-100 focus:outline-none focus:border-blue-500"
                rows="3"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleEdit}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditContent(comment.content);
                  }}
                  className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-200 text-sm rounded transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-300 mb-2">{comment.content}</p>
          )}

          {!isEditing && (
            <div className="flex items-center gap-3 text-sm">
              <button
                onClick={() => onLike(comment._id)}
                className="flex items-center gap-1 text-gray-400 hover:text-red-400 transition-colors"
              >
                <span>{comment.likes?.includes(user?._id) ? '❤️' : '🤍'}</span>
                <span>{comment.likes?.length || 0}</span>
              </button>

              {user && (
                <button
                  onClick={() => setShowReplyForm(!showReplyForm)}
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Reply
                </button>
              )}

              {isAuthor && (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(comment._id)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          )}

          {showReplyForm && (
            <div className="mt-3 space-y-2">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500"
                rows="3"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleReply}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                >
                  Reply
                </button>
                <button
                  onClick={() => {
                    setShowReplyForm(false);
                    setReplyContent('');
                  }}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 text-sm rounded transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 space-y-3">
              {comment.replies.map(reply => (
                <CommentItem
                  key={reply._id}
                  comment={reply}
                  onReply={onReply}
                  onDelete={onDelete}
                  onEdit={onEdit}
                  onLike={onLike}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CommentSection = ({ postId }) => {
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const response = await api.get(`/comments/post/${postId}`);
      setComments(response.data.comments);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to comment');
      return;
    }

    if (!newComment.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    try {
      await api.post('/comments', {
        content: newComment,
        postId
      });
      setNewComment('');
      fetchComments();
      toast.success('Comment added!');
    } catch (error) {
      toast.error('Failed to add comment');
    }
  };

  const handleReply = async (parentCommentId, content) => {
    try {
      await api.post('/comments', {
        content,
        postId,
        parentCommentId
      });
      fetchComments();
      toast.success('Reply added!');
    } catch (error) {
      toast.error('Failed to add reply');
    }
  };

  const handleDelete = async (commentId) => {
    if (!confirm('Delete this comment?')) return;

    try {
      await api.delete(`/comments/${commentId}`);
      fetchComments();
      toast.success('Comment deleted');
    } catch (error) {
      toast.error('Failed to delete comment');
    }
  };

  const handleEdit = async (commentId, content) => {
    try {
      await api.put(`/comments/${commentId}`, { content });
      fetchComments();
      toast.success('Comment updated');
    } catch (error) {
      toast.error('Failed to update comment');
    }
  };

  const handleLike = async (commentId) => {
    if (!isAuthenticated) {
      toast.error('Please login to like comments');
      return;
    }

    try {
      await api.put(`/comments/${commentId}/like`);
      fetchComments();
    } catch (error) {
      toast.error('Failed to like comment');
    }
  };

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-gray-100 mb-6 flex items-center gap-2">
        <span>💬</span>
        <span>Comments ({comments.length})</span>
      </h2>

      {/* Add Comment Form */}
      {isAuthenticated ? (
        <div className="bg-gray-800 border border-blue-500/30 rounded-lg p-6 mb-8">
          <div className="flex gap-3">
            <img
              src={user?.avatar}
              alt={user?.username}
              className="w-10 h-10 rounded-full border-2 border-blue-500"
            />
            <div className="flex-1 space-y-3">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts..."
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                rows="4"
              />
              <button
                onClick={handleAddComment}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105"
              >
                Post Comment
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-800 border border-blue-500/30 rounded-lg p-6 mb-8 text-center">
          <p className="text-gray-400 mb-4">Please login to join the discussion</p>
          <Link
            to="/login"
            className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            Login
          </Link>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12 bg-gray-800/50 rounded-lg">
          <div className="text-5xl mb-4">🦗</div>
          <p className="text-gray-400">No comments yet. Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map(comment => (
            <CommentItem
              key={comment._id}
              comment={comment}
              onReply={handleReply}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onLike={handleLike}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
// frontend/src/pages/PostDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmModal from '../components/ConfirmModal';
import CommentSection from '../components/CommentSection';

const PostDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [saved, setSaved] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    try {
      const response = await api.get(`/posts/${slug}`);
      setPost(response.data.post);
      setLikeCount(response.data.post.likes?.length || 0);
      
      if (user) {
        setLiked(response.data.post.likes?.includes(user._id));
        setSaved(user.savedPosts?.includes(response.data.post._id));
      }
    } catch (error) {
      toast.error('Post not found');
      navigate('/posts');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to like posts');
      return;
    }

    try {
      const response = await api.put(`/posts/${post._id}/like`);
      setLiked(response.data.liked);
      setLikeCount(response.data.likes);
    } catch (error) {
      toast.error('Failed to like post');
    }
  };

  const handleSave = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to save posts');
      return;
    }

    try {
      const response = await api.put(`/posts/${post._id}/save`);
      setSaved(response.data.saved);
      toast.success(response.data.saved ? 'Post saved!' : 'Post unsaved');
    } catch (error) {
      toast.error('Failed to save post');
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/posts/${post._id}`);
      toast.success('Post deleted successfully');
      navigate('/profile');
    } catch (error) {
      toast.error('Failed to delete post');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!post) return null;

  const isAuthor = user?._id === post.author._id;

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section with Cover Image */}
      {post.coverImage && (
        <div className="relative h-96 overflow-hidden">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-400 hover:text-blue-300 mb-6 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Posts
        </button>

        {/* Post Header */}
        <div className="mb-8">
          {/* Category Badge */}
          <span className="inline-block bg-blue-600/20 text-blue-400 text-sm px-3 py-1 rounded-full mb-4">
            {post.category}
          </span>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-100 mb-4 leading-tight">
            {post.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 text-gray-400">
            <Link
              to={`/user/${post.author.username}`}
              className="flex items-center gap-3 hover:text-blue-400 transition-colors"
            >
              <img
                src={post.author.avatar}
                alt={post.author.username}
                className="w-12 h-12 rounded-full border-2 border-blue-500"
              />
              <div>
                <p className="font-semibold text-gray-200">{post.author.username}</p>
                <p className="text-sm">{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</p>
              </div>
            </Link>

            <div className="flex items-center gap-4 text-sm">
              <span>📖 {post.readTime} min read</span>
              <span>👁️ {post.views} views</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-8 pb-8 border-b border-gray-800">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              liked
                ? 'bg-red-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <span>{liked ? '❤️' : '🤍'}</span>
            <span>{likeCount}</span>
          </button>

          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              saved
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <span>{saved ? '⭐' : '☆'}</span>
            <span>{saved ? 'Saved' : 'Save'}</span>
          </button>

          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.success('Link copied!');
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 hover:bg-gray-700 rounded-lg font-medium transition-all"
          >
            <span>🔗</span>
            <span>Share</span>
          </button>

          {isAuthor && (
            <>
              <Link
                to={`/edit/${post._id}`}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all ml-auto"
              >
                <span>✏️</span>
                <span>Edit</span>
              </Link>

              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all"
              >
                <span>🗑️</span>
                <span>Delete</span>
              </button>
            </>
          )}
        </div>

        {/* Post Content */}
        <article className="prose prose-invert prose-lg max-w-none mb-12">
          <div
            className="text-gray-300 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8 pb-8 border-b border-gray-800">
            {post.tags.map((tag, index) => (
              <Link
                key={index}
                to={`/posts?tag=${tag}`}
                className="px-3 py-1 bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 rounded-full text-sm transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}

        {/* Author Bio */}
        <div className="bg-gray-800 border border-blue-500/30 rounded-lg p-6 mb-12">
          <div className="flex items-start gap-4">
            <Link to={`/user/${post.author.username}`}>
              <img
                src={post.author.avatar}
                alt={post.author.username}
                className="w-16 h-16 rounded-full border-2 border-blue-500"
              />
            </Link>
            <div className="flex-1">
              <Link
                to={`/user/${post.author.username}`}
                className="text-xl font-semibold text-gray-100 hover:text-blue-400 transition-colors"
              >
                {post.author.username}
              </Link>
              <p className="text-gray-400 mt-2">{post.author.bio || 'A wanderer exploring Hallownest...'}</p>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <CommentSection postId={post._id} />
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Post?"
        message="Are you sure you want to delete this post? This action cannot be undone."
      />

      {/* Custom Prose Styles */}
      <style jsx global>{`
        .prose-invert {
          color: #d1d5db;
        }
        .prose-invert h1, .prose-invert h2, .prose-invert h3, 
        .prose-invert h4, .prose-invert h5, .prose-invert h6 {
          color: #f3f4f6;
          margin-top: 2em;
          margin-bottom: 1em;
        }
        .prose-invert a {
          color: #60a5fa;
          text-decoration: none;
        }
        .prose-invert a:hover {
          color: #93c5fd;
          text-decoration: underline;
        }
        .prose-invert strong {
          color: #f3f4f6;
        }
        .prose-invert code {
          background: #1f2937;
          color: #60a5fa;
          padding: 0.2em 0.4em;
          border-radius: 0.25rem;
        }
        .prose-invert pre {
          background: #1f2937;
          border: 1px solid #374151;
        }
        .prose-invert blockquote {
          border-left: 4px solid #60a5fa;
          color: #9ca3af;
          padding-left: 1em;
          font-style: italic;
        }
        .prose-invert img {
          border-radius: 0.5rem;
          margin: 2em 0;
        }
      `}</style>
    </div>
  );
};

export default PostDetail;
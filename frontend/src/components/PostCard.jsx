import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const PostCard = ({ post, featured = false }) => {
  return (
    <Link
      to={`/posts/${post.slug}`}
      className={`block bg-gray-800 rounded-lg overflow-hidden border border-blue-500/30 hover:border-blue-500 transition-all transform hover:scale-105 ${
        featured ? 'shadow-lg shadow-blue-500/20' : ''
      }`}
    >
      {/* Cover Image */}
      {post.coverImage && (
        <div className="aspect-video overflow-hidden">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-6">
        {/* Category Badge */}
        {post.category && (
          <span className="inline-block bg-blue-600/20 text-blue-400 text-xs px-2 py-1 rounded mb-2">
            {post.category}
          </span>
        )}

        {/* Title */}
        <h3 className={`font-bold text-gray-100 mb-2 line-clamp-2 ${
          featured ? 'text-xl' : 'text-lg'
        }`}>
          {post.title}
        </h3>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-gray-400 text-sm mb-4 line-clamp-3">
            {post.excerpt}
          </p>
        )}

        {/* Author & Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img
              src={post.author?.avatar}
              alt={post.author?.username}
              className="w-8 h-8 rounded-full"
            />
            <div>
              <p className="text-sm text-gray-300">{post.author?.username}</p>
              <p className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-gray-400 text-sm">
            {post.readTime && (
              <span>📖 {post.readTime} min</span>
            )}
            {post.views !== undefined && (
              <span>👁️ {post.views}</span>
            )}
            {post.likes && (
              <span>❤️ {post.likes.length}</span>
            )}
          </div>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {post.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="text-xs text-purple-400 bg-purple-600/20 px-2 py-1 rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
};

export default PostCard;
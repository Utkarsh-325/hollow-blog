// frontend/src/pages/Saved.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import PostCard from '../components/PostCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Link } from 'react-router-dom';

const Saved = () => {
  const { user } = useAuth();
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedPosts();
  }, []);

  const fetchSavedPosts = async () => {
    try {
      // Fetch user's saved posts
      const promises = user.savedPosts.map(postId => 
        api.get(`/posts/${postId}`).catch(() => null)
      );
      
      const results = await Promise.all(promises);
      const posts = results
        .filter(res => res !== null)
        .map(res => res.data.post);
      
      setSavedPosts(posts);
    } catch (error) {
      console.error('Error fetching saved posts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-5xl">⭐</span>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Saved Posts
            </h1>
          </div>
          <p className="text-gray-400">
            Your collection of cherished tales from Hallownest
          </p>
        </div>

        {/* Saved Posts */}
        {savedPosts.length === 0 ? (
          <div className="text-center py-16 bg-gray-800/50 rounded-lg">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-bold text-gray-300 mb-2">
              No Saved Posts Yet
            </h3>
            <p className="text-gray-500 mb-6">
              Start saving posts you want to read later
            </p>
            <Link
              to="/posts"
              className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Explore Posts
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedPosts.map(post => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Saved;
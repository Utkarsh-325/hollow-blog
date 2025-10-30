// frontend/src/pages/Profile.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Profile = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('published'); // published, drafts

  useEffect(() => {
    fetchUserData();
  }, [activeTab]);

  const fetchUserData = async () => {
    try {
      const [postsRes, userRes] = await Promise.all([
        api.get(`/users/${user._id}/posts?status=${activeTab}`),
        api.get('/auth/me')
      ]);

      setPosts(postsRes.data.posts);
      setStats({
        postsCount: postsRes.data.pagination.total,
        followersCount: userRes.data.user.followers?.length || 0,
        followingCount: userRes.data.user.following?.length || 0
      });
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-blue-500/30 rounded-lg p-8 mb-8 relative overflow-hidden">
          {/* Decorative Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 pointer-events-none" />
          
          <div className="relative flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <img
              src={user.avatar}
              alt={user.username}
              className="w-32 h-32 rounded-full border-4 border-blue-500 shadow-lg shadow-blue-500/30"
            />

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-100 mb-2">{user.username}</h1>
              <p className="text-gray-400 mb-4">{user.bio || 'A wanderer exploring Hallownest...'}</p>

              {/* Stats */}
              <div className="flex gap-6 justify-center md:justify-start mb-4">
                <div>
                  <p className="text-2xl font-bold text-blue-400">{stats.postsCount}</p>
                  <p className="text-sm text-gray-500">Posts</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-400">{stats.followersCount}</p>
                  <p className="text-sm text-gray-500">Followers</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-400">{stats.followingCount}</p>
                  <p className="text-sm text-gray-500">Following</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-center md:justify-start">
                <Link
                  to="/settings"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Edit Profile
                </Link>
                <Link
                  to="/create"
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Write Post
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-800">
          <button
            onClick={() => setActiveTab('published')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'published'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Published ({stats.postsCount})
          </button>
          <button
            onClick={() => setActiveTab('draft')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'draft'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Drafts
          </button>
        </div>

        {/* Posts Grid */}
        {posts.length === 0 ? (
          <div className="text-center py-16 bg-gray-800/50 rounded-lg">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-bold text-gray-300 mb-2">
              {activeTab === 'published' ? 'No Published Posts Yet' : 'No Drafts'}
            </h3>
            <p className="text-gray-500 mb-6">
              {activeTab === 'published' 
                ? 'Start sharing your journey through Hallownest'
                : 'Your saved drafts will appear here'
              }
            </p>
            <Link
              to="/create"
              className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Create Your First Post
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(post => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
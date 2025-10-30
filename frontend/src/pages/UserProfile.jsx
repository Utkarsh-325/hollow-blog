import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const UserProfile = () => {
  const { username } = useParams();
  const { user: currentUser, isAuthenticated } = useAuth();
  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, [username]);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get(`/users/${username}`);
      setProfileUser(response.data.user);
      setPosts(response.data.posts);
      setStats(response.data.stats);
      
      if (currentUser) {
        setIsFollowing(response.data.user.followers.some(f => f._id === currentUser._id));
      }
    } catch (error) {
      toast.error('User not found');
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to follow users');
      return;
    }

    try {
      const response = await api.put(`/users/${profileUser._id}/follow`);
      setIsFollowing(response.data.following);
      
      // Update follower count
      setStats(prev => ({
        ...prev,
        followersCount: response.data.following 
          ? prev.followersCount + 1 
          : prev.followersCount - 1
      }));
      
      toast.success(response.data.following ? 'Followed!' : 'Unfollowed');
    } catch (error) {
      toast.error('Failed to follow user');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!profileUser) return null;

  const isOwnProfile = currentUser?._id === profileUser._id;

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
              src={profileUser.avatar}
              alt={profileUser.username}
              className="w-32 h-32 rounded-full border-4 border-blue-500 shadow-lg shadow-blue-500/30"
            />

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-100 mb-2">{profileUser.username}</h1>
              <p className="text-gray-400 mb-4">{profileUser.bio || 'A wanderer exploring Hallownest...'}</p>

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

              {/* Follow Button */}
              {!isOwnProfile && isAuthenticated && (
                <button
                  onClick={handleFollow}
                  className={`px-8 py-3 font-semibold rounded-lg transition-all transform hover:scale-105 ${
                    isFollowing
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-100'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                  }`}
                >
                  {isFollowing ? 'Unfollow' : 'Follow'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* User's Posts */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-100 mb-4">
            {isOwnProfile ? 'Your Posts' : `${profileUser.username}'s Posts`}
          </h2>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-16 bg-gray-800/50 rounded-lg">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-bold text-gray-300 mb-2">
              No Posts Yet
            </h3>
            <p className="text-gray-500">
              {isOwnProfile 
                ? 'Start sharing your journey through Hallownest'
                : `${profileUser.username} hasn't posted anything yet`
              }
            </p>
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

export default UserProfile;
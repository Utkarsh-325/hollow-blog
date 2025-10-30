import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import PostCard from '../components/PostCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [trending, setTrending] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const [featuredRes, trendingRes, recentRes] = await Promise.all([
        api.get('/posts/featured'),
        api.get('/posts/trending'),
        api.get('/posts?limit=6')
      ]);

      setFeatured(featuredRes.data.posts);
      setTrending(trendingRes.data.posts);
      setRecent(recentRes.data.posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-gray-800 to-gray-900 py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
            Welcome to Hallownest
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            A journal for wanderers exploring the depths of Hollow Knight lore, 
            guides, art, and community discussions.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/posts"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-all transform hover:scale-105"
            >
              Explore Posts
            </Link>
            <Link
              to="/register"
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-all transform hover:scale-105"
            >
              Join the Journey
            </Link>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 text-6xl opacity-20 animate-bounce">🦋</div>
        <div className="absolute bottom-10 right-10 text-6xl opacity-20 animate-bounce delay-500">⚔️</div>
      </section>

      {/* Featured Posts */}
      {featured.length > 0 && (
        <section className="py-16 px-4 bg-gray-900">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-blue-400">Featured Stories</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featured.map(post => (
                <PostCard key={post._id} post={post} featured />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Trending Posts */}
      {trending.length > 0 && (
        <section className="py-16 px-4 bg-gray-800">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-purple-400">Trending Now</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trending.map(post => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Posts */}
      <section className="py-16 px-4 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-blue-400">Recent Posts</h2>
            <Link to="/posts" className="text-purple-400 hover:text-purple-300">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recent.map(post => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4 bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center text-blue-400">Explore by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Lore', 'Guide', 'Art', 'Discussion'].map(category => (
              <Link
                key={category}
                to={`/posts?category=${category}`}
                className="bg-gray-700 hover:bg-gray-600 p-6 rounded-lg text-center transition-all transform hover:scale-105"
              >
                <div className="text-3xl mb-2">
                  {category === 'Lore' && '📖'}
                  {category === 'Guide' && '🗺️'}
                  {category === 'Art' && '🎨'}
                  {category === 'Discussion' && '💬'}
                </div>
                <h3 className="text-xl font-semibold text-gray-200">{category}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-gradient-to-t from-gray-800 to-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-blue-400">
            Share Your Journey
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join our community of wanderers and share your tales from Hallownest
          </p>
          <Link
            to="/create"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 inline-block"
          >
            Start Writing
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
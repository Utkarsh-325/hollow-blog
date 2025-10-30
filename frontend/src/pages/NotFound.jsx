import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        {/* Animated Icon */}
        <div className="mb-8 relative">
          <div className="text-9xl animate-bounce">👻</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl opacity-20 animate-ping">💀</div>
          </div>
        </div>

        {/* Error Code */}
        <h1 className="text-8xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
          404
        </h1>

        {/* Title */}
        <h2 className="text-3xl font-bold text-gray-100 mb-4">
          Lost in the Void
        </h2>

        {/* Description */}
        <p className="text-lg text-gray-400 mb-8">
          Even the most seasoned wanderers can lose their way in Hallownest. 
          This path leads nowhere, but fear not—you can still find your way back.
        </p>

        {/* Actions */}
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            to="/"
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-blue-500/30"
          >
            Return to Safety
          </Link>
          <Link
            to="/posts"
            className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-gray-100 font-semibold rounded-lg transition-colors"
          >
            Explore Posts
          </Link>
        </div>

        {/* Quote */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-gray-500 italic">
            "Higher beings, these words are for you alone..."
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
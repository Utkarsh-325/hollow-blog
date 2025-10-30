const LoadingSpinner = ({ fullScreen = true, message = 'Exploring Hallownest...' }) => {
  const content = (
    <div className="flex flex-col items-center justify-center space-y-6">
      {/* Animated Hollow Knight Symbols */}
      <div className="relative">
        <div className="absolute inset-0 animate-ping">
          <div className="w-16 h-16 rounded-full bg-blue-500/20"></div>
        </div>
        <div className="relative animate-spin">
          <svg className="w-16 h-16 text-blue-500" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      </div>

      {/* Floating Butterflies */}
      <div className="text-4xl animate-float">🦋</div>

      {/* Message */}
      <div className="text-center">
        <p className="text-lg text-gray-300 font-medium mb-2">{message}</p>
        <div className="flex space-x-1 justify-center">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        {content}
      </div>
    );
  }

  return (
    <div className="py-12">
      {content}
    </div>
  );
};

export default LoadingSpinner;
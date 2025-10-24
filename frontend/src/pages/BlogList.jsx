import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function BlogList({ user }) {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    document.documentElement.classList.add('dark');
    axios.get('http://localhost:5000/api/posts')
      .then(res => setPosts(res.data));
  }, []);
  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center font-cinzel">
      <header className="text-4xl text-soul-blue my-6 text-center drop-shadow-lg">Wanderer’s Journal</header>
      <Link to="/new" className="bg-soul-blue text-dark-bg px-6 py-2 rounded shadow-lg mb-8 block mx-auto w-max">Create New Post</Link>
      <main className="max-w-2xl mx-auto">
        {posts.map(post => (
          <div key={post._id} className="bg-card-bg rounded-lg shadow-xl p-6 my-6 border border-ashen-violet">
            <h2 className="text-2xl text-soul-blue">{post.title}</h2>
            <p className="text-gray-300 mt-4">{post.content}</p>
            <div className="italic text-right text-ashen-violet mt-2">— {post.author}</div>
            {post.author === user && (
              <Link to={`/edit/${post._id}`} className="text-soul-blue underline">Edit</Link>
            )}
          </div>
        ))}
      </main>
    </div>
  );
}

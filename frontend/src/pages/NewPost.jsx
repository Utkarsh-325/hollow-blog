import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function NewPost({ user }) {
  const [form, setForm] = useState({ title: '', content: '' });
  const navigate = useNavigate();
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async e => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/posts', form, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    navigate('/');
  };
  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center font-cinzel">
    <form className="max-w-md mx-auto mt-10 bg-card-bg p-6 rounded-xl" onSubmit={handleSubmit}>
      <input name="title" placeholder="Title" onChange={handleChange} className="block w-full mb-4 p-2 text-black" />
      <textarea name="content" placeholder="Your story..." onChange={handleChange} className="block w-full mb-4 p-2 text-black h-40" />
      <button className="bg-soul-blue px-6 py-2 text-dark-bg rounded">Publish</button>
    </form>
    </div>
  );
}

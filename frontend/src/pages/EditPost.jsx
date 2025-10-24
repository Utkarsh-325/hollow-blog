import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

export default function EditPost({ user }) {
  const { id } = useParams();
  const [form, setForm] = useState({ title: '', content: '' });
  const navigate = useNavigate();
  useEffect(() => {
    axios.get(`http://localhost:5000/api/posts`)
      .then(res => {
        const post = res.data.find(p => p._id === id);
        setForm({ title: post.title, content: post.content });
      });
  }, [id]);
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async e => {
    e.preventDefault();
    await axios.put(`http://localhost:5000/api/posts/${id}`, form, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    navigate('/');
  };
  const handleDelete = async () => {
    await axios.delete(`http://localhost:5000/api/posts/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    navigate('/');
  };
  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center font-cinzel">
    <form className="max-w-md mx-auto mt-10 bg-card-bg p-6 rounded-xl" onSubmit={handleSubmit}>
      <input name="title" value={form.title} onChange={handleChange} className="block w-full mb-4 p-2 text-black" />
      <textarea name="content" value={form.content} onChange={handleChange} className="block w-full mb-4 p-2 text-black h-40" />
      <button className="bg-soul-blue px-6 py-2 text-dark-bg rounded">Save</button>
      <button type="button" onClick={handleDelete} className="ml-4 bg-red-600 px-6 py-2 text-dark-bg rounded">Delete</button>
    </form>
    </div>
  );
}

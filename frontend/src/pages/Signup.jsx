import { useState } from 'react';
import axios from 'axios';

export default function Signup() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async e => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/auth/signup', form);
    window.location = "/login";
  };
  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center font-cinzel">
    <form className="max-w-md mx-auto mt-10 bg-card-bg p-6 rounded-xl" onSubmit={handleSubmit}>
      <input name="username" placeholder="Username" onChange={handleChange} className="block w-full mb-4 p-2 text-black" />
      <input name="email" placeholder="Email" onChange={handleChange} className="block w-full mb-4 p-2 text-black" />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} className="block w-full mb-4 p-2 text-black" />
      <button className="bg-soul-blue px-6 py-2 text-dark-bg rounded">Sign Up</button>
    </form>
    </div>
  );
}

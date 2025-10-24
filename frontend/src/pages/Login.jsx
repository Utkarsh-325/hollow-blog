import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login({ setUser }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form, {
        headers: { 'Content-Type': 'application/json' },
      });

      // Save data locally
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', res.data.username);
      setUser(res.data.username);

      // Optional: redirect to dashboard or home
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      alert(err.response?.data?.msg || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-dark-bg flex items-center justify-center font-cinzel">
      <form
        className="max-w-md mx-auto bg-dark-bg border-ashen-violet border-2 shadow-2xl rounded-2xl p-10"
        onSubmit={handleSubmit}
      >
        <h2 className="text-3xl text-soul-blue mb-8 tracking-widest text-center drop-shadow">
          Login to Hallownest
        </h2>

        <input
          name="email"
          value={form.email}
          placeholder="Email"
          onChange={handleChange}
          required
          className="block w-full mb-6 p-3 rounded-lg bg-[#181824] text-soul-blue shadow-inner border border-ashen-violet focus:outline-none focus:ring-2 focus:ring-soul-blue"
        />

        <input
          name="password"
          type="password"
          value={form.password}
          placeholder="Password"
          onChange={handleChange}
          required
          className="block w-full mb-6 p-3 rounded-lg bg-[#181824] text-soul-blue shadow-inner border border-ashen-violet focus:outline-none focus:ring-2 focus:ring-soul-blue"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-soul-blue text-dark-bg rounded-lg font-bold shadow-xl hover:bg-[#7a9cff] transition disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p className="mt-4 text-center text-gray-400">
          Don't have an account?{' '}
          <a href="/signup" className="text-soul-blue underline">
            Sign up
          </a>
        </p>
      </form>
    </div>
  );
}

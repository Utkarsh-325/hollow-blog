import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Login from './pages/Login';
import Signup from './pages/Signup';
import BlogList from './pages/BlogList';
import NewPost from './pages/NewPost';
import EditPost from './pages/EditPost';

function App() {
  const [user, setUser] = useState(localStorage.getItem('user') || '');
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={user ? <BlogList user={user} /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/new" element={<NewPost user={user} />} />
        <Route path="/edit/:id" element={<EditPost user={user} />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;

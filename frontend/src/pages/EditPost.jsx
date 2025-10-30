import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import api from '../utils/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const CATEGORIES = ['Lore', 'Guide', 'Art', 'Discussion', 'Fan Theory', 'Update', 'Other'];

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Other',
    tags: '',
    coverImage: '',
    status: 'published'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['blockquote', 'code-block'],
      ['link', 'image'],
      ['clean']
    ]
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await api.get(`/posts/${id}`);
      const post = response.data.post;
      
      setFormData({
        title: post.title,
        content: post.content,
        category: post.category,
        tags: post.tags.join(', '),
        coverImage: post.coverImage || '',
        status: post.status
      });
    } catch (error) {
      toast.error('Failed to load post');
      navigate('/profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleContentChange = (value) => {
    setFormData({
      ...formData,
      content: value
    });
  };

  const handleSubmit = async (e, status = 'published') => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Please add a title');
      return;
    }
    
    if (!formData.content.trim() || formData.content === '<p><br></p>') {
      toast.error('Please add some content');
      return;
    }

    setSaving(true);

    try {
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag);

      const postData = {
        ...formData,
        tags: tagsArray,
        status
      };

      const response = await api.put(`/posts/${id}`, postData);
      
      toast.success('Post updated successfully!');
      navigate(`/posts/${response.data.post.slug}`);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update post');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">✏️</span>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Edit Your Tale
            </h1>
          </div>
          <p className="text-gray-400">Refine your story from Hallownest</p>
        </div>

        {/* Form */}
        <form className="space-y-6">
          {/* Title */}
          <div className="bg-gray-800 border border-blue-500/30 rounded-lg p-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter your story's title..."
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 text-xl font-semibold placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>

          {/* Category & Cover Image */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 border border-blue-500/30 rounded-lg p-6">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="bg-gray-800 border border-blue-500/30 rounded-lg p-6">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Cover Image URL
              </label>
              <input
                type="url"
                name="coverImage"
                value={formData.coverImage}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>
          </div>

          {/* Cover Image Preview */}
          {formData.coverImage && (
            <div className="bg-gray-800 border border-blue-500/30 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-2">Cover Preview:</p>
              <img 
                src={formData.coverImage} 
                alt="Cover preview" 
                className="w-full h-48 object-cover rounded-lg"
                onError={(e) => {
                  e.target.style.display = 'none';
                  toast.error('Invalid image URL');
                }}
              />
            </div>
          )}

          {/* Content Editor */}
          <div className="bg-gray-800 border border-blue-500/30 rounded-lg p-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Content <span className="text-red-400">*</span>
            </label>
            <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
              <ReactQuill
                theme="snow"
                value={formData.content}
                onChange={handleContentChange}
                modules={modules}
                placeholder="Begin writing your tale..."
                className="quill-dark"
                style={{ minHeight: '400px' }}
              />
            </div>
          </div>

          {/* Tags */}
          <div className="bg-gray-800 border border-blue-500/30 rounded-lg p-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Tags
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="hollow-knight, boss-guide, lore (comma separated)"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
            <p className="mt-2 text-xs text-gray-500">Separate tags with commas</p>
          </div>

          {/* Status */}
          <div className="bg-gray-800 border border-blue-500/30 rounded-lg p-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Post Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 flex-wrap">
            <button
              type="button"
              onClick={(e) => handleSubmit(e, formData.status)}
              disabled={saving}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-blue-500/30"
            >
              {saving ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving...
                </span>
              ) : (
                '💾 Save Changes'
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-8 bg-gray-700 hover:bg-gray-600 text-gray-100 font-semibold py-4 rounded-lg transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Custom Quill Styles */}
      <style jsx global>{`
        .quill-dark .ql-toolbar {
          background: #111827;
          border: none !important;
          border-bottom: 1px solid #374151 !important;
        }
        .quill-dark .ql-container {
          background: #111827;
          border: none !important;
          min-height: 400px;
        }
        .quill-dark .ql-editor {
          color: #f3f4f6;
          font-size: 16px;
          line-height: 1.8;
        }
        .quill-dark .ql-editor.ql-blank::before {
          color: #6b7280;
        }
        .quill-dark .ql-stroke {
          stroke: #9ca3af;
        }
        .quill-dark .ql-fill {
          fill: #9ca3af;
        }
        .quill-dark .ql-picker {
          color: #9ca3af;
        }
        .quill-dark .ql-picker-options {
          background: #1f2937;
          border: 1px solid #374151;
        }
        .quill-dark button:hover .ql-stroke,
        .quill-dark button:hover .ql-fill,
        .quill-dark button.ql-active .ql-stroke,
        .quill-dark button.ql-active .ql-fill {
          stroke: #60a5fa;
          fill: #60a5fa;
        }
      `}</style>
    </div>
  );
};

export default EditPost;
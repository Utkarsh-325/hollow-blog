// frontend/src/pages/CreatePost.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import api from '../utils/api';
import toast from 'react-hot-toast';

const CATEGORIES = ['Lore', 'Guide', 'Art', 'Discussion', 'Fan Theory', 'Update', 'Other'];

const CreatePost = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Other',
    tags: '',
    coverImage: '',
    status: 'published'
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

    setLoading(true);

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

      const response = await api.post('/posts', postData);
      
      if (status === 'draft') {
        toast.success('Draft saved successfully!');
      } else {
        toast.success('Your tale has been shared with Hallownest!');
      }
      
      navigate(`/posts/${response.data.post.slug}`);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">✍️</span>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Chronicle Your Journey
            </h1>
          </div>
          <p className="text-gray-400">Share your tales, guides, and discoveries with fellow wanderers</p>
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

          {/* Action Buttons */}
          <div className="flex gap-4 flex-wrap">
            <button
              type="button"
              onClick={(e) => handleSubmit(e, 'published')}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-blue-500/30"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Publishing...
                </span>
              ) : (
                '✨ Publish to Hallownest'
              )}
            </button>

            <button
              type="button"
              onClick={(e) => handleSubmit(e, 'draft')}
              disabled={loading}
              className="px-8 bg-gray-700 hover:bg-gray-600 text-gray-100 font-semibold py-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              💾 Save as Draft
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

        {/* Tips */}
        <div className="mt-8 bg-gray-800/50 border border-purple-500/30 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-purple-400 mb-3 flex items-center gap-2">
            <span>💡</span> Writing Tips from the Elderbug
          </h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>• Use headers to structure your content and make it scannable</li>
            <li>• Add images to illustrate your points and break up text</li>
            <li>• Use bullet points and numbered lists for easy reading</li>
            <li>• Tag your post with relevant keywords to help others find it</li>
            <li>• Choose an eye-catching cover image to draw readers in</li>
          </ul>
        </div>
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

export default CreatePost;
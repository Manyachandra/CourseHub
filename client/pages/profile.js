import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUserStore, useThemeStore } from '../utils/store';
import { authAPI } from '../utils/api';
import { FiUser, FiMail, FiSave, FiEdit2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function Profile() {
  const router = useRouter();
  const { user, setUser } = useUserStore();
  const { theme } = useThemeStore();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    avatar: ''
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    setFormData({
      name: user.name || '',
      email: user.email || '',
      avatar: user.avatar || ''
    });
  }, [user, router]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return;
    }

    try {
      setLoading(true);
      const response = await authAPI.updateProfile(formData);
      setUser(response.data.user);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Profile update error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update profile';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className={`min-h-screen transition-colors duration-200 ${theme === 'dark' ? 'dark' : ''}`}>
        
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-white">Loading profile...</p>
            </div>
          </div>
        
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 ${theme === 'dark' ? 'dark' : ''}`}>
      
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">My Profile</h1>
              <p className="text-xl text-gray-600 dark:text-white">
                Manage your account information and preferences
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Card */}
              <div className="lg:col-span-1">
                <div className="card">
                  <div className="text-center p-6">
                    <div className="w-24 h-24 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                      {user.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={user.name}
                          className="w-24 h-24 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                          {user.name?.charAt(0)?.toUpperCase()}
                        </span>
                      )}
                    </div>
                    
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {user.name}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {user.email}
                    </p>
                    
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                      <div className="flex justify-between">
                        <span>Member since:</span>
                        <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Role:</span>
                        <span className="capitalize">{user.role}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Form */}
              <div className="lg:col-span-2">
                <div className="card">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Profile Information
                      </h3>
                      <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="btn btn-outline flex items-center space-x-2"
                      >
                        <FiEdit2 className="w-4 h-4" />
                        <span>{isEditing ? 'Cancel' : 'Edit'}</span>
                      </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Name Field */}
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                          Full Name
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiUser className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            disabled={!isEditing}
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            className="input pl-10 disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                          />
                        </div>
                      </div>

                      {/* Email Field */}
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                          Email Address
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiMail className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            id="email"
                            name="email"
                            type="email"
                            disabled={true}
                            value={formData.email}
                            className="input pl-10 bg-gray-50 dark:bg-gray-800 cursor-not-allowed"
                          />
                        </div>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          Email cannot be changed
                        </p>
                      </div>

                      {/* Avatar Field */}
                      <div>
                        <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                          Profile Picture URL
                        </label>
                        <input
                          id="avatar"
                          name="avatar"
                          type="url"
                          disabled={!isEditing}
                          value={formData.avatar}
                          onChange={(e) => handleChange('avatar', e.target.value)}
                          placeholder="https://example.com/avatar.jpg"
                          className="input disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                        />
                      </div>

                      {/* Submit Button */}
                      {isEditing && (
                        <div className="flex justify-end">
                          <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary flex items-center space-x-2"
                          >
                            <FiSave className="w-4 h-4" />
                            <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                          </button>
                        </div>
                      )}
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      
    </div>
  );
}

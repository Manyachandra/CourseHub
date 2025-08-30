import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { useUserStore } from '../utils/store';
import { authAPI } from '../utils/api';
import { FiUser, FiMail, FiSave, FiEdit2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function Profile() {
  const router = useRouter();
  const { user, setUser } = useUserStore();
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
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">My Profile</h1>
            <p className="text-xl text-gray-600">
              Manage your account information and preferences
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="card">
                <div className="text-center p-6">
                  <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    {user.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name}
                        className="w-24 h-24 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl font-bold text-primary-600">
                        {user.name?.charAt(0)?.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{user.name}</h2>
                  <p className="text-gray-600 mb-4">{user.email}</p>
                  <div className="text-sm text-gray-500">
                    <p>Member since {new Date(user.createdAt || Date.now()).toLocaleDateString()}</p>
                    <p className="mt-1">Role: {user.role || 'Student'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Form */}
            <div className="lg:col-span-2">
              <div className="card">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">Profile Information</h3>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="flex items-center text-primary-600 hover:text-primary-700 transition-colors"
                    >
                      <FiEdit2 className="w-4 h-4 mr-2" />
                      {isEditing ? 'Cancel' : 'Edit'}
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiUser className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="name"
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleChange('name', e.target.value)}
                          disabled={!isEditing}
                          className="input pl-10 disabled:bg-gray-50 disabled:text-gray-500"
                          placeholder="Enter your full name"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiMail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleChange('email', e.target.value)}
                          disabled={!isEditing}
                          className="input pl-10 disabled:bg-gray-50 disabled:text-gray-500"
                          placeholder="Enter your email address"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 mb-2">
                        Profile Picture URL
                      </label>
                      <input
                        id="avatar"
                        type="url"
                        value={formData.avatar}
                        onChange={(e) => handleChange('avatar', e.target.value)}
                        disabled={!isEditing}
                        className="input disabled:bg-gray-50 disabled:text-gray-500"
                        placeholder="https://example.com/avatar.jpg"
                      />
                    </div>

                    {isEditing && (
                      <div className="flex gap-4">
                        <button
                          type="submit"
                          disabled={loading}
                          className="btn btn-primary flex items-center disabled:opacity-50"
                        >
                          <FiSave className="w-4 h-4 mr-2" />
                          {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditing(false);
                            setFormData({
                              name: user.name || '',
                              email: user.email || '',
                              avatar: user.avatar || ''
                            });
                          }}
                          className="btn btn-outline"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              </div>

              {/* Account Stats */}
              <div className="card mt-6">
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Account Statistics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary-600 mb-2">
                        {user.purchasedCourses?.length || 0}
                      </div>
                      <div className="text-sm text-gray-600">Courses Purchased</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary-600 mb-2">
                        {user.cart?.length || 0}
                      </div>
                      <div className="text-sm text-gray-600">Items in Cart</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary-600 mb-2">
                        {user.role === 'admin' ? 'Admin' : 'Student'}
                      </div>
                      <div className="text-sm text-gray-600">Account Type</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

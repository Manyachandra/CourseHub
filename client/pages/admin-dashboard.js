import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUserStore, useThemeStore } from '../utils/store';
import { adminAPI } from '../utils/api';
import { FiUsers, FiBookOpen, FiShoppingCart, FiTrendingUp, FiPlus, FiEdit2, FiTrash2, FiEye, FiRefreshCw, FiSearch, FiFilter } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const router = useRouter();
  const { user } = useUserStore();
  const { theme } = useThemeStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeoutError, setTimeoutError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  // Stats state
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    publishedCourses: 0,
    draftCourses: 0,
    adminUsers: 0,
    completedOrders: 0,
    processingOrders: 0,
    recentOrders: [],
    recentUsers: []
  });

  // Data state
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedCourses, setSelectedCourses] = useState([]);

  // Form states
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    shortDescription: '',
    price: '',
    category: '',
    level: 'Beginner',
    duration: '',
    instructor: {
      name: '',
      bio: '',
      avatar: ''
    },
    thumbnail: '',
    language: 'English',
    tags: []
  });

  // Edit course state
  const [editingCourse, setEditingCourse] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Check authentication and admin role
  useEffect(() => {
    console.log('=== ADMIN DASHBOARD DEBUG START ===');
    console.log('Component mounted, checking user state...');
    console.log('User object:', user);
    console.log('User object keys:', user ? Object.keys(user) : 'No user');
    console.log('User type:', typeof user);
    console.log('User role:', user?.role);
    console.log('User ID:', user?._id);
    console.log('User id (lowercase):', user?.id);
    console.log('Is authenticated:', !!user);
    console.log('User store state:', useUserStore.getState());
    console.log('LocalStorage user-storage:', typeof window !== 'undefined' ? localStorage.getItem('user-storage') : 'Server side');
    console.log('Router pathname:', router.pathname);
    console.log('Router query:', router.query);
    console.log('================================');
    
    if (!user) {
      console.log('No user found, redirecting to login');
      router.push('/login');
      return;
    }
    
    if (user.role !== 'admin') {
      console.log('User is not admin, role:', user.role);
      setError('Access Denied: Admin privileges required');
      setLoading(false);
      return;
    }

    console.log('User is admin, fetching data...');
    fetchAdminData();
  }, [user, router]);

  // Fetch admin data with timeout
  const fetchAdminData = async () => {
    try {
      setLoading(true);
      setError(null);
      setTimeoutError(false);

      const timeoutId = setTimeout(() => {
        setTimeoutError(true);
        setLoading(false);
      }, 10000);

      const [statsRes, coursesRes, usersRes, ordersRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getAllCourses(),
        adminAPI.getAllUsers(),
        adminAPI.getAllOrders()
      ]);

      clearTimeout(timeoutId);

      // Check if any response has an error
      if (statsRes.data?.error || coursesRes.data?.error || usersRes.data?.error || ordersRes.data?.error) {
        const errorDetails = {
          stats: statsRes.data?.error ? 'error' : 'ok',
          courses: coursesRes.data?.error ? 'error' : 'ok',
          users: usersRes.data?.error ? 'error' : 'ok',
          orders: ordersRes.data?.error ? 'error' : 'ok'
        };
        console.error('API Response errors:', errorDetails);
        throw new Error(`Failed to fetch admin data: ${JSON.stringify(errorDetails)}`);
      }

      const [statsData, coursesData, usersData, ordersData] = [
        statsRes.data,
        coursesRes.data,
        usersRes.data,
        ordersRes.data
      ];

      setStats(statsData);
      setCourses(coursesData);
      setUsers(usersData);
      setOrders(ordersData);
      setLastUpdated(new Date());
      setLoading(false);
    } catch (error) {
      console.error('Admin data fetch error:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  // Helper functions
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || course.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleSelectAll = () => {
    if (selectedCourses.length === filteredCourses.length) {
      setSelectedCourses([]);
    } else {
      setSelectedCourses(filteredCourses.map(course => course._id));
    }
  };

  const handleSelectCourse = (courseId) => {
    setSelectedCourses(prev => 
      prev.includes(courseId) 
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handleBulkPublish = async () => {
    if (selectedCourses.length === 0) {
      toast.error('Please select courses to publish');
      return;
    }

    try {
      const promises = selectedCourses.map(courseId =>
        adminAPI.toggleCourseStatus(courseId, 'published')
      );

      await Promise.all(promises);
      toast.success(`${selectedCourses.length} courses published successfully!`);
      setSelectedCourses([]);
      fetchAdminData();
    } catch (error) {
      toast.error('Failed to publish courses');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedCourses.length === 0) {
      toast.error('Please select courses to delete');
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedCourses.length} courses?`)) {
      return;
    }

    try {
      const promises = selectedCourses.map(courseId =>
        adminAPI.deleteCourse(courseId)
      );

      await Promise.all(promises);
      toast.success(`${selectedCourses.length} courses deleted successfully!`);
      setSelectedCourses([]);
      fetchAdminData();
    } catch (error) {
      toast.error('Failed to delete courses');
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    
    if (!newCourse.title || !newCourse.description || !newCourse.price) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const response = await adminAPI.createCourse(newCourse);

      if (response.data?.error) {
        throw new Error('Failed to create course');
      }

      toast.success('Course created successfully!');
      setNewCourse({
        title: '',
        description: '',
        shortDescription: '',
        price: '',
        category: '',
        level: 'Beginner',
        duration: '',
        instructor: { name: '', bio: '', avatar: '' },
        thumbnail: '',
        language: 'English',
        tags: []
      });
      fetchAdminData();
    } catch (error) {
      toast.error('Failed to create course');
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      const response = await adminAPI.updateOrderStatus(orderId, status);

      if (response.data?.error) {
        throw new Error('Failed to update order status');
      }

      toast.success('Order status updated successfully!');
      fetchAdminData();
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  // Course management functions
  const handleEditCourse = (course) => {
    setEditingCourse({ ...course });
    setShowEditModal(true);
  };

  const handleDeleteCourse = (course) => {
    setCourseToDelete(course);
    setShowDeleteModal(true);
  };

  const handleConfirmDeleteCourse = async () => {
    if (!courseToDelete) return;

    try {
      const response = await adminAPI.deleteCourse(courseToDelete._id);

      if (response.data?.error) {
        throw new Error('Failed to delete course');
      }

      toast.success('Course deleted successfully!');
      setShowDeleteModal(false);
      setCourseToDelete(null);
      fetchAdminData();
    } catch (error) {
      toast.error('Failed to delete course');
    }
  };

  const handleToggleCourseStatus = async (courseId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'published' ? 'draft' : 'published';
      const response = await adminAPI.toggleCourseStatus(courseId, newStatus);

      if (response.data?.error) {
        throw new Error('Failed to update course status');
      }

      toast.success(`Course ${newStatus} successfully!`);
      fetchAdminData();
    } catch (error) {
      toast.error('Failed to update course status');
    }
  };

  const handleSaveCourse = async (courseData) => {
    try {
      let response;
      if (courseData._id) {
        response = await adminAPI.updateCourse(courseData._id, courseData);
      } else {
        response = await adminAPI.createCourse(courseData);
      }

      if (response.data?.error) {
        throw new Error('Failed to save course');
      }

      toast.success(`Course ${courseData._id ? 'updated' : 'created'} successfully!`);
      setShowEditModal(false);
      setEditingCourse(null);
      fetchAdminData();
    } catch (error) {
      toast.error('Failed to save course');
    }
  };

  // User and Order view functions
  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  // Loading state
  if (loading && !timeoutError) {
    return (
      <div className={`min-h-screen transition-colors duration-200 ${theme === 'dark' ? 'dark' : ''}`}>
        
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-white">Loading admin dashboard...</p>
            </div>
          </div>
        
      </div>
    );
  }

  // Error states
  if (error) {
    return (
      <div className={`min-h-screen transition-colors duration-200 ${theme === 'dark' ? 'dark' : ''}`}>
        
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
            <div className="max-w-md mx-auto text-center">
              <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-4">
                <h2 className="font-bold mb-2">Access Denied</h2>
                <p>{error}</p>
              </div>
              <button
                onClick={() => router.push('/')}
                className="btn btn-primary"
              >
                Go to Home
              </button>
            </div>
          </div>
        
      </div>
    );
  }

  if (timeoutError) {
    return (
      <div className={`min-h-screen transition-colors duration-200 ${theme === 'dark' ? 'dark' : ''}`}>
        
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
            <div className="max-w-md mx-auto text-center">
              <div className="bg-yellow-100 dark:bg-yellow-900 border border-yellow-400 dark:border-yellow-600 text-yellow-700 dark:text-yellow-300 px-4 py-3 rounded mb-4">
                <h2 className="font-bold mb-2">Connection Timeout</h2>
                <p>Failed to load admin data. Please check your connection and try again.</p>
              </div>
              <div className="space-y-2">
                <button
                  onClick={fetchAdminData}
                  className="btn btn-primary w-full"
                >
                  Retry
                </button>
                <button
                  onClick={() => router.push('/')}
                  className="btn btn-outline w-full"
                >
                  Go to Home
                </button>
              </div>
            </div>
          </div>
        
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Manage courses, users, and orders
                  {lastUpdated && (
                    <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                      • Last updated: {lastUpdated.toLocaleTimeString()}
                    </span>
                  )}
                </p>
              </div>
              <button
                onClick={fetchAdminData}
                disabled={loading}
                className="btn btn-primary flex items-center space-x-2"
              >
                <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh Data</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', label: 'Overview', icon: FiTrendingUp },
                { id: 'courses', label: 'Courses', icon: FiBookOpen },
                { id: 'users', label: 'Users', icon: FiUsers },
                { id: 'orders', label: 'Orders', icon: FiShoppingCart }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <FiBookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Courses</p>
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalCourses}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <span className="text-green-600 dark:text-green-400 font-medium">{stats.publishedCourses}</span>
                      <span className="mx-1">published</span>
                      <span className="text-gray-400 dark:text-gray-500 mx-1">•</span>
                      <span className="text-yellow-600 dark:text-yellow-400 font-medium">{stats.draftCourses}</span>
                      <span className="ml-1">draft</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                      <FiUsers className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Users</p>
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalUsers}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <span className="text-blue-600 dark:text-blue-400 font-medium">{stats.adminUsers}</span>
                      <span className="ml-1">admin users</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                      <FiShoppingCart className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Orders</p>
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalOrders}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <span className="text-green-600 dark:text-green-400 font-medium">{stats.completedOrders}</span>
                      <span className="mx-1">completed</span>
                      <span className="text-gray-400 dark:text-gray-500 mx-1">•</span>
                      <span className="text-yellow-600 dark:text-yellow-400 font-medium">{stats.processingOrders}</span>
                      <span className="ml-1">processing</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                      <FiTrendingUp className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Revenue</p>
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white">${stats.totalRevenue}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      <span className="text-green-600 dark:text-green-400 font-medium">
                        {stats.totalOrders > 0 ? Math.round((stats.completedOrders / stats.totalOrders) * 100) : 0}%
                      </span>
                      <span className="ml-1">success rate</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Platform Insights */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Platform Insights</h3>
                    <button
                      onClick={() => {
                        setEditingCourse({
                          title: '',
                          description: '',
                          shortDescription: '',
                          price: '',
                          category: '',
                          level: 'Beginner',
                          duration: '',
                          instructor: { name: '', bio: '', avatar: '' },
                          thumbnail: '',
                          language: 'English',
                          tags: []
                        });
                        setShowEditModal(true);
                      }}
                      className="btn btn-primary btn-sm flex items-center space-x-2"
                    >
                      <FiPlus className="w-3 h-3" />
                      <span>Quick Add Course</span>
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300">Active Courses</span>
                      <span className="font-semibold text-green-600 dark:text-green-400">{stats.publishedCourses}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300">Pending Courses</span>
                      <span className="font-semibold text-yellow-600 dark:text-yellow-400">{stats.draftCourses}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300">Active Users</span>
                      <span className="font-semibold text-blue-600 dark:text-blue-400">{stats.totalUsers - stats.adminUsers}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300">Total Revenue</span>
                      <span className="font-semibold text-purple-600 dark:text-purple-400">${stats.totalRevenue}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">System Health</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300">Backend API</span>
                      <span className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-green-600 dark:text-green-400 font-medium">Online</span>
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300">Database</span>
                      <span className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-green-600 dark:text-green-400 font-medium">Connected</span>
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300">Frontend</span>
                      <span className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-green-600 dark:text-green-400 font-medium">Running</span>
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300">Admin Panel</span>
                      <span className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-green-600 dark:text-green-400 font-medium">Active</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Courses Tab */}
          {activeTab === 'courses' && (
            <div className="space-y-6">
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search courses..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                  {selectedCourses.length > 0 && (
                    <>
                      <button
                        onClick={handleBulkPublish}
                        className="btn btn-success"
                      >
                        Publish ({selectedCourses.length})
                      </button>
                      <button
                        onClick={handleBulkDelete}
                        className="btn btn-danger"
                      >
                        Delete ({selectedCourses.length})
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Courses Table */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Courses ({filteredCourses.length})</h3>
                    <button
                      onClick={() => {
                        setEditingCourse({
                          title: '',
                          description: '',
                          shortDescription: '',
                          price: '',
                          category: '',
                          level: 'Beginner',
                          duration: '',
                          instructor: { name: '', bio: '', avatar: '' },
                          thumbnail: '',
                          language: 'English',
                          tags: []
                        });
                        setShowEditModal(true);
                      }}
                      className="btn btn-primary flex items-center space-x-2"
                    >
                      <FiPlus className="w-4 h-4" />
                      <span>Add Course</span>
                    </button>
                  </div>
                </div>
                {filteredCourses.length === 0 ? (
                  <div className="px-6 py-12 text-center">
                    <FiBookOpen className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No courses found</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {searchTerm || filterStatus !== 'all' 
                        ? 'Try adjusting your search or filters'
                        : 'Get started by creating your first course'
                      }
                    </p>
                    {!searchTerm && filterStatus === 'all' && (
                      <button
                        onClick={() => {
                          setEditingCourse({
                            title: '',
                            description: '',
                            shortDescription: '',
                            price: '',
                            category: '',
                            level: 'Beginner',
                            duration: '',
                            instructor: { name: '', bio: '', avatar: '' },
                            thumbnail: '',
                            language: 'English',
                            tags: []
                          });
                          setShowEditModal(true);
                        }}
                        className="btn btn-primary"
                      >
                        <FiPlus className="w-4 h-4 mr-2" />
                        Add First Course
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            <input
                              type="checkbox"
                              checked={selectedCourses.length === filteredCourses.length}
                              onChange={handleSelectAll}
                              className="rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500"
                            />
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Course</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Price</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredCourses.map(course => (
                          <tr key={course._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="checkbox"
                                checked={selectedCourses.includes(course._id)}
                                onChange={() => handleSelectCourse(course._id)}
                                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  {course.thumbnail ? (
                                    <img className="h-10 w-10 rounded-lg object-cover" src={course.thumbnail} alt={course.title} />
                                  ) : (
                                    <div className="h-10 w-10 rounded-lg bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                                      <FiBookOpen className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                                    </div>
                                  )}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">{course.title}</div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">{course.category}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button
                                onClick={() => handleToggleCourseStatus(course._id, course.status)}
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full cursor-pointer transition-colors ${
                                  course.status === 'published' 
                                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800' 
                                    : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 hover:bg-yellow-200 dark:hover:bg-yellow-800'
                                }`}
                                title={`Click to ${course.status === 'published' ? 'unpublish' : 'publish'}`}
                              >
                                {course.status}
                              </button>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">${course.price}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => alert(`Course: ${course.title}\nDescription: ${course.description}\nPrice: $${course.price}\nStatus: ${course.status}`)}
                                  className="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300"
                                  title="View Details"
                                >
                                  <FiEye className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleEditCourse(course)}
                                  className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                                  title="Edit Course"
                                >
                                  <FiEdit2 className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteCourse(course)}
                                  className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                                  title="Delete Course"
                                >
                                  <FiTrash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Users ({users.length})</h3>
                </div>
                {users.length === 0 ? (
                  <div className="px-6 py-12 text-center">
                    <FiUsers className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No users found</h3>
                    <p className="text-gray-600 dark:text-gray-300">Users will appear here once they register</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Joined</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {users.map(user => (
                          <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  {user.avatar ? (
                                    <img className="h-10 w-10 rounded-full object-cover" src={user.avatar} alt={user.name} />
                                  ) : (
                                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                      <span className="text-sm font-medium text-gray-600">{user.name?.charAt(0)?.toUpperCase()}</span>
                                    </div>
                                  )}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                user.role === 'admin' 
                                  ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200' 
                                  : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                              }`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button 
                                onClick={() => handleViewUser(user)}
                                className="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300"
                                title="View User Details"
                              >
                                <FiEye className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Orders ({orders.length})</h3>
                </div>
                {orders.length === 0 ? (
                  <div className="px-6 py-12 text-center">
                    <FiShoppingCart className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No orders found</h3>
                    <p className="text-gray-600 dark:text-gray-300">Orders will appear here once users make purchases</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Order</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Customer</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Course</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {orders.map(order => (
                          <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">#{order._id.slice(-8)}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">{order.user?.name || 'Unknown'}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{order.user?.email || 'No email'}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">{order.course?.title || 'Unknown Course'}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{order.course?.instructor?.name || 'Unknown Instructor'}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">${order.amount}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <select
                                value={order.status}
                                onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                                className={`text-xs font-semibold rounded-full px-3 py-1 border-0 ${
                                  order.status === 'completed' 
                                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                                    : order.status === 'processing'
                                    ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                                    : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                                }`}
                              >
                                <option value="processing">Processing</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button 
                                onClick={() => handleViewOrder(order)}
                                className="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300"
                                title="View Order Details"
                              >
                                <FiEye className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Course Edit Modal */}
          {showEditModal && editingCourse && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {editingCourse._id ? 'Edit Course' : 'Add New Course'}
                  </h3>
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingCourse(null);
                    }}
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    ✕
                  </button>
                </div>
                
                <form onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveCourse(editingCourse);
                }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title *</label>
                      <input
                        type="text"
                        value={editingCourse.title}
                        onChange={(e) => setEditingCourse({...editingCourse, title: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price *</label>
                      <input
                        type="number"
                        value={editingCourse.price}
                        onChange={(e) => setEditingCourse({...editingCourse, price: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                      <input
                        type="text"
                        value={editingCourse.category}
                        onChange={(e) => setEditingCourse({...editingCourse, category: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Level</label>
                      <select
                        value={editingCourse.level}
                        onChange={(e) => setEditingCourse({...editingCourse, level: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description *</label>
                      <textarea
                        value={editingCourse.description}
                        onChange={(e) => setEditingCourse({...editingCourse, description: e.target.value})}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Short Description</label>
                      <textarea
                        value={editingCourse.shortDescription}
                        onChange={(e) => setEditingCourse({...editingCourse, shortDescription: e.target.value})}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Instructor Name</label>
                      <input
                        type="text"
                        value={editingCourse.instructor.name}
                        onChange={(e) => setEditingCourse({
                          ...editingCourse, 
                          instructor: {...editingCourse.instructor, name: e.target.value}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration</label>
                      <input
                        type="text"
                        value={editingCourse.duration}
                        onChange={(e) => setEditingCourse({...editingCourse, duration: e.target.value})}
                        placeholder="e.g., 10 hours"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Thumbnail URL</label>
                      <input
                        type="url"
                        value={editingCourse.thumbnail}
                        onChange={(e) => setEditingCourse({...editingCourse, thumbnail: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Language</label>
                      <input
                        type="text"
                        value={editingCourse.language}
                        onChange={(e) => setEditingCourse({...editingCourse, language: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={() => {
                        setShowEditModal(false);
                        setEditingCourse(null);
                      }}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                    >
                      {editingCourse._id ? 'Update Course' : 'Create Course'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteModal && courseToDelete && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Delete Course</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Are you sure you want to delete "{courseToDelete.title}"? This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setCourseToDelete(null);
                    }}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDeleteCourse}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* User Details Modal */}
          {showUserModal && selectedUser && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">User Details</h3>
                  <button
                    onClick={() => {
                      setShowUserModal(false);
                      setSelectedUser(null);
                    }}
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    {selectedUser.avatar ? (
                      <img src={selectedUser.avatar} alt={selectedUser.name} className="w-12 h-12 rounded-full" />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                        <span className="text-lg font-semibold text-gray-600 dark:text-gray-300">{selectedUser.name?.charAt(0)?.toUpperCase()}</span>
                      </div>
                    )}
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{selectedUser.name}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{selectedUser.email}</p>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                    <p className="text-gray-900 dark:text-white"><span className="font-medium">Role:</span> <span className={`px-2 py-1 text-xs rounded-full ${
                      selectedUser.role === 'admin' ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200' : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                    }`}>{selectedUser.role}</span></p>
                    <p className="text-gray-900 dark:text-white"><span className="font-medium">Joined:</span> {new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                    {selectedUser.purchasedCourses && selectedUser.purchasedCourses.length > 0 && (
                      <p className="text-gray-900 dark:text-white"><span className="font-medium">Courses:</span> {selectedUser.purchasedCourses.length}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Order Details Modal */}
          {showOrderModal && selectedOrder && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full mx-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Order Details</h3>
                  <button
                    onClick={() => {
                      setShowOrderModal(false);
                      setSelectedOrder(null);
                    }}
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                    <p className="text-gray-900 dark:text-white"><span className="font-medium">Order ID:</span> #{selectedOrder._id.slice(-8)}</p>
                    <p className="text-gray-900 dark:text-white"><span className="font-medium">Date:</span> {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                    <p className="text-gray-900 dark:text-white"><span className="font-medium">Status:</span> <span className={`px-2 py-1 text-xs rounded-full ${
                      selectedOrder.status === 'completed' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 
                      selectedOrder.status === 'processing' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' : 
                      'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                    }`}>{selectedOrder.status}</span></p>
                  </div>
                  
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                    <h4 className="font-medium mb-2 text-gray-900 dark:text-white">Customer Information</h4>
                    <p className="text-gray-900 dark:text-white"><span className="font-medium">Name:</span> {selectedOrder.user?.name || 'Unknown'}</p>
                    <p className="text-gray-900 dark:text-white"><span className="font-medium">Email:</span> {selectedOrder.user?.email || 'No email'}</p>
                  </div>
                  
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                    <h4 className="font-medium mb-2 text-gray-900 dark:text-white">Course Information</h4>
                    <p className="text-gray-900 dark:text-white"><span className="font-medium">Title:</span> {selectedOrder.course?.title || 'Unknown Course'}</p>
                    <p className="text-gray-900 dark:text-white"><span className="font-medium">Instructor:</span> {selectedOrder.course?.instructor?.name || 'Unknown'}</p>
                    <p className="text-gray-900 dark:text-white"><span className="font-medium">Amount:</span> ${selectedOrder.amount}</p>
                  </div>
                  
                  {selectedOrder.billingAddress && (
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                      <h4 className="font-medium mb-2 text-gray-900 dark:text-white">Billing Address</h4>
                      <p className="text-gray-900 dark:text-white">{selectedOrder.billingAddress.firstName} {selectedOrder.billingAddress.lastName}</p>
                      <p className="text-gray-900 dark:text-white">{selectedOrder.billingAddress.address}</p>
                      <p className="text-gray-900 dark:text-white">{selectedOrder.billingAddress.city}, {selectedOrder.billingAddress.state} {selectedOrder.billingAddress.zipCode}</p>
                      <p className="text-gray-900 dark:text-white">{selectedOrder.billingAddress.country}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Floating Action Button - Always visible for adding courses */}
          <button
            onClick={() => {
              setEditingCourse({
                title: '',
                description: '',
                shortDescription: '',
                price: '',
                category: '',
                level: 'Beginner',
                duration: '',
                instructor: { name: '', bio: '', avatar: '' },
                thumbnail: '',
                language: 'English',
                tags: []
              });
              setShowEditModal(true);
            }}
            className="fixed bottom-6 right-6 w-14 h-14 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-all duration-200 flex items-center justify-center z-40 hover:scale-110"
            title="Add New Course"
          >
            <FiPlus className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}

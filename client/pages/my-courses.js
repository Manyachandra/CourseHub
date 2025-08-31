import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../components/Layout';
import { useUserStore, useThemeStore } from '../utils/store';
import { authAPI } from '../utils/api';
import { FiBookOpen, FiPlay, FiClock, FiStar, FiDownload, FiTrendingUp } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function MyCourses() {
  const router = useRouter();
  const { user } = useUserStore();
  const { theme } = useThemeStore();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [purchasedCourses, setPurchasedCourses] = useState([]);

  const fetchPurchasedCourses = useCallback(async () => {
    try {
      setLoading(true);
      const response = await authAPI.getPurchasedCourses();
      setPurchasedCourses(response.data.purchasedCourses || []);
    } catch (error) {
      console.error('Error fetching purchased courses:', error);
      toast.error('Failed to load purchased courses');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchPurchasedCourses();
  }, [user, router, fetchPurchasedCourses]);

  const categories = [...new Set(purchasedCourses.map(course => course.courseId?.category).filter(Boolean))];

  const filteredCourses = purchasedCourses.filter(course => {
    const courseData = course.courseId;
    if (!courseData) return false;
    
    const matchesSearch = !searchTerm || 
      courseData.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      courseData.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || courseData.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getProgressPercentage = (course) => {
    // Mock progress - in a real app, this would come from the backend
    return Math.floor(Math.random() * 100);
  };

  if (!user) {
    return (
      <div className={`min-h-screen transition-colors duration-200 ${theme === 'dark' ? 'dark' : ''}`}>
        <Layout>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-white">Loading courses...</p>
            </div>
          </div>
        </Layout>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`min-h-screen transition-colors duration-200 ${theme === 'dark' ? 'dark' : ''}`}>
        <Layout>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mb-8"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                      <div className="h-48 bg-gray-300 dark:bg-gray-600 rounded-t-lg"></div>
                      <div className="p-6">
                        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                        <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
                        <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Layout>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 ${theme === 'dark' ? 'dark' : ''}`}>
      <Layout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">My Courses</h1>
              <p className="text-xl text-gray-600 dark:text-white">
                Continue learning from where you left off
              </p>
            </div>

            {/* Search and Filters */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search your courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input w-full"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="input md:w-48"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {filteredCourses.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 dark:text-gray-500 mb-4">
                  <FiBookOpen className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No courses found</h3>
                <p className="text-gray-600 dark:text-white mb-4">
                  {purchasedCourses.length === 0 
                    ? "You haven't purchased any courses yet. Start learning today!"
                    : "Try adjusting your search or filter criteria."
                  }
                </p>
                {purchasedCourses.length === 0 && (
                  <Link
                    href="/courses"
                    className="btn-primary px-6 py-2"
                  >
                    Browse Courses
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => {
                  const courseData = course.courseId;
                  if (!courseData) return null;
                  
                  const progress = getProgressPercentage(course);
                  
                  return (
                    <div key={course._id} className="course-card rounded-xl overflow-hidden transition-all duration-200">
                      <div className="relative">
                        <img
                          src={courseData.thumbnail || '/placeholder-course.jpg'}
                          alt={courseData.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-4 right-4">
                          <span className="badge-primary px-3 py-1 rounded-full text-sm font-medium">
                            Purchased
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-2">
                          <span className="badge-secondary px-2 py-1 rounded text-xs">
                            {courseData.category}
                          </span>
                          <span className="badge-secondary px-2 py-1 rounded text-xs">
                            {courseData.level}
                          </span>
                        </div>
                        
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                          {courseData.title}
                        </h3>
                        
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                          {courseData.description}
                        </p>
                        
                        {/* Progress Bar */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-gray-600 dark:text-gray-300">Progress</span>
                            <span className="text-gray-900 dark:text-white font-medium">{progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        {/* Course Actions */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                            <FiClock className="w-4 h-4" />
                            <span>{courseData.duration}</span>
                          </div>
                          <Link
                            href={`/courses/${courseData._id}`}
                            className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium text-sm transition-colors duration-200"
                          >
                            Continue Learning →
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </Layout>
    </div>
  );
}

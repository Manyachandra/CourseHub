import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../components/Layout';


import { useUserStore } from '../utils/store';
import { authAPI } from '../utils/api';
import { FiBookOpen, FiPlay, FiClock, FiStar, FiDownload, FiTrendingUp } from 'react-icons/fi';


import toast from 'react-hot-toast';



export default function MyCourses() {
  const router = useRouter();
  const { user } = useUserStore();
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
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading courses...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-1/3 mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white rounded-lg shadow-md p-6">
                    <div className="h-48 bg-gray-300 rounded-t-lg"></div>
                    <div className="p-6">
                      <div className="h-4 bg-gray-300 rounded mb-2"></div>
                      <div className="h-3 bg-gray-300 rounded mb-4"></div>
                      <div className="h-6 bg-gray-300 rounded w-20"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">My Courses</h1>
            <p className="text-xl text-gray-600">
              Continue learning from where you left off
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md text-center">
              <div className="p-6">
                <div className="text-3xl font-bold text-primary-600 mb-2">
                  {purchasedCourses.length}
                </div>
                <div className="text-sm text-gray-600">Total Courses</div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md text-center">
              <div className="p-6">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {purchasedCourses.filter(course => getProgressPercentage(course) === 100).length}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md text-center">
              <div className="p-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {purchasedCourses.filter(course => getProgressPercentage(course) > 0 && getProgressPercentage(course) < 100).length}
                </div>
                <div className="text-sm text-gray-600">In Progress</div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md text-center">
              <div className="p-6">
                <div className="text-3xl font-bold text-yellow-600 mb-2">
                  {purchasedCourses.filter(course => getProgressPercentage(course) === 0).length}
                </div>
                <div className="text-sm text-gray-600">Not Started</div>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="mb-8 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search your courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {purchasedCourses.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiBookOpen className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Courses Yet</h3>
              <p className="text-gray-600 mb-6">
                You haven't purchased any courses yet. Start your learning journey today!
              </p>
                          <Link href="/courses" className="inline-flex items-center px-4 py-2 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors">
              Browse Courses
            </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map(course => {
                const courseData = course.courseId;
                const progress = getProgressPercentage(course);
                return (
                  <div key={course._id || courseData?._id || `course-${Math.random()}`} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <div className="h-48 bg-gray-200 rounded-t-lg flex items-center justify-center relative">
                      {courseData?.thumbnail ? (
                        <img 
                          src={courseData.thumbnail} 
                          alt={courseData.title}
                          className="w-full h-full object-cover rounded-t-lg"
                        />
                      ) : (
                        <div className="text-gray-400 text-center">
                          <FiBookOpen className="w-16 h-16 mx-auto mb-2" />
                          <p>No Image</p>
                        </div>
                      )}
                      {/* Progress Overlay */}
                      <div className="absolute top-4 right-4">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-sm font-bold text-primary-600">{progress}%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
                        {courseData?.title || 'Untitled Course'}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 overflow-hidden text-ellipsis">
                        {courseData?.description || 'No description available'}
                      </p>
                      
                      {/* Course Meta */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <FiClock className="w-4 h-4 mr-2" />
                          {courseData?.duration || 'Duration not specified'}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <FiStar className="w-4 h-4 text-yellow-400 mr-1" />
                          {courseData?.rating?.average || 0} rating
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <FiTrendingUp className="w-4 h-4 mr-2" />
                          {courseData?.level || 'Level not specified'}
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Link 
                          href={`/courses/${courseData?._id}`}
                          className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                        >
                          <FiPlay className="w-4 h-4 mr-2" />
                          Continue
                        </Link>
                        <button className="inline-flex items-center px-3 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors" title="Download Materials">
                          <FiDownload className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Learning Tips */}
          {purchasedCourses.length > 0 && (
            <div className="mt-12">
              <div className="bg-white rounded-lg shadow-md bg-gradient-to-r from-primary-50 to-primary-100 border border-primary-200">
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-primary-900 mb-3">
                    💡 Learning Tips
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-primary-800">
                    <div>
                      <p className="font-medium mb-2">• Set aside dedicated time each day for learning</p>
                      <p className="font-medium mb-2">• Take notes and practice regularly</p>
                    </div>
                    <div>
                      <p className="font-medium mb-2">• Join study groups or forums</p>
                      <p className="font-medium mb-2">• Apply what you learn in real projects</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

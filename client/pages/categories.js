import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import { useThemeStore } from '../utils/store';
import { coursesAPI } from '../utils/api';
import { FiBookOpen, FiUsers, FiClock, FiStar } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useCoursesStore } from '../utils/store';

export default function Categories() {
  const { theme } = useThemeStore();
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const { resetFilters } = useCoursesStore();

  useEffect(() => {
    fetchCategories();
    fetchCourses();
    // Reset any existing filters when entering categories page
    resetFilters();
    
    // Cleanup: reset filters when leaving the page
    return () => {
      resetFilters();
    };
  }, [resetFilters]);

  const fetchCategories = async () => {
    try {
      const response = await coursesAPI.getCategories();
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await coursesAPI.getAll();
      setCourses(response.data.courses || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesCategory = !selectedCategory || course.category === selectedCategory;
    const matchesSearch = !searchTerm || 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryStats = (categoryName) => {
    const categoryCourses = courses.filter(course => course.category === categoryName);
    return {
      count: categoryCourses.length,
      avgRating: categoryCourses.length > 0 
        ? (categoryCourses.reduce((sum, course) => sum + (course.rating?.average || 0), 0) / categoryCourses.length).toFixed(1)
        : 0,
      totalStudents: categoryCourses.reduce((sum, course) => sum + (course.enrollmentCount || 0), 0)
    };
  };

  if (loading) {
    return (
      <div className={`min-h-screen transition-colors duration-200 ${theme === 'dark' ? 'dark' : ''}`}>
        <Layout>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mb-8"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="card">
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
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Course Categories</h1>
              <p className="text-xl text-gray-600 dark:text-white max-w-3xl mx-auto">
                Explore courses by category and find the perfect learning path for you
              </p>
            </div>

            {/* Search and Filter */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search courses..."
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

            {/* Categories Grid */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Browse by Category</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => {
                  const stats = getCategoryStats(category);
                  return (
                    <div key={category} className="card hover:shadow-lg transition-shadow duration-200 cursor-pointer">
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                            <FiBookOpen className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                          </div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {stats.count} courses
                          </span>
                        </div>
                        
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {category}
                        </h3>
                        
                        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                          <div className="flex items-center space-x-2">
                            <FiStar className="w-4 h-4 text-yellow-500" />
                            <span>Avg Rating: {stats.avgRating}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <FiUsers className="w-4 h-4 text-blue-500" />
                            <span>{stats.totalStudents} students</span>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => setSelectedCategory(category)}
                          className="mt-4 w-full btn btn-outline text-sm"
                        >
                          View Courses
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Courses Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedCategory ? `${selectedCategory} Courses` : 'All Courses'}
                </h2>
                {selectedCategory && (
                  <button
                    onClick={() => setSelectedCategory('')}
                    className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium"
                  >
                    View All Categories
                  </button>
                )}
              </div>

              {filteredCourses.length === 0 ? (
                <div className="text-center py-12">
                  <FiBookOpen className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No courses found</h3>
                  <p className="text-gray-600 dark:text-white mb-4">
                    {searchTerm 
                      ? `No courses found matching "${searchTerm}"`
                      : selectedCategory 
                        ? `No courses found in ${selectedCategory} category`
                        : 'No courses available at the moment'
                    }
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('');
                    }}
                    className="btn btn-primary"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses.map((course) => (
                    <div key={course._id} className="course-card rounded-xl overflow-hidden transition-all duration-200">
                      <div className="relative">
                        <img
                          src={course.thumbnail || '/placeholder-course.jpg'}
                          alt={course.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-4 right-4">
                          <span className="badge-primary px-3 py-1 rounded-full text-sm font-medium">
                            ${course.price}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-2">
                          <span className="badge-secondary px-2 py-1 rounded text-xs">
                            {course.category}
                          </span>
                          <span className="badge-secondary px-2 py-1 rounded text-xs">
                            {course.level}
                          </span>
                        </div>
                        
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                          {course.title}
                        </h3>
                        
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                          {course.description}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                          <div className="flex items-center space-x-2">
                            <FiClock className="w-4 h-4" />
                            <span>{course.duration}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <FiStar className="w-4 h-4 text-yellow-500" />
                            <span>{course.rating?.average || 0}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {course.instructor?.name || 'Unknown Instructor'}
                          </div>
                          <Link
                            href={`/courses/${course._id}`}
                            className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium text-sm transition-colors duration-200"
                          >
                            View Course →
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
}

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import { coursesAPI } from '../utils/api';
import { FiBookOpen, FiUsers, FiClock, FiStar } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useCoursesStore } from '../utils/store';

export default function Categories() {
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
      <Layout>
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-1/3 mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="card">
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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Course Categories</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our comprehensive collection of courses organized by category. 
              Find the perfect learning path for your goals.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="mb-8 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search courses..."
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

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {categories.map(category => {
              const stats = getCategoryStats(category);
              return (
                <div key={category} className="card hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">{category}</h3>
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                        <FiBookOpen className="w-6 h-6 text-primary-600" />
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <FiUsers className="w-4 h-4 mr-2" />
                        {stats.count} courses
                      </div>
                      <div className="flex items-center">
                        <FiStar className="w-4 h-4 mr-2" />
                        {stats.avgRating} avg rating
                      </div>
                      <div className="flex items-center">
                        <FiClock className="w-4 h-4 mr-2" />
                        {stats.totalStudents} students
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedCategory(category === selectedCategory ? '' : category)}
                      className={`mt-4 w-full py-2 px-4 rounded-lg transition-colors ${
                        selectedCategory === category
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {selectedCategory === category ? 'Selected' : 'View Courses'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Courses List */}
          {selectedCategory && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Courses in {selectedCategory}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map(course => (
                  <div key={course._id} className="card hover:shadow-lg transition-shadow">
                    <div className="h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
                      {course.thumbnail ? (
                        <img 
                          src={course.thumbnail} 
                          alt={course.title}
                          className="w-full h-full object-cover rounded-t-lg"
                        />
                      ) : (
                        <div className="text-gray-400 text-center">
                          <FiBookOpen className="w-16 h-16 mx-auto mb-2" />
                          <p>No Image</p>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {course.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {course.description}
                      </p>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <FiStar className="w-4 h-4 text-yellow-400 mr-1" />
                          {course.rating?.average || 0} ({course.reviews?.length || 0} reviews)
                        </div>
                        <span className="text-lg font-bold text-primary-600">
                          ${course.price}
                        </span>
                      </div>
                      <Link 
                        href={`/courses/${course._id}`}
                        className="w-full btn btn-primary text-center"
                      >
                        View Course
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All Courses - Only show when no category is selected */}
          {!selectedCategory && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  All Courses
                </h2>
                <div className="text-sm text-gray-600 mt-2 sm:mt-0">
                  Showing {filteredCourses.length} of {courses.length} courses
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map(course => (
                  <div key={course._id} className="card hover:shadow-lg transition-shadow">
                    <div className="h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
                      {course.thumbnail ? (
                        <img 
                          src={course.thumbnail} 
                          alt={course.title}
                          className="w-full h-full object-cover rounded-t-lg"
                        />
                      ) : (
                        <div className="text-gray-400 text-center">
                          <FiBookOpen className="w-16 h-16 mx-auto mb-2" />
                          <p>No Image</p>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {course.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {course.description}
                      </p>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <FiStar className="w-4 h-4 text-yellow-400 mr-1" />
                          {course.rating?.average || 0} ({course.reviews?.length || 0} reviews)
                        </div>
                        <span className="text-lg font-bold text-primary-600">
                          ${course.price}
                        </span>
                      </div>
                      <Link 
                        href={`/courses/${course._id}`}
                        className="w-full btn btn-primary text-center"
                      >
                        View Course
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* View All Courses Button - Only show when a category is selected and has more than 6 courses */}
          {selectedCategory && filteredCourses.length > 6 && (
            <div className="text-center mt-8">
              <Link href="/courses" className="btn btn-outline px-8 py-3 text-lg">
                View All Courses
              </Link>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

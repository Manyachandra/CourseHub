import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { coursesAPI } from '../../utils/api';
import { FiFilter, FiSearch, FiGrid, FiList, FiStar, FiUsers, FiClock } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useCoursesStore } from '../../utils/store';

export default function Courses() {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    minRating: '',
    level: '',
    sortBy: 'newest',
    search: '',
  });
  
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCourses: 0,
    hasNext: false,
    hasPrev: false,
  });

  useEffect(() => {
    fetchCategories();
    fetchLevels();
    // Ensure filters are reset when entering courses page
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      minRating: '',
      level: '',
      sortBy: 'newest',
      search: '',
    });
    
    // Cleanup: reset filters when leaving the page
    return () => {
      setFilters({
        category: '',
        minPrice: '',
        maxPrice: '',
        minRating: '',
        level: '',
        sortBy: 'newest',
        search: '',
      });
    };
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [filters, pagination.currentPage]);

  const fetchCategories = async () => {
    try {
      const response = await coursesAPI.getCategories();
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchLevels = async () => {
    try {
      const response = await coursesAPI.getLevels();
      setLevels(response.data.levels);
    } catch (error) {
      console.error('Error fetching levels:', error);
    }
  };

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const params = {
        ...filters,
        page: pagination.currentPage,
        limit: 12,
      };
      
      const response = await coursesAPI.getAll(params);
      setCourses(response.data.courses);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Error loading courses');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      minRating: '',
      level: '',
      sortBy: 'newest',
      search: '',
    });
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const goToPage = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Courses</h1>
          <p className="text-gray-600">Discover thousands of courses from top instructors</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Clear All
                </button>
              </div>

              {/* Search */}
              <form onSubmit={handleSearch} className="mb-6">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search courses..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="input pl-10"
                  />
                </div>
              </form>

              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Category</h3>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="input"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Level Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Level</h3>
                <select
                  value={filters.level}
                  onChange={(e) => handleFilterChange('level', e.target.value)}
                  className="input"
                >
                  <option value="">All Levels</option>
                  {levels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Price Range</h3>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    className="input text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className="input text-sm"
                  />
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Minimum Rating</h3>
                <select
                  value={filters.minRating}
                  onChange={(e) => handleFilterChange('minRating', e.target.value)}
                  className="input"
                >
                  <option value="">Any Rating</option>
                  <option value="4">4+ Stars</option>
                  <option value="3">3+ Stars</option>
                  <option value="2">2+ Stars</option>
                </select>
              </div>

              {/* Sort By */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Sort By</h3>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="input"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            </div>
          </div>

          {/* Courses Grid */}
          <div className="flex-1">
            {/* View Controls */}
            <div className="flex items-center justify-between mb-6">
              <div className="text-sm text-gray-600">
                Showing {courses.length} of {pagination.totalCourses} courses
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${
                    viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <FiGrid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${
                    viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <FiList className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Courses */}
            {loading ? (
              <div className={`grid gap-6 ${
                viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
              }`}>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="card animate-pulse">
                    <div className="h-48 bg-gray-300"></div>
                    <div className="p-6">
                      <div className="h-4 bg-gray-300 rounded mb-2"></div>
                      <div className="h-3 bg-gray-300 rounded mb-4"></div>
                      <div className="h-6 bg-gray-300 rounded w-20"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : courses.length > 0 ? (
              <div className={`grid gap-6 ${
                viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
              }`}>
                {courses.map((course) => (
                  <div key={course._id} className="card hover:shadow-lg transition-shadow duration-300">
                    <div className="relative">
                      <img
                        src={course.thumbnail || 'https://via.placeholder.com/400x250?text=Course+Image'}
                        alt={course.title}
                        className={`w-full object-cover ${
                          viewMode === 'grid' ? 'h-48' : 'h-32'
                        }`}
                      />
                      <div className="absolute top-2 left-2">
                        <span className="badge badge-primary">{course.category}</span>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="badge badge-secondary">{course.level}</span>
                        {course.rating && course.rating.average > 0 && (
                          <div className="flex items-center space-x-1">
                            <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium">{course.rating.average.toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {course.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {course.shortDescription}
                      </p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <FiUsers className="w-4 h-4" />
                            <span>{course.enrollmentCount || 0}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <FiClock className="w-4 h-4" />
                            <span>{course.duration}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-primary-600">
                          ${course.price}
                        </div>
                        <button
                          onClick={() => router.push(`/courses/${course._id}`)}
                          className="btn btn-primary"
                        >
                          View Course
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <FiFilter className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters or search terms
                </p>
                <button
                  onClick={clearFilters}
                  className="btn btn-outline"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center mt-12">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() => goToPage(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrev}
                    className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  {[...Array(pagination.totalPages)].map((_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`px-3 py-2 rounded-lg ${
                          page === pagination.currentPage
                            ? 'bg-primary-600 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => goToPage(pagination.currentPage + 1)}
                    disabled={!pagination.hasNext}
                    className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { coursesAPI, cartAPI } from '../../utils/api';
import { useUserStore, useCartStore } from '../../utils/store';
import { FiStar, FiUsers, FiClock, FiPlay, FiShoppingCart, FiCheck, FiUser, FiCalendar } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function CourseDetails() {
  const router = useRouter();
  const { id } = router.query;
  const { user, isAuthenticated } = useUserStore();
  const { addItem, items } = useCartStore();
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: ''
  });

  const isInCart = items.some(item => item.courseId._id === id);
  const isPurchased = user?.purchasedCourses?.some(item => item.courseId === id);

  useEffect(() => {
    if (id) {
      fetchCourse();
    }
  }, [id]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const response = await coursesAPI.getById(id);
      setCourse(response.data.course);
    } catch (error) {
      console.error('Error fetching course:', error);
      toast.error('Error loading course');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated()) {
      toast.error('Please login to add courses to cart');
      router.push('/login');
      return;
    }

    try {
      await cartAPI.add(id);
      addItem(course);
      toast.success('Course added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error(error.response?.data?.message || 'Error adding to cart');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated()) {
      toast.error('Please login to submit a review');
      return;
    }

    try {
      await coursesAPI.addReview(id, reviewForm);
      toast.success('Review submitted successfully!');
      setReviewForm({ rating: 5, comment: '' });
      fetchCourse(); // Refresh course data to show new review
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error(error.response?.data?.message || 'Error submitting review');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-96 bg-gray-300 rounded mb-6"></div>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-300 rounded w-4/6"></div>
                </div>
              </div>
              <div className="h-96 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!course) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Course not found</h1>
          <p className="text-gray-600 mb-6">The course you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/courses')}
            className="btn btn-primary"
          >
            Browse Courses
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Course Header */}
        <div className="mb-8">
          <nav className="text-sm text-gray-500 mb-4">
            <button onClick={() => router.push('/courses')} className="hover:text-primary-600">
              Courses
            </button>
            <span className="mx-2">/</span>
            <span>{course.title}</span>
          </nav>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{course.title}</h1>
          <p className="text-lg text-gray-600 mb-6 max-w-4xl">{course.shortDescription}</p>
          
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <FiUser className="w-4 h-4" />
              <span>By {course.instructor.name}</span>
            </div>
            <div className="flex items-center space-x-1">
              <FiUsers className="w-4 h-4" />
              <span>{course.enrollmentCount || 0} students enrolled</span>
            </div>
            <div className="flex items-center space-x-1">
              <FiClock className="w-4 h-4" />
              <span>{course.duration}</span>
            </div>
            {course.rating && course.rating.average > 0 && (
              <div className="flex items-center space-x-1">
                <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
                <span>{course.rating.average.toFixed(1)} ({course.rating.count} reviews)</span>
              </div>
            )}
            <div className="flex items-center space-x-1">
              <FiCalendar className="w-4 h-4" />
              <span>Last updated {new Date(course.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Course Image/Video */}
            <div className="card mb-8">
              <div className="relative">
                <img
                  src={course.thumbnail || 'https://via.placeholder.com/800x450?text=Course+Image'}
                  alt={course.title}
                  className="w-full h-96 object-cover"
                />
                {course.videoUrl && (
                  <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors">
                      <FiPlay className="w-10 h-10 text-primary-600 ml-1" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className="card">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8">
                  {['overview', 'curriculum', 'instructor', 'reviews'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                        activeTab === tab
                          ? 'border-primary-500 text-primary-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">What you'll learn</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                      {course.curriculum?.slice(0, 6).map((item, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <FiCheck className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{item.title}</span>
                        </div>
                      ))}
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Description</h3>
                    <p className="text-gray-700 leading-relaxed">{course.description}</p>
                  </div>
                )}

                {/* Curriculum Tab */}
                {activeTab === 'curriculum' && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Course Content</h3>
                    <div className="space-y-4">
                      {course.curriculum?.map((item, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">{item.title}</h4>
                              <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                            </div>
                            <span className="text-sm text-gray-500">{item.duration}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Instructor Tab */}
                {activeTab === 'instructor' && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">About the Instructor</h3>
                    <div className="flex items-start space-x-4">
                      <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-2xl font-bold text-primary-600">
                          {course.instructor.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">{course.instructor.name}</h4>
                        <p className="text-gray-700 leading-relaxed">{course.instructor.bio}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Reviews Tab */}
                {activeTab === 'reviews' && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-gray-900">Student Reviews</h3>
                      {isAuthenticated() && !isPurchased && (
                        <button
                          onClick={() => setActiveTab('write-review')}
                          className="btn btn-outline"
                        >
                          Write a Review
                        </button>
                      )}
                    </div>

                    {/* Write Review Form */}
                    {activeTab === 'write-review' && (
                      <div className="card mb-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Write a Review</h4>
                        <form onSubmit={handleReviewSubmit}>
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                            <select
                              value={reviewForm.rating}
                              onChange={(e) => setReviewForm(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
                              className="input"
                            >
                              {[5, 4, 3, 2, 1].map(rating => (
                                <option key={rating} value={rating}>
                                  {rating} Star{rating !== 1 ? 's' : ''}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                            <textarea
                              value={reviewForm.comment}
                              onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                              rows={4}
                              className="input"
                              placeholder="Share your thoughts about this course..."
                              required
                            />
                          </div>
                          <div className="flex space-x-3">
                            <button type="submit" className="btn btn-primary">
                              Submit Review
                            </button>
                            <button
                              type="button"
                              onClick={() => setActiveTab('reviews')}
                              className="btn btn-secondary"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    )}

                    {/* Reviews List */}
                    <div className="space-y-6">
                      {course.reviews && course.reviews.length > 0 ? (
                        course.reviews.map((review, index) => (
                          <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                                  <span className="text-sm font-medium text-primary-600">
                                    {review.userId?.name?.charAt(0)?.toUpperCase() || 'U'}
                                  </span>
                                </div>
                                <span className="font-medium text-gray-900">
                                  {review.userId?.name || 'Anonymous'}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1">
                                {[...Array(5)].map((_, i) => (
                                  <FiStar
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-gray-700">{review.comment}</p>
                            <div className="text-sm text-gray-500 mt-2">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <p>No reviews yet. Be the first to review this course!</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-8">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-primary-600 mb-2">
                  ${course.price}
                </div>
                {course.originalPrice && course.originalPrice > course.price && (
                  <div className="text-lg text-gray-500 line-through">
                    ${course.originalPrice}
                  </div>
                )}
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Category</span>
                  <span className="font-medium">{course.category}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Level</span>
                  <span className="font-medium">{course.level}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium">{course.duration}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Language</span>
                  <span className="font-medium">{course.language}</span>
                </div>
              </div>

              <div className="space-y-3">
                {isPurchased ? (
                  <button
                    disabled
                    className="w-full btn btn-secondary cursor-not-allowed"
                  >
                    Already Purchased
                  </button>
                ) : isInCart ? (
                  <button
                    onClick={() => router.push('/cart')}
                    className="w-full btn btn-outline"
                  >
                    <FiShoppingCart className="w-4 h-4 mr-2" />
                    View in Cart
                  </button>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    className="w-full btn btn-primary"
                  >
                    <FiShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </button>
                )}
                
                <button
                  onClick={() => router.push('/courses')}
                  className="w-full btn btn-secondary"
                >
                  Browse More Courses
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">This course includes:</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center space-x-2">
                    <FiCheck className="w-4 h-4 text-green-500" />
                    <span>Full lifetime access</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <FiCheck className="w-4 h-4 text-green-500" />
                    <span>Access on mobile and TV</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <FiCheck className="w-4 h-4 text-green-500" />
                    <span>Certificate of completion</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <FiCheck className="w-4 h-4 text-green-500" />
                    <span>30-day money-back guarantee</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

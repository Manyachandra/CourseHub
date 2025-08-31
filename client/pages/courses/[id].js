import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { useThemeStore } from '../../utils/store';
import { coursesAPI, cartAPI } from '../../utils/api';
import { useUserStore, useCartStore } from '../../utils/store';
import { FiStar, FiUsers, FiClock, FiPlay, FiShoppingCart, FiCheck, FiUser, FiCalendar } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function CourseDetails() {
  const router = useRouter();
  const { id } = router.query;
  const { theme } = useThemeStore();
  const { user, isAuthenticated } = useUserStore();
  const { addItem, items } = useCartStore();
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: ''
  });
  const [showReviewForm, setShowReviewForm] = useState(false);

  const isInCart = items.some(item => item.courseId._id === id);
  const isPurchased = user?.purchasedCourses?.some(item => 
    item.courseId === id || item.courseId._id === id
  );

  // Debug logging
  console.log('=== COURSE DETAIL DEBUG ===');
  console.log('Course ID:', id);
  console.log('User:', user);
  console.log('User purchased courses:', user?.purchasedCourses);
  console.log('Is in cart:', isInCart);
  console.log('Is purchased:', isPurchased);
  console.log('==========================');

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
      await addItem(course);
      toast.success('Course added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      if (error.message === 'Course already purchased') {
        toast.error('Already purchased! You already own this course.');
      } else {
        toast.error('Error adding to cart');
      }
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated()) {
      toast.error('Please login to submit a review');
      return;
    }

    // Validate review form
    if (!reviewForm.comment || reviewForm.comment.trim().length < 10) {
      toast.error('Please provide a comment with at least 10 characters');
      return;
    }

    if (!reviewForm.rating || reviewForm.rating < 1 || reviewForm.rating > 5) {
      toast.error('Please select a valid rating (1-5 stars)');
      return;
    }

    console.log('=== REVIEW SUBMISSION DEBUG ===');
    console.log('Course ID:', id);
    console.log('Review Form:', reviewForm);
    console.log('User authenticated:', isAuthenticated());
    console.log('==============================');

    try {
      // Prepare review data
      const reviewData = {
        rating: parseInt(reviewForm.rating),
        comment: reviewForm.comment.trim()
      };

      console.log('Sending review data:', reviewData);
      
      const response = await coursesAPI.addReview(id, reviewData);
      console.log('Review submission response:', response);
      toast.success('Review submitted successfully!');
      setReviewForm({ rating: 5, comment: '' });
      setShowReviewForm(false);
      fetchCourse(); // Refresh course data to show new review
    } catch (error) {
      console.error('Error submitting review:', error);
      console.error('Error response:', error.response);
      console.error('Error message:', error.message);
      
      // Show more specific error messages
      if (error.response?.status === 400) {
        toast.error('Validation error: ' + (error.response?.data?.message || 'Please check your input'));
      } else if (error.response?.status === 401) {
        toast.error('Please login to submit a review');
      } else if (error.response?.status === 403) {
        toast.error('You can only review courses you have purchased');
      } else {
        toast.error(error.response?.data?.message || error.message || 'Error submitting review');
      }
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen transition-colors duration-200 ${theme && theme === 'dark' ? 'dark' : ''}`}>
        
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-8"></div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="h-96 bg-gray-300 dark:bg-gray-600 rounded mb-6"></div>
                  <div className="space-y-4">
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-4/6"></div>
                  </div>
                </div>
                <div className="h-96 bg-gray-300 dark:bg-gray-600 rounded"></div>
              </div>
            </div>
          </div>
        
      </div>
    );
  }

  if (!course) {
    return (
      <div className={`min-h-screen transition-colors duration-200 ${theme === 'dark' ? 'dark' : ''}`}>
        
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Course Not Found</h1>
            <p className="text-gray-600 dark:text-white mb-6">
              The course you're looking for doesn't exist or has been removed.
            </p>
            <button
              onClick={() => router.push('/courses')}
              className="btn btn-primary"
            >
              Browse All Courses
            </button>
          </div>
        
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 ${theme && theme === 'dark' ? 'dark' : ''}`}>
      
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Course Header */}
            <div className="mb-8">
              <nav className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                <button
                  onClick={() => router.push('/courses')}
                  className="hover:text-gray-700 dark:hover:text-white transition-colors"
                >
                  Courses
                </button>
                <span>/</span>
                <span className="text-gray-900 dark:text-white">{course.title}</span>
              </nav>
              
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {course.title}
              </h1>
              
              <p className="text-lg text-gray-600 dark:text-white mb-6 max-w-4xl">
                {course.description}
              </p>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center space-x-1">
                  <FiStar className="w-4 h-4 text-yellow-500" />
                  <span>{course.rating?.average || 0}</span>
                  <span>({course.reviews?.length || 0} reviews)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <FiUsers className="w-4 h-4" />
                  <span>{course.enrollmentCount || 0} students enrolled</span>
                </div>
                <div className="flex items-center space-x-1">
                  <FiClock className="w-4 h-4" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <FiCalendar className="w-4 h-4" />
                  <span>Last updated {new Date(course.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {/* Course Image */}
                <div className="mb-8">
                  <img
                    src={course.thumbnail || '/placeholder-course.jpg'}
                    alt={course.title}
                    className="w-full h-96 object-cover rounded-lg"
                  />
                </div>

                {/* Tabs */}
                <div className="mb-8">
                  <div className="border-b border-gray-200 dark:border-gray-700">
                    <nav className="flex space-x-8">
                      {['overview', 'curriculum', 'reviews'].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`py-2 px-1 border-b-2 font-medium text-sm capitalize transition-colors duration-200 ${
                            activeTab === tab
                              ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </nav>
                  </div>

                  {/* Tab Content */}
                  <div className="mt-6">
                    {activeTab === 'overview' && (
                      <div className="prose prose-lg max-w-none dark:prose-invert">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">What you'll learn</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                          {course.learningObjectives?.map((objective, index) => (
                            <div key={index} className="flex items-start space-x-2">
                              <FiCheck className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700 dark:text-white">{objective}</span>
                            </div>
                          ))}
                        </div>
                        
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Requirements</h3>
                        <ul className="text-gray-700 dark:text-white mb-6">
                          {course.requirements?.map((requirement, index) => (
                            <li key={index}>{requirement}</li>
                          ))}
                        </ul>
                        
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Description</h3>
                        <p className="text-gray-700 dark:text-white leading-relaxed">
                          {course.description}
                        </p>
                      </div>
                    )}

                    {activeTab === 'curriculum' && (
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Course Curriculum</h3>
                        <div className="space-y-4">
                          {course.curriculum?.map((section, index) => (
                            <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg">
                              <div className="p-4 bg-gray-50 dark:bg-gray-800">
                                <h4 className="font-medium text-gray-900 dark:text-white">
                                  Section {index + 1}: {section.title}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                  {section.lessons?.length || 0} lessons
                                </p>
                              </div>
                              {section.lessons && (
                                <div className="p-4">
                                  <ul className="space-y-2">
                                    {section.lessons.map((lesson, lessonIndex) => (
                                      <li key={lessonIndex} className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                                        <FiPlay className="w-4 h-4 text-gray-400" />
                                        <span>{lesson.title}</span>
                                        <span className="text-gray-400">• {lesson.duration}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTab === 'reviews' && (
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Student Reviews</h3>
                        
                        {/* Review Form */}
                        {isAuthenticated() && !isPurchased && (
                          <div className="card mb-6">
                            <div className="p-6">
                              <h4 className="font-medium text-gray-900 dark:text-white mb-4">Write a Review</h4>
                              <form onSubmit={handleReviewSubmit} className="space-y-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                                    Rating
                                  </label>
                                  <div className="flex space-x-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <button
                                        key={star}
                                        type="button"
                                        onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                                        className="text-2xl text-yellow-400 hover:text-yellow-500 transition-colors"
                                      >
                                        {star <= reviewForm.rating ? '★' : '☆'}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                                    Comment
                                  </label>
                                  <textarea
                                    value={reviewForm.comment}
                                    onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                                    rows={4}
                                    className="input w-full"
                                    placeholder="Share your experience with this course..."
                                    required
                                  />
                                </div>
                                
                                <button type="submit" className="btn btn-primary">
                                  Submit Review
                                </button>
                              </form>
                            </div>
                          </div>
                        )}
                        
                        {/* Reviews List */}
                        <div className="space-y-4">
                          {course.reviews?.length > 0 ? (
                            course.reviews.map((review, index) => (
                              <div key={index} className="card">
                                <div className="p-6">
                                  <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center space-x-3">
                                      <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                                        <FiUser className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                                      </div>
                                      <div>
                                        <p className="font-medium text-gray-900 dark:text-white">
                                          {review.user?.name || 'Anonymous'}
                                        </p>
                                        <div className="flex items-center space-x-1">
                                          {[1, 2, 3, 4, 5].map((star) => (
                                            <FiStar
                                              key={star}
                                              className={`w-4 h-4 ${
                                                star <= review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300 dark:text-gray-600'
                                              }`}
                                            />
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                      {new Date(review.createdAt).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <p className="text-gray-700 dark:text-white">{review.comment}</p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-8">
                              <FiStar className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No reviews yet</h4>
                              <p className="text-gray-600 dark:text-white">
                                Be the first to review this course!
                              </p>
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
                <div className="sticky top-8">
                  <div className="card">
                    <div className="p-6">
                      <div className="text-center mb-6">
                        <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                          ${course.price}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          One-time payment
                        </p>
                      </div>
                      
                      <div className="space-y-4 mb-6">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-300">Course includes:</span>
                          <span className="text-gray-900 dark:text-white font-medium">Lifetime access</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-300">Certificate:</span>
                          <span className="text-gray-900 dark:text-white font-medium">Yes</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-300">Level:</span>
                          <span className="text-gray-900 dark:text-white font-medium">{course.level}</span>
                        </div>
                      </div>
                      
                      {isPurchased ? (
                        <button
                          onClick={() => router.push('/my-courses')}
                          className="w-full btn btn-primary mb-3"
                        >
                          <FiPlay className="w-4 h-4 mr-2" />
                          Continue Learning
                        </button>
                      ) : isInCart ? (
                        <button
                          onClick={() => router.push('/cart')}
                          className="w-full btn btn-outline mb-3"
                        >
                          <FiShoppingCart className="w-4 h-4 mr-2" />
                          View Cart
                        </button>
                      ) : (
                        <button
                          onClick={handleAddToCart}
                          className="w-full btn btn-primary mb-3"
                        >
                          <FiShoppingCart className="w-4 h-4 mr-2" />
                          Add to Cart
                        </button>
                      )}
                      
                      <div className="text-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          30-Day Money-Back Guarantee
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Instructor Info */}
                  <div className="card mt-6">
                    <div className="p-6">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Instructor</h3>
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                          <FiUser className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {course.instructor?.name || 'Unknown Instructor'}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {course.instructor?.bio || 'Course instructor'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reviews Section */}
              <div className="mt-12">
                <div className="card">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Reviews ({course.reviews?.length || 0})
                      </h3>
                      {isAuthenticated() && (
                        <button
                          onClick={() => setShowReviewForm(!showReviewForm)}
                          className="btn btn-outline"
                        >
                          Write a Review
                        </button>
                      )}
                      {/* Debug info */}
                      <div className="text-xs text-gray-500">
                        Auth: {isAuthenticated() ? 'Yes' : 'No'} | 
                        User: {user?.name || 'None'}
                      </div>
                    </div>

                    {/* Review Form */}
                    {showReviewForm && isAuthenticated() && (
                      <form onSubmit={handleReviewSubmit} className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Rating
                          </label>
                          <div className="flex items-center space-x-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                                className={`text-2xl ${
                                  star <= reviewForm.rating
                                    ? 'text-yellow-500'
                                    : 'text-gray-300 dark:text-gray-600'
                                }`}
                              >
                                ★
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Comment
                          </label>
                          <textarea
                            value={reviewForm.comment}
                            onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="Share your thoughts about this course..."
                            required
                          />
                        </div>
                        <div className="flex justify-end space-x-3">
                          <button
                            type="button"
                            onClick={() => setShowReviewForm(false)}
                            className="btn btn-outline"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="btn btn-primary"
                          >
                            Submit Review
                          </button>
                        </div>
                      </form>
                    )}

                    {/* Reviews List */}
                    <div className="space-y-4">
                      {course.reviews && course.reviews.length > 0 ? (
                        course.reviews.map((review, index) => (
                          <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <div className="flex items-center">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <span
                                      key={star}
                                      className={`text-sm ${
                                        star <= review.rating
                                          ? 'text-yellow-500'
                                          : 'text-gray-300 dark:text-gray-600'
                                      }`}
                                    >
                                      ★
                                    </span>
                                  ))}
                                </div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                  by {review.user?.name || 'Anonymous'}
                                </span>
                              </div>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                          <p>No reviews yet. Be the first to review this course!</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      
    </div>
  );
}

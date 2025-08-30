import { useEffect, useState } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import { coursesAPI } from '../utils/api';
import { FiPlay, FiUsers, FiStar, FiClock } from 'react-icons/fi';

export default function Home() {
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedCourses = async () => {
      try {
        const response = await coursesAPI.getAll({ featured: true, limit: 6 });
        setFeaturedCourses(response.data.courses);
      } catch (error) {
        console.error('Error fetching featured courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedCourses();
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Learn New Skills
            <span className="block text-primary-200">Online with Top Educators</span>
          </h1>
          <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-3xl mx-auto">
            Build skills with courses, certificates, and degrees online from world-class universities and companies.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/courses" className="btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 text-lg">
              Browse Courses
            </Link>
            <Link href="/register" className="btn btn-outline border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3 text-lg">
              Get Started
            </Link>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500 rounded-full opacity-20"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-400 rounded-full opacity-20"></div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">1000+</div>
              <div className="text-gray-600">Online Courses</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">500+</div>
              <div className="text-gray-600">Expert Instructors</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">50K+</div>
              <div className="text-gray-600">Active Students</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">95%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Courses</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our most popular and highly-rated courses from top instructors
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCourses.map((course) => (
                <div key={course._id} className="card hover:shadow-lg transition-shadow duration-300">
                  <div className="relative">
                    <img
                      src={course.thumbnail || 'https://via.placeholder.com/400x250?text=Course+Image'}
                      alt={course.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                        <FiPlay className="w-8 h-8 text-primary-600 ml-1" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="badge badge-primary">{course.category}</span>
                      <span className="badge badge-secondary">{course.level}</span>
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
                      
                      {course.rating && course.rating.average > 0 && (
                        <div className="flex items-center space-x-1">
                          <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium">{course.rating.average.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-primary-600">
                        ${course.price}
                      </div>
                      <Link
                        href={`/courses/${course._id}`}
                        className="btn btn-primary"
                      >
                        View Course
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/courses" className="btn btn-outline px-8 py-3 text-lg">
              View All Courses
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose CourseHub?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We provide the best learning experience with our comprehensive platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiPlay className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Learn at Your Own Pace</h3>
              <p className="text-gray-600">
                Access course content anytime, anywhere. Learn at your own speed and convenience.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiUsers className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Instructors</h3>
              <p className="text-gray-600">
                Learn from industry experts and professionals with years of experience.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiStar className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality Content</h3>
              <p className="text-gray-600">
                High-quality, up-to-date content that helps you stay ahead in your field.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of students who are already learning and growing with CourseHub
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 text-lg">
              Get Started Today
            </Link>
            <Link href="/courses" className="btn btn-outline border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3 text-lg">
              Browse Courses
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}

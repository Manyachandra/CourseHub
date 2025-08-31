import Layout from '../components/Layout';
import { useThemeStore } from '../utils/store';
import { FiUsers, FiTarget, FiAward, FiHeart } from 'react-icons/fi';

export default function About() {
  const { theme } = useThemeStore();

  return (
    <div className={`min-h-screen transition-colors duration-200 ${theme && theme === 'dark' ? 'dark' : ''}`}>
      <Layout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          {/* Hero Section */}
          <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">About CourseHub</h1>
              <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto">
                Empowering learners worldwide with quality education and skill development
              </p>
            </div>
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500 rounded-full opacity-20"></div>
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-400 rounded-full opacity-20"></div>
            </div>
          </section>

          {/* Mission Section */}
          <section className="py-16 bg-white dark:bg-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h2>
                <p className="text-lg text-gray-600 dark:text-white max-w-3xl mx-auto">
                  To democratize education by providing accessible, high-quality online courses 
                  that empower individuals to achieve their learning goals and advance their careers.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiTarget className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Accessibility</h3>
                  <p className="text-gray-600 dark:text-white">
                    Making quality education available to everyone, regardless of location or background.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiAward className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Quality</h3>
                  <p className="text-gray-600 dark:text-white">
                    Curating the best courses from expert instructors and industry professionals.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiHeart className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Community</h3>
                  <p className="text-gray-600 dark:text-white">
                    Building a supportive learning community where students can grow together.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Story Section */}
          <section className="py-16 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Story</h2>
                  <div className="space-y-4 text-gray-600 dark:text-white">
                    <p>
                      CourseHub was founded in 2024 with a simple yet powerful vision: to make 
                      world-class education accessible to everyone. What started as a small platform 
                      has grown into a comprehensive learning ecosystem.
                    </p>
                    <p>
                      We believe that education should be a right, not a privilege. Our platform 
                      brings together expert instructors, cutting-edge content, and innovative 
                      learning technologies to create an unparalleled educational experience.
                    </p>
                    <p>
                      Today, CourseHub serves thousands of learners worldwide, helping them acquire 
                      new skills, advance their careers, and pursue their passions.
                    </p>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">1000+</div>
                      <div className="text-sm text-gray-600 dark:text-white">Online Courses</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">500+</div>
                      <div className="text-sm text-gray-600 dark:text-white">Expert Instructors</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">50K+</div>
                      <div className="text-sm text-gray-600 dark:text-white">Happy Students</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">95%</div>
                      <div className="text-sm text-gray-600 dark:text-white">Success Rate</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Values Section */}
          <section className="py-16 bg-white dark:bg-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Values</h2>
                <p className="text-lg text-gray-600 dark:text-white max-w-3xl mx-auto">
                  The principles that guide everything we do at CourseHub
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiUsers className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Inclusivity</h3>
                  <p className="text-gray-600 dark:text-white text-sm">
                    Welcoming learners from all backgrounds and skill levels
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiTarget className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Excellence</h3>
                  <p className="text-gray-600 dark:text-white text-sm">
                    Maintaining the highest standards in course quality and delivery
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiAward className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Innovation</h3>
                  <p className="text-gray-600 dark:text-white text-sm">
                    Continuously improving our platform and learning experience
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiHeart className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Passion</h3>
                  <p className="text-gray-600 dark:text-white text-sm">
                    Loving what we do and inspiring others to learn
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Team Section */}
          <section className="py-16 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Team</h2>
                <p className="text-lg text-gray-600 dark:text-white max-w-3xl mx-auto">
                  Meet the passionate individuals behind CourseHub's mission
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-24 h-24 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">S</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Sarah Johnson</h3>
                  <p className="text-primary-600 dark:text-primary-400 mb-2">CEO & Founder</p>
                  <p className="text-gray-600 dark:text-white text-sm">
                    Former educator with 15+ years of experience in online learning
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-24 h-24 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">M</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Michael Chen</h3>
                  <p className="text-primary-600 dark:text-primary-400 mb-2">CTO</p>
                  <p className="text-gray-600 dark:text-white text-sm">
                    Tech enthusiast passionate about creating seamless learning experiences
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-24 h-24 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">E</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Emily Rodriguez</h3>
                  <p className="text-primary-600 dark:text-primary-400 mb-2">Head of Content</p>
                  <p className="text-gray-600 dark:text-white text-sm">
                    Curriculum expert dedicated to quality educational content
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 bg-primary-600 dark:bg-primary-700">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Learning?</h2>
              <p className="text-xl text-primary-100 mb-8">
                Join thousands of learners who have already transformed their careers with CourseHub
              </p>
              <a
                href="/courses"
                className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
              >
                Explore Courses
              </a>
            </div>
          </section>
        </div>
      </Layout>
    </div>
  );
}

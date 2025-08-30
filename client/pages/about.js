import Layout from '../components/Layout';
import { FiUsers, FiTarget, FiAward, FiHeart } from 'react-icons/fi';

export default function About() {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
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
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                To democratize education by providing accessible, high-quality online courses 
                that empower individuals to achieve their learning goals and advance their careers.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiTarget className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Accessibility</h3>
                <p className="text-gray-600">
                  Making quality education available to everyone, regardless of location or background.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiAward className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality</h3>
                <p className="text-gray-600">
                  Curating the best courses from expert instructors and industry professionals.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiHeart className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Community</h3>
                <p className="text-gray-600">
                  Building a supportive learning community where students can grow together.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
                <div className="space-y-4 text-gray-600">
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
              
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary-600 mb-2">1000+</div>
                    <div className="text-sm text-gray-600">Online Courses</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary-600 mb-2">500+</div>
                    <div className="text-sm text-gray-600">Expert Instructors</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary-600 mb-2">50K+</div>
                    <div className="text-sm text-gray-600">Active Students</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary-600 mb-2">95%</div>
                    <div className="text-sm text-gray-600">Success Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Team</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Meet the passionate individuals behind CourseHub who are dedicated to 
                transforming education and empowering learners worldwide.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-32 h-32 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiUsers className="w-16 h-16 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Leadership Team</h3>
                <p className="text-gray-600">
                  Experienced professionals guiding our strategic vision and growth.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-32 h-32 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiUsers className="w-16 h-16 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Content Team</h3>
                <p className="text-gray-600">
                  Curating and quality-assuring the best educational content.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-32 h-32 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiUsers className="w-16 h-16 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Support Team</h3>
                <p className="text-gray-600">
                  Providing exceptional customer service and technical support.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                The principles that guide everything we do at CourseHub
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Innovation</h3>
                <p className="text-gray-600 text-sm">
                  Continuously improving our platform and learning experience.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Excellence</h3>
                <p className="text-gray-600 text-sm">
                  Maintaining the highest standards in everything we do.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Integrity</h3>
                <p className="text-gray-600 text-sm">
                  Building trust through honest and transparent practices.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Impact</h3>
                <p className="text-gray-600 text-sm">
                  Making a positive difference in learners' lives.
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
              <a href="/courses" className="btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 text-lg">
                Browse Courses
              </a>
              <a href="/register" className="btn btn-outline border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3 text-lg">
                Get Started Today
              </a>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}

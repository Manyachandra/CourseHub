import Layout from '../components/Layout';
import { useThemeStore } from '../utils/store';
import { FiFileText, FiCheckCircle, FiAlertTriangle, FiGavel } from 'react-icons/fi';

export default function Terms() {
  const { theme } = useThemeStore();

  return (
    <div className={`min-h-screen transition-colors duration-200 ${theme === 'dark' ? 'dark' : ''}`}>
      <Layout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          {/* Hero Section */}
          <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">Terms of Service</h1>
              <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto">
                The terms and conditions for using CourseHub
              </p>
            </div>
          </section>

          {/* Content */}
          <section className="py-16 bg-white dark:bg-gray-800">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="prose prose-lg max-w-none dark:prose-invert">
                <div className="text-center mb-12">
                  <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiFileText className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                  </div>
                  <p className="text-gray-600 dark:text-white">
                    Last updated: {new Date().toLocaleDateString()}
                  </p>
                </div>

                <h2 className="text-gray-900 dark:text-white">1. Acceptance of Terms</h2>
                <p className="text-gray-700 dark:text-white">
                  By accessing and using CourseHub ("the Platform"), you accept and agree to be bound by the terms and provision of this agreement. 
                  If you do not agree to abide by the above, please do not use this service.
                </p>

                <h2 className="text-gray-900 dark:text-white">2. Description of Service</h2>
                <p className="text-gray-700 dark:text-white">
                  CourseHub is an online learning platform that provides access to educational courses, content, and related services. 
                  Our services include but are not limited to:
                </p>
                <ul className="text-gray-700 dark:text-white">
                  <li>Access to online courses and educational content</li>
                  <li>Interactive learning features and tools</li>
                  <li>Progress tracking and assessment</li>
                  <li>Community forums and discussion boards</li>
                  <li>Customer support and technical assistance</li>
                </ul>

                <h2 className="text-gray-900 dark:text-white">3. User Accounts and Registration</h2>
                
                <h3 className="text-gray-900 dark:text-white">3.1 Account Creation</h3>
                <p className="text-gray-700 dark:text-white">To access certain features of the Platform, you must create an account. You agree to:</p>
                <ul className="text-gray-700 dark:text-white">
                  <li>Provide accurate, current, and complete information</li>
                  <li>Maintain and update your account information</li>
                  <li>Keep your account credentials secure and confidential</li>
                  <li>Accept responsibility for all activities under your account</li>
                </ul>

                <h3 className="text-gray-900 dark:text-white">3.2 Account Security</h3>
                <p className="text-gray-700 dark:text-white">You are responsible for:</p>
                <ul className="text-gray-700 dark:text-white">
                  <li>Maintaining the confidentiality of your password</li>
                  <li>All activities that occur under your account</li>
                  <li>Notifying us immediately of any unauthorized use</li>
                  <li>Ensuring your account is secure and protected</li>
                </ul>

                <h2 className="text-gray-900 dark:text-white">4. Course Access and Usage</h2>
                
                <h3 className="text-gray-900 dark:text-white">4.1 Course Enrollment</h3>
                <p className="text-gray-700 dark:text-white">When you enroll in a course:</p>
                <ul className="text-gray-700 dark:text-white">
                  <li>You gain access to the course content for the specified duration</li>
                  <li>Access is personal and non-transferable</li>
                  <li>You may not share your access with others</li>
                  <li>Course content is for educational purposes only</li>
                </ul>

                <h3 className="text-gray-900 dark:text-white">4.2 Acceptable Use</h3>
                <p className="text-gray-700 dark:text-white">You agree to use the Platform and course content:</p>
                <ul className="text-gray-700 dark:text-white">
                  <li>For personal, non-commercial educational purposes</li>
                  <li>In compliance with all applicable laws and regulations</li>
                  <li>Without attempting to copy, distribute, or reproduce content</li>
                  <li>Without interfering with the Platform's operation</li>
                </ul>

                <h3 className="text-gray-900 dark:text-white">4.3 Prohibited Activities</h3>
                <p className="text-gray-700 dark:text-white">You may not:</p>
                <ul className="text-gray-700 dark:text-white">
                  <li>Share or distribute course content to third parties</li>
                  <li>Attempt to reverse engineer or hack the Platform</li>
                  <li>Use automated systems to access the Platform</li>
                  <li>Engage in any form of academic dishonesty</li>
                  <li>Harass, abuse, or harm other users</li>
                </ul>

                <h2 className="text-gray-900 dark:text-white">5. Payment and Billing</h2>
                
                <h3 className="text-gray-900 dark:text-white">5.1 Course Pricing</h3>
                <p className="text-gray-700 dark:text-white">
                  Course prices are clearly displayed on our platform. All prices are in USD unless otherwise stated. 
                  Prices may be subject to change, but changes will not affect courses you have already purchased.
                </p>

                <h3 className="text-gray-900 dark:text-white">5.2 Payment Methods</h3>
                <p className="text-gray-700 dark:text-white">We accept various payment methods including:</p>
                <ul className="text-gray-700 dark:text-white">
                  <li>Credit and debit cards</li>
                  <li>PayPal and other digital wallets</li>
                  <li>Bank transfers (for certain regions)</li>
                </ul>

                <h3 className="text-gray-900 dark:text-white">5.3 Refunds</h3>
                <p className="text-gray-700 dark:text-white">
                  We offer a 30-day money-back guarantee for all course purchases. If you're not satisfied with your course, 
                  contact our support team within 30 days of purchase for a full refund.
                </p>

                <h2 className="text-gray-900 dark:text-white">6. Intellectual Property</h2>
                
                <h3 className="text-gray-900 dark:text-white">6.1 Platform Content</h3>
                <p className="text-gray-700 dark:text-white">
                  All content on the Platform, including but not limited to text, graphics, images, videos, and software, 
                  is owned by CourseHub or its licensors and is protected by copyright and other intellectual property laws.
                </p>

                <h3 className="text-gray-900 dark:text-white">6.2 Course Content</h3>
                <p className="text-gray-700 dark:text-white">
                  Course content is provided by instructors and may be subject to their own intellectual property rights. 
                  You may not reproduce, distribute, or create derivative works from course content.
                </p>

                <h2 className="text-gray-900 dark:text-white">7. Privacy and Data Protection</h2>
                <p className="text-gray-700 dark:text-white">
                  Your privacy is important to us. Our collection and use of personal information is governed by our 
                  <a href="/privacy" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"> Privacy Policy</a>, 
                  which is incorporated into these Terms by reference.
                </p>

                <h2 className="text-gray-900 dark:text-white">8. Termination</h2>
                
                <h3 className="text-gray-900 dark:text-white">8.1 Account Termination</h3>
                <p className="text-gray-700 dark:text-white">
                  We may terminate or suspend your account at any time for violations of these Terms or for any other reason 
                  at our sole discretion.
                </p>

                <h3 className="text-gray-900 dark:text-white">8.2 Effect of Termination</h3>
                <p className="text-gray-700 dark:text-white">
                  Upon termination, your right to access the Platform and course content will cease immediately. 
                  You may lose access to purchased courses and any associated data.
                </p>

                <h2 className="text-gray-900 dark:text-white">9. Disclaimers and Limitations</h2>
                
                <h3 className="text-gray-900 dark:text-white">9.1 Service Availability</h3>
                <p className="text-gray-700 dark:text-white">
                  We strive to provide reliable service but cannot guarantee uninterrupted access to the Platform. 
                  We may need to perform maintenance or updates that temporarily affect service availability.
                </p>

                <h3 className="text-gray-900 dark:text-white">9.2 Course Quality</h3>
                <p className="text-gray-700 dark:text-white">
                  While we review and curate course content, we cannot guarantee the accuracy, completeness, or usefulness 
                  of any course. Course outcomes may vary based on individual effort and circumstances.
                </p>

                <h2 className="text-gray-900 dark:text-white">10. Limitation of Liability</h2>
                <p className="text-gray-700 dark:text-white">
                  To the maximum extent permitted by law, CourseHub shall not be liable for any indirect, incidental, 
                  special, consequential, or punitive damages arising from your use of the Platform.
                </p>

                <h2 className="text-gray-900 dark:text-white">11. Governing Law</h2>
                <p className="text-gray-700 dark:text-white">
                  These Terms are governed by and construed in accordance with the laws of the jurisdiction in which 
                  CourseHub operates, without regard to conflict of law principles.
                </p>

                <h2 className="text-gray-900 dark:text-white">12. Changes to Terms</h2>
                <p className="text-gray-700 dark:text-white">
                  We reserve the right to modify these Terms at any time. We will notify users of significant changes 
                  by posting the updated Terms on our platform and updating the "Last updated" date.
                </p>

                <h2 className="text-gray-900 dark:text-white">13. Contact Information</h2>
                <p className="text-gray-700 dark:text-white">
                  If you have any questions about these Terms, please contact us:
                </p>
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                  <p className="text-gray-700 dark:text-white mb-2">
                    <strong>Email:</strong> legal@coursehub.com
                  </p>
                  <p className="text-gray-700 dark:text-white mb-2">
                    <strong>Phone:</strong> +1 (800) COURSE
                  </p>
                  <p className="text-gray-700 dark:text-white">
                    <strong>Address:</strong> 123 Learning Street, Education City, EC 12345
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Key Points Section */}
          <section className="py-16 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Key Points to Remember</h2>
                <p className="text-lg text-gray-600 dark:text-white max-w-3xl mx-auto">
                  Important highlights from our Terms of Service
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiCheckCircle className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">30-Day Refund</h3>
                  <p className="text-gray-600 dark:text-white text-sm">
                    Full refund if you're not satisfied with your course
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiAlertTriangle className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Personal Use Only</h3>
                  <p className="text-gray-600 dark:text-white text-sm">
                    Course content is for your personal learning only
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiGavel className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Account Security</h3>
                  <p className="text-gray-600 dark:text-white text-sm">
                    You're responsible for keeping your account secure
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiFileText className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Lifetime Access</h3>
                  <p className="text-gray-600 dark:text-white text-sm">
                    Access your purchased courses anytime
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </Layout>
    </div>
  );
}

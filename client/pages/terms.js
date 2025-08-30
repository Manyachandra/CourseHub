import Layout from '../components/Layout';
import { FiFileText, FiCheckCircle, FiAlertTriangle, FiGavel } from 'react-icons/fi';

export default function Terms() {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
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
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg max-w-none">
              <div className="text-center mb-12">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiFileText className="w-8 h-8 text-primary-600" />
                </div>
                <p className="text-gray-600">
                  Last updated: {new Date().toLocaleDateString()}
                </p>
              </div>

              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing and using CourseHub ("the Platform"), you accept and agree to be bound by the terms and provision of this agreement. 
                If you do not agree to abide by the above, please do not use this service.
              </p>

              <h2>2. Description of Service</h2>
              <p>
                CourseHub is an online learning platform that provides access to educational courses, content, and related services. 
                Our services include but are not limited to:
              </p>
              <ul>
                <li>Access to online courses and educational content</li>
                <li>Interactive learning features and tools</li>
                <li>Progress tracking and assessment</li>
                <li>Community forums and discussion boards</li>
                <li>Customer support and technical assistance</li>
              </ul>

              <h2>3. User Accounts and Registration</h2>
              
              <h3>3.1 Account Creation</h3>
              <p>To access certain features of the Platform, you must create an account. You agree to:</p>
              <ul>
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and update your account information</li>
                <li>Keep your account credentials secure and confidential</li>
                <li>Accept responsibility for all activities under your account</li>
              </ul>

              <h3>3.2 Account Security</h3>
              <p>You are responsible for:</p>
              <ul>
                <li>Maintaining the confidentiality of your password</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized use</li>
                <li>Ensuring your account is secure and protected</li>
              </ul>

              <h2>4. Course Access and Usage</h2>
              
              <h3>4.1 Course Enrollment</h3>
              <p>When you enroll in a course:</p>
              <ul>
                <li>You gain access to the course content for the specified duration</li>
                <li>Access is personal and non-transferable</li>
                <li>You may not share your access with others</li>
                <li>Course content is for educational purposes only</li>
              </ul>

              <h3>4.2 Acceptable Use</h3>
              <p>You agree to use the Platform and course content:</p>
              <ul>
                <li>For personal, non-commercial educational purposes</li>
                <li>In compliance with all applicable laws and regulations</li>
                <li>Without attempting to copy, distribute, or reproduce content</li>
                <li>Without interfering with the Platform's operation</li>
              </ul>

              <h3>4.3 Prohibited Activities</h3>
              <p>You may not:</p>
              <ul>
                <li>Share or distribute course content to third parties</li>
                <li>Attempt to reverse engineer or hack the Platform</li>
                <li>Use automated systems to access the Platform</li>
                <li>Engage in any form of academic dishonesty</li>
                <li>Harass, abuse, or harm other users</li>
              </ul>

              <h2>5. Payment and Billing</h2>
              
              <h3>5.1 Course Pricing</h3>
              <p>Course prices are displayed on the Platform and are subject to change. We reserve the right to modify pricing at any time.</p>

              <h3>5.2 Payment Processing</h3>
              <p>All payments are processed through secure third-party payment processors. You agree to provide accurate payment information and authorize us to charge your payment method.</p>

              <h3>5.3 Refunds</h3>
              <p>We offer a 30-day money-back guarantee for most courses. Refund requests must be submitted within 30 days of purchase and are subject to review.</p>

              <h2>6. Intellectual Property Rights</h2>
              
              <h3>6.1 Platform Content</h3>
              <p>The Platform and its content, including but not limited to text, graphics, images, videos, and software, are owned by CourseHub or its licensors and are protected by copyright and other intellectual property laws.</p>

              <h3>6.2 Course Content</h3>
              <p>Course content is provided by instructors and may be subject to their own intellectual property rights. You may not reproduce, distribute, or create derivative works from course content.</p>

              <h3>6.3 User-Generated Content</h3>
              <p>By submitting content to the Platform, you grant us a non-exclusive, worldwide, royalty-free license to use, reproduce, and distribute your content.</p>

              <h2>7. Privacy and Data Protection</h2>
              <p>
                Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, 
                which is incorporated into these Terms by reference.
              </p>

              <h2>8. Disclaimers and Limitations</h2>
              
              <h3>8.1 Service Availability</h3>
              <p>We strive to provide reliable service but cannot guarantee uninterrupted access. The Platform may be temporarily unavailable due to maintenance or technical issues.</p>

              <h3>8.2 Course Quality</h3>
              <p>While we strive to maintain high-quality courses, we do not guarantee specific learning outcomes or results. Course effectiveness may vary based on individual effort and circumstances.</p>

              <h3>8.3 Limitation of Liability</h3>
              <p>To the maximum extent permitted by law, CourseHub shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Platform.</p>

              <h2>9. Termination</h2>
              
              <h3>9.1 Account Termination</h3>
              <p>We may terminate or suspend your account at any time for violations of these Terms or for any other reason at our sole discretion.</p>

              <h3>9.2 Effect of Termination</h3>
              <p>Upon termination, your right to access the Platform and course content will cease immediately. You may lose access to purchased courses and account data.</p>

              <h2>10. Modifications to Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. We will notify users of material changes through the Platform or by email. 
                Your continued use of the Platform after such changes constitutes acceptance of the modified Terms.
              </p>

              <h2>11. Governing Law and Dispute Resolution</h2>
              
              <h3>11.1 Governing Law</h3>
              <p>These Terms are governed by and construed in accordance with the laws of the jurisdiction in which CourseHub operates.</p>

              <h3>11.2 Dispute Resolution</h3>
              <p>Any disputes arising from these Terms or your use of the Platform shall be resolved through binding arbitration in accordance with our dispute resolution procedures.</p>

              <h2>12. Contact Information</h2>
              <p>If you have any questions about these Terms, please contact us:</p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p><strong>Email:</strong> legal@coursehub.com</p>
                <p><strong>Phone:</strong> +1 (800) COURSE</p>
                <p><strong>Address:</strong> 123 Learning Street, Education City, EC 12345</p>
              </div>

              <h2>13. Severability</h2>
              <p>
                If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary 
                so that these Terms will otherwise remain in full force and effect.
              </p>

              <h2>14. Entire Agreement</h2>
              <p>
                These Terms constitute the entire agreement between you and CourseHub regarding the use of the Platform and supersede all prior agreements and understandings.
              </p>

              <h2>15. Acknowledgment</h2>
              <p>
                By using CourseHub, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
              </p>
            </div>
          </div>
        </section>

        {/* Summary Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <FiCheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">What You Can Do</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Access purchased courses</li>
                  <li>• Participate in discussions</li>
                  <li>• Track your learning progress</li>
                  <li>• Contact support when needed</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <FiAlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">What You Cannot Do</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Share course content</li>
                  <li>• Create multiple accounts</li>
                  <li>• Attempt to hack the platform</li>
                  <li>• Harass other users</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Questions About Terms?</h2>
            <p className="text-lg text-gray-600 mb-8">
              Our legal team is here to help clarify any terms or conditions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/contact" className="btn btn-primary px-8 py-3 text-lg">
                Contact Legal Team
              </a>
              <a href="/help" className="btn btn-outline px-8 py-3 text-lg">
                Visit Help Center
              </a>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}

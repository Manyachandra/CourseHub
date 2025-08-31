import Layout from '../components/Layout';
import { useThemeStore } from '../utils/store';
import { FiShield, FiEye, FiLock, FiUserCheck } from 'react-icons/fi';

export default function Privacy() {
  const { theme } = useThemeStore();

  return (
    <div className={`min-h-screen transition-colors duration-200 ${theme === 'dark' ? 'dark' : ''}`}>
      <Layout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          {/* Hero Section */}
          <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">Privacy Policy</h1>
              <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto">
                How we protect and handle your personal information
              </p>
            </div>
          </section>

          {/* Content */}
          <section className="py-16 bg-white dark:bg-gray-800">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="prose prose-lg max-w-none dark:prose-invert">
                <div className="text-center mb-12">
                  <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiShield className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                  </div>
                  <p className="text-gray-600 dark:text-white">
                    Last updated: {new Date().toLocaleDateString()}
                  </p>
                </div>

                <h2 className="text-gray-900 dark:text-white">1. Introduction</h2>
                <p className="text-gray-700 dark:text-white">
                  At CourseHub, we are committed to protecting your privacy and ensuring the security of your personal information. 
                  This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
                </p>

                <h2 className="text-gray-900 dark:text-white">2. Information We Collect</h2>
                
                <h3 className="text-gray-900 dark:text-white">2.1 Personal Information</h3>
                <p className="text-gray-700 dark:text-white">We may collect the following personal information:</p>
                <ul className="text-gray-700 dark:text-white">
                  <li>Name and contact information (email address, phone number)</li>
                  <li>Account credentials and profile information</li>
                  <li>Payment and billing information</li>
                  <li>Course preferences and learning history</li>
                  <li>Communication preferences</li>
                </ul>

                <h3 className="text-gray-900 dark:text-white">2.2 Usage Information</h3>
                <p className="text-gray-700 dark:text-white">We automatically collect certain information about your use of our platform:</p>
                <ul className="text-gray-700 dark:text-white">
                  <li>Device information (IP address, browser type, operating system)</li>
                  <li>Usage patterns and course progress</li>
                  <li>Interaction with course content and features</li>
                  <li>Performance and technical data</li>
                </ul>

                <h2 className="text-gray-900 dark:text-white">3. How We Use Your Information</h2>
                <p className="text-gray-700 dark:text-white">We use your information for the following purposes:</p>
                <ul className="text-gray-700 dark:text-white">
                  <li>Providing and improving our educational services</li>
                  <li>Processing payments and managing your account</li>
                  <li>Personalizing your learning experience</li>
                  <li>Communicating with you about courses and updates</li>
                  <li>Ensuring platform security and preventing fraud</li>
                  <li>Complying with legal obligations</li>
                </ul>

                <h2 className="text-gray-900 dark:text-white">4. Information Sharing and Disclosure</h2>
                <p className="text-gray-700 dark:text-white">We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:</p>
                <ul className="text-gray-700 dark:text-white">
                  <li><strong>Service Providers:</strong> With trusted third-party service providers who assist us in operating our platform</li>
                  <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
                  <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                  <li><strong>Consent:</strong> With your explicit consent for specific purposes</li>
                </ul>

                <h2 className="text-gray-900 dark:text-white">5. Data Security</h2>
                <p className="text-gray-700 dark:text-white">We implement appropriate technical and organizational measures to protect your personal information:</p>
                <ul className="text-gray-700 dark:text-white">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Regular security assessments and updates</li>
                  <li>Access controls and authentication measures</li>
                  <li>Employee training on data protection</li>
                  <li>Incident response and breach notification procedures</li>
                </ul>

                <h2 className="text-gray-900 dark:text-white">6. Your Rights and Choices</h2>
                <p className="text-gray-700 dark:text-white">You have the following rights regarding your personal information:</p>
                <ul className="text-gray-700 dark:text-white">
                  <li><strong>Access:</strong> Request access to your personal information</li>
                  <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                  <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
                  <li><strong>Objection:</strong> Object to certain processing activities</li>
                  <li><strong>Withdrawal:</strong> Withdraw consent where applicable</li>
                </ul>

                <h2 className="text-gray-900 dark:text-white">7. Cookies and Tracking Technologies</h2>
                <p className="text-gray-700 dark:text-white">We use cookies and similar technologies to enhance your experience:</p>
                <ul className="text-gray-700 dark:text-white">
                  <li><strong>Essential Cookies:</strong> Required for basic platform functionality</li>
                  <li><strong>Performance Cookies:</strong> Help us understand how visitors interact with our platform</li>
                  <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
                  <li><strong>Analytics Cookies:</strong> Provide insights into platform usage and performance</li>
                </ul>

                <h2 className="text-gray-900 dark:text-white">8. Data Retention</h2>
                <p className="text-gray-700 dark:text-white">We retain your personal information for as long as necessary to:</p>
                <ul className="text-gray-700 dark:text-white">
                  <li>Provide our services and maintain your account</li>
                  <li>Comply with legal obligations</li>
                  <li>Resolve disputes and enforce agreements</li>
                  <li>Improve our platform and services</li>
                </ul>

                <h2 className="text-gray-900 dark:text-white">9. International Data Transfers</h2>
                <p className="text-gray-700 dark:text-white">
                  Your information may be transferred to and processed in countries other than your own. 
                  We ensure appropriate safeguards are in place to protect your data during such transfers.
                </p>

                <h2 className="text-gray-900 dark:text-white">10. Children's Privacy</h2>
                <p className="text-gray-700 dark:text-white">
                  Our platform is not intended for children under 13 years of age. 
                  We do not knowingly collect personal information from children under 13.
                </p>

                <h2 className="text-gray-900 dark:text-white">11. Changes to This Policy</h2>
                <p className="text-gray-700 dark:text-white">
                  We may update this Privacy Policy from time to time. We will notify you of any material changes 
                  by posting the new policy on our platform and updating the "Last updated" date.
                </p>

                <h2 className="text-gray-900 dark:text-white">12. Contact Us</h2>
                <p className="text-gray-700 dark:text-white">
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                  <p className="text-gray-700 dark:text-white mb-2">
                    <strong>Email:</strong> privacy@coursehub.com
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

          {/* Privacy Features Section */}
          <section className="py-16 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Your Privacy Matters</h2>
                <p className="text-lg text-gray-600 dark:text-white max-w-3xl mx-auto">
                  We're committed to protecting your data and giving you control over your information
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiShield className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Data Protection</h3>
                  <p className="text-gray-600 dark:text-white text-sm">
                    Industry-standard encryption and security measures
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiEye className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Transparency</h3>
                  <p className="text-gray-600 dark:text-white text-sm">
                    Clear information about how we use your data
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiLock className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Access Control</h3>
                  <p className="text-gray-600 dark:text-white text-sm">
                    You control who has access to your information
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiUserCheck className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Your Rights</h3>
                  <p className="text-gray-600 dark:text-white text-sm">
                    Full control over your personal data
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

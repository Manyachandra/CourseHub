import Layout from '../components/Layout';
import { FiShield, FiEye, FiLock, FiUserCheck } from 'react-icons/fi';

export default function Privacy() {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
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
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg max-w-none">
              <div className="text-center mb-12">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiShield className="w-8 h-8 text-primary-600" />
                </div>
                <p className="text-gray-600">
                  Last updated: {new Date().toLocaleDateString()}
                </p>
              </div>

              <h2>1. Introduction</h2>
              <p>
                At CourseHub, we are committed to protecting your privacy and ensuring the security of your personal information. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
              </p>

              <h2>2. Information We Collect</h2>
              
              <h3>2.1 Personal Information</h3>
              <p>We may collect the following personal information:</p>
              <ul>
                <li>Name and contact information (email address, phone number)</li>
                <li>Account credentials and profile information</li>
                <li>Payment and billing information</li>
                <li>Course preferences and learning history</li>
                <li>Communication preferences</li>
              </ul>

              <h3>2.2 Usage Information</h3>
              <p>We automatically collect certain information about your use of our platform:</p>
              <ul>
                <li>Device information (IP address, browser type, operating system)</li>
                <li>Usage patterns and course progress</li>
                <li>Interaction with course content and features</li>
                <li>Performance and technical data</li>
              </ul>

              <h2>3. How We Use Your Information</h2>
              <p>We use your information for the following purposes:</p>
              <ul>
                <li>Providing and improving our educational services</li>
                <li>Processing payments and managing your account</li>
                <li>Personalizing your learning experience</li>
                <li>Communicating with you about courses and updates</li>
                <li>Ensuring platform security and preventing fraud</li>
                <li>Complying with legal obligations</li>
              </ul>

              <h2>4. Information Sharing and Disclosure</h2>
              <p>We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:</p>
              <ul>
                <li><strong>Service Providers:</strong> With trusted third-party service providers who assist us in operating our platform</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                <li><strong>Consent:</strong> With your explicit consent for specific purposes</li>
              </ul>

              <h2>5. Data Security</h2>
              <p>We implement appropriate technical and organizational measures to protect your personal information:</p>
              <ul>
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security assessments and updates</li>
                <li>Access controls and authentication measures</li>
                <li>Employee training on data protection</li>
                <li>Incident response and breach notification procedures</li>
              </ul>

              <h2>6. Your Rights and Choices</h2>
              <p>You have the following rights regarding your personal information:</p>
              <ul>
                <li><strong>Access:</strong> Request access to your personal information</li>
                <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
                <li><strong>Objection:</strong> Object to certain processing activities</li>
                <li><strong>Withdrawal:</strong> Withdraw consent where applicable</li>
              </ul>

              <h2>7. Cookies and Tracking Technologies</h2>
              <p>We use cookies and similar technologies to enhance your experience:</p>
              <ul>
                <li><strong>Essential Cookies:</strong> Required for basic platform functionality</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how you use our platform</li>
                <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                <li><strong>Marketing Cookies:</strong> Deliver relevant content and advertisements</li>
              </ul>
              <p>You can control cookie preferences through your browser settings.</p>

              <h2>8. Third-Party Services</h2>
              <p>Our platform may integrate with third-party services:</p>
              <ul>
                <li>Payment processors (Stripe, PayPal)</li>
                <li>Analytics services (Google Analytics)</li>
                <li>Communication tools (email services)</li>
                <li>Social media platforms</li>
              </ul>
              <p>These services have their own privacy policies, and we encourage you to review them.</p>

              <h2>9. Data Retention</h2>
              <p>We retain your personal information for as long as necessary to:</p>
              <ul>
                <li>Provide our services and maintain your account</li>
                <li>Comply with legal obligations</li>
                <li>Resolve disputes and enforce agreements</li>
                <li>Improve our platform and services</li>
              </ul>
              <p>You may request deletion of your account and associated data at any time.</p>

              <h2>10. International Data Transfers</h2>
              <p>Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for such transfers in accordance with applicable data protection laws.</p>

              <h2>11. Children's Privacy</h2>
              <p>Our platform is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe we have collected such information, please contact us immediately.</p>

              <h2>12. Changes to This Policy</h2>
              <p>We may update this Privacy Policy from time to time. We will notify you of any material changes by:</p>
              <ul>
                <li>Posting the updated policy on our platform</li>
                <li>Sending you an email notification</li>
                <li>Displaying a prominent notice on our website</li>
              </ul>
              <p>Your continued use of our platform after such changes constitutes acceptance of the updated policy.</p>

              <h2>13. Contact Us</h2>
              <p>If you have any questions about this Privacy Policy or our data practices, please contact us:</p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p><strong>Email:</strong> privacy@coursehub.com</p>
                <p><strong>Phone:</strong> +1 (800) COURSE</p>
                <p><strong>Address:</strong> 123 Learning Street, Education City, EC 12345</p>
                <p><strong>Data Protection Officer:</strong> dpo@coursehub.com</p>
              </div>

              <h2>14. Legal Basis for Processing (EU Users)</h2>
              <p>If you are located in the European Union, our processing of your personal information is based on:</p>
              <ul>
                <li><strong>Consent:</strong> Where you have given clear consent</li>
                <li><strong>Contract:</strong> To provide our services under our terms</li>
                <li><strong>Legitimate Interest:</strong> To improve our platform and prevent fraud</li>
                <li><strong>Legal Obligation:</strong> To comply with applicable laws</li>
              </ul>

              <h2>15. California Privacy Rights (CCPA)</h2>
              <p>California residents have additional rights under the California Consumer Privacy Act:</p>
              <ul>
                <li>Right to know what personal information is collected</li>
                <li>Right to know whether personal information is sold or disclosed</li>
                <li>Right to say no to the sale of personal information</li>
                <li>Right to access and delete personal information</li>
                <li>Right to equal service and price</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Questions About Privacy?</h2>
            <p className="text-lg text-gray-600 mb-8">
              Our privacy team is here to help answer any questions you may have.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/contact" className="btn btn-primary px-8 py-3 text-lg">
                Contact Us
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

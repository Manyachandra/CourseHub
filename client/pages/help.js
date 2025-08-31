import { useState } from 'react';
import { useThemeStore } from '../utils/store';
import { FiSearch, FiMessageCircle, FiMail, FiPhone, FiClock, FiHelpCircle, FiChevronDown, FiChevronUp } from 'react-icons/fi';

export default function Help() {
  const { theme } = useThemeStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const faqs = [
    {
      id: 1,
      question: "How do I get started with a course?",
      answer: "After purchasing a course, you can access it immediately from your 'My Courses' page. Simply click on the course and start learning from the first lesson."
    },
    {
      id: 2,
      question: "Can I get a refund if I'm not satisfied?",
      answer: "Yes, we offer a 30-day money-back guarantee. If you're not satisfied with your course, contact our support team within 30 days of purchase for a full refund."
    },
    {
      id: 3,
      question: "How long do I have access to my purchased courses?",
      answer: "You have lifetime access to all courses you purchase. You can revisit the content anytime and learn at your own pace."
    },
    {
      id: 4,
      question: "Are the courses self-paced?",
      answer: "Yes, all our courses are self-paced. You can start, pause, and resume learning whenever it's convenient for you."
    },
    {
      id: 5,
      question: "Do I get a certificate after completing a course?",
      answer: "Yes, you'll receive a certificate of completion for each course you finish. Certificates are automatically generated and can be downloaded from your dashboard."
    },
    {
      id: 6,
      question: "Can I access courses on mobile devices?",
      answer: "Absolutely! Our platform is fully responsive and works on all devices including smartphones, tablets, and desktop computers."
    },
    {
      id: 7,
      question: "How do I contact my course instructor?",
      answer: "Each course has a discussion forum where you can ask questions and interact with your instructor and fellow students."
    },
    {
      id: 8,
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and other secure payment methods. All transactions are encrypted and secure."
    }
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${theme === 'dark' ? 'dark' : ''}`}>
      
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          {/* Hero Section */}
          <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">Help Center</h1>
              <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto">
                Find answers to your questions and get the support you need
              </p>
            </div>
          </section>

          {/* Search Section */}
          <section className="py-12 bg-white dark:bg-gray-800">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for help articles, FAQs, or topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-12 w-full text-lg"
                />
              </div>
            </div>
          </section>

          {/* Quick Help Categories */}
          <section className="py-16 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">Quick Help Categories</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mb-4">
                    <FiHelpCircle className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Getting Started</h3>
                  <p className="text-gray-600 dark:text-white text-sm">
                    Learn the basics of using CourseHub and getting started with your first course.
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mb-4">
                    <FiMessageCircle className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Account & Profile</h3>
                  <p className="text-gray-600 dark:text-white text-sm">
                    Manage your account settings, profile information, and preferences.
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mb-4">
                    <FiMail className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Billing & Payments</h3>
                  <p className="text-gray-600 dark:text-white text-sm">
                    Information about payment methods, refunds, and billing questions.
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mb-4">
                    <FiPhone className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Technical Support</h3>
                  <p className="text-gray-600 dark:text-white text-sm">
                    Get help with technical issues, platform problems, and troubleshooting.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-16 bg-white dark:bg-gray-800">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h2>
                <p className="text-lg text-gray-600 dark:text-white">
                  Quick answers to the most common questions
                </p>
              </div>
              
              <div className="space-y-4">
                {filteredFaqs.map((faq) => (
                  <div key={faq.id} className="card">
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full text-left p-6 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white pr-4">
                          {faq.question}
                        </h3>
                        <div className="flex-shrink-0">
                          {expandedFaq === faq.id ? (
                            <FiChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                          ) : (
                            <FiChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                          )}
                        </div>
                      </div>
                      
                      {expandedFaq === faq.id && (
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <p className="text-gray-600 dark:text-white leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Contact Support Section */}
          <section className="py-16 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Still Need Help?</h2>
              <p className="text-lg text-gray-600 dark:text-white mb-8">
                Can't find what you're looking for? Our support team is here to help!
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <FiMail className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Email Support</h3>
                  <p className="text-gray-600 dark:text-white text-sm mb-3">
                    Send us an email and we'll respond within 24 hours
                  </p>
                  <a
                    href="mailto:support@coursehub.com"
                    className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
                  >
                    support@coursehub.com
                  </a>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <FiPhone className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Phone Support</h3>
                  <p className="text-gray-600 dark:text-white text-sm mb-3">
                    Call us during business hours for immediate assistance
                  </p>
                  <a
                    href="tel:+1-800-COURSE"
                    className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
                  >
                    +1 (800) COURSE
                  </a>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <FiClock className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Business Hours</h3>
                  <p className="text-gray-600 dark:text-white text-sm mb-3">
                    Monday - Friday<br />
                    9:00 AM - 6:00 PM EST
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contact"
                  className="btn btn-primary px-8 py-3"
                >
                  Contact Support
                </a>
                <a
                  href="/faq"
                  className="btn btn-outline px-8 py-3"
                >
                  View All FAQs
                </a>
              </div>
            </div>
          </section>
        </div>
      
    </div>
  );
}

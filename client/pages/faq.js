import { useState } from 'react';
import Layout from '../components/Layout';
import { useThemeStore } from '../utils/store';
import { FiSearch, FiChevronDown, FiChevronUp, FiHelpCircle, FiBookOpen, FiCreditCard, FiShield, FiUsers } from 'react-icons/fi';

export default function FAQ() {
  const { theme } = useThemeStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  const faqCategories = {
    all: {
      name: 'All Questions',
      icon: <FiHelpCircle className="w-5 h-5" />
    },
    general: {
      name: 'General',
      icon: <FiHelpCircle className="w-5 h-5" />
    },
    courses: {
      name: 'Courses',
      icon: <FiBookOpen className="w-5 h-5" />
    },
    billing: {
      name: 'Billing & Payments',
      icon: <FiCreditCard className="w-5 h-5" />
    },
    security: {
      name: 'Security & Privacy',
      icon: <FiShield className="w-5 h-5" />
    },
    community: {
      name: 'Community',
      icon: <FiUsers className="w-5 h-5" />
    }
  };

  const allFaqs = [
    {
      id: 1,
      category: 'general',
      question: "What is CourseHub?",
      answer: "CourseHub is an online learning platform that offers high-quality courses in various subjects including programming, design, marketing, and more. We connect learners with expert instructors to provide accessible education."
    },
    {
      id: 2,
      category: 'general',
      question: "How do I create an account?",
      answer: "Creating an account is easy! Click the 'Sign Up' button in the top right corner, fill in your details, and you'll be ready to start learning in minutes."
    },
    {
      id: 3,
      category: 'courses',
      question: "How do I get started with a course?",
      answer: "After purchasing a course, you can access it immediately from your 'My Courses' page. Simply click on the course and start learning from the first lesson."
    },
    {
      id: 4,
      category: 'courses',
      question: "Are the courses self-paced?",
      answer: "Yes, all our courses are self-paced. You can start, pause, and resume learning whenever it's convenient for you."
    },
    {
      id: 5,
      category: 'courses',
      question: "Do I get a certificate after completing a course?",
      answer: "Yes, you'll receive a certificate of completion for each course you finish. Certificates are automatically generated and can be downloaded from your dashboard."
    },
    {
      id: 6,
      category: 'courses',
      question: "Can I access courses on mobile devices?",
      answer: "Absolutely! Our platform is fully responsive and works on all devices including smartphones, tablets, and desktop computers."
    },
    {
      id: 7,
      category: 'courses',
      question: "How long do I have access to my purchased courses?",
      answer: "You have lifetime access to all courses you purchase. You can revisit the content anytime and learn at your own pace."
    },
    {
      id: 8,
      category: 'courses',
      question: "How do I contact my course instructor?",
      answer: "Each course has a discussion forum where you can ask questions and interact with your instructor and fellow students."
    },
    {
      id: 9,
      category: 'billing',
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and other secure payment methods. All transactions are encrypted and secure."
    },
    {
      id: 10,
      category: 'billing',
      question: "Can I get a refund if I'm not satisfied?",
      answer: "Yes, we offer a 30-day money-back guarantee. If you're not satisfied with your course, contact our support team within 30 days of purchase for a full refund."
    },
    {
      id: 11,
      category: 'billing',
      question: "Do you offer any discounts or promotions?",
      answer: "Yes, we regularly offer discounts and promotions. Subscribe to our newsletter to stay updated on the latest deals and offers."
    },
    {
      id: 12,
      category: 'security',
      question: "Is my personal information secure?",
      answer: "Absolutely. We take data security seriously and use industry-standard encryption to protect your personal information and payment details."
    },
    {
      id: 13,
      category: 'security',
      question: "Can I download course materials?",
      answer: "Yes, most courses include downloadable materials like PDFs, source code, and other resources that you can keep for offline reference."
    },
    {
      id: 14,
      category: 'community',
      question: "Is there a community forum?",
      answer: "Yes, we have an active community forum where students can connect, share experiences, and help each other with their learning journey."
    },
    {
      id: 15,
      category: 'community',
      question: "Can I share my progress with others?",
      answer: "You can choose to share your learning progress and achievements on social media. We also have leaderboards for friendly competition."
    }
  ];

  const filteredFaqs = allFaqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${theme === 'dark' ? 'dark' : ''}`}>
      <Layout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h1>
              <p className="text-xl text-gray-600 dark:text-white max-w-3xl mx-auto">
                Find answers to common questions about CourseHub. Can't find what you're looking for? 
                <a href="/contact" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium ml-1">
                  Contact our support team
                </a>
              </p>
            </div>

            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative max-w-2xl mx-auto">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10 w-full"
                />
              </div>
            </div>

            {/* Category Tabs */}
            <div className="mb-8">
              <div className="flex flex-wrap justify-center gap-2">
                {Object.entries(faqCategories).map(([key, category]) => (
                  <button
                    key={key}
                    onClick={() => setActiveCategory(key)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                      activeCategory === key
                        ? 'bg-primary-600 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {category.icon}
                    <span>{category.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* FAQ List */}
            <div className="space-y-4">
              {filteredFaqs.length === 0 ? (
                <div className="text-center py-12">
                  <FiHelpCircle className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No questions found</h3>
                  <p className="text-gray-600 dark:text-white">
                    Try adjusting your search terms or category filter.
                  </p>
                </div>
              ) : (
                filteredFaqs.map((faq) => (
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
                ))
              )}
            </div>

            {/* Still Need Help Section */}
            <div className="mt-16 text-center">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-sm">
                <FiHelpCircle className="w-16 h-16 text-primary-600 dark:text-primary-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Still need help?</h3>
                <p className="text-gray-600 dark:text-white mb-6 max-w-2xl mx-auto">
                  Can't find the answer you're looking for? Our support team is here to help you with any questions or concerns.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="/contact"
                    className="btn btn-primary px-8 py-3"
                  >
                    Contact Support
                  </a>
                  <a
                    href="/help"
                    className="btn btn-outline px-8 py-3"
                  >
                    Visit Help Center
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
}

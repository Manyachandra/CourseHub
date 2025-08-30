import { useState } from 'react';
import Layout from '../components/Layout';
import { FiSearch, FiChevronDown, FiChevronUp, FiHelpCircle, FiBookOpen, FiCreditCard, FiShield, FiUsers } from 'react-icons/fi';

export default function FAQ() {
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
      question: "Are there any hidden fees?",
      answer: "No hidden fees! The price you see is the price you pay. There are no additional charges or subscription fees."
    },
    {
      id: 12,
      category: 'security',
      question: "Is my personal information secure?",
      answer: "Yes, we take security seriously. All personal information is encrypted and stored securely. We never share your data with third parties."
    },
    {
      id: 13,
      category: 'security',
      question: "How secure are the payment transactions?",
      answer: "All payment transactions are processed through secure, encrypted channels. We use industry-standard security protocols to protect your financial information."
    },
    {
      id: 14,
      category: 'community',
      question: "Can I interact with other students?",
      answer: "Yes! Our platform includes discussion forums, study groups, and community features where you can connect with fellow learners."
    },
    {
      id: 15,
      category: 'community',
      question: "Are there study groups or forums?",
      answer: "Yes, each course has its own discussion forum, and we also have general community forums where students can discuss various topics and form study groups."
    }
  ];

  const filteredFaqs = allFaqs.filter(faq => {
    const matchesSearch = !searchTerm || 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Frequently Asked Questions</h1>
            <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto">
              Find answers to the most common questions about CourseHub
            </p>
          </div>
        </section>

        {/* Search Section */}
        <section className="py-12 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for questions or topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
              />
            </div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="py-8 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap gap-3 justify-center">
              {Object.entries(faqCategories).map(([key, category]) => (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    activeCategory === key
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {category.icon}
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {activeCategory === 'all' ? 'All Questions' : `${faqCategories[activeCategory].name} Questions`}
              </h2>
              <p className="text-gray-600">
                {filteredFaqs.length} question{filteredFaqs.length !== 1 ? 's' : ''} found
              </p>
            </div>
            
            {filteredFaqs.length > 0 ? (
              <div className="space-y-4">
                {filteredFaqs.map(faq => (
                  <div key={faq.id} className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium text-gray-900">{faq.question}</span>
                      {expandedFaq === faq.id ? (
                        <FiChevronUp className="w-5 h-5 text-gray-500" />
                      ) : (
                        <FiChevronDown className="w-5 h-5 text-gray-500" />
                      )}
                    </button>
                    
                    {expandedFaq === faq.id && (
                      <div className="px-6 pb-4">
                        <p className="text-gray-600">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FiSearch className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Questions Found</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm 
                    ? `No questions found matching "${searchTerm}". Try different keywords.`
                    : `No questions found in the ${faqCategories[activeCategory].name.toLowerCase()} category.`
                  }
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setActiveCategory('all');
                  }}
                  className="btn btn-outline"
                >
                  View All Questions
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Still Need Help */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Still Need Help?</h2>
            <p className="text-lg text-gray-600 mb-8">
              Can't find the answer you're looking for? Our support team is here to help!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/contact" className="btn btn-primary px-8 py-3 text-lg">
                Contact Support
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

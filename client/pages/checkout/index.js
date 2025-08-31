import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { useThemeStore } from '../../utils/store';
import { ordersAPI } from '../../utils/api';
import { useCartStore } from '../../utils/store';
import { FiLock, FiCreditCard, FiShield, FiCheckCircle, FiShoppingCart } from 'react-icons/fi';
import toast from 'react-hot-toast';

import PaymentForm from '../../components/PaymentForm';

export default function Checkout() {
  const router = useRouter();
  const { theme } = useThemeStore();
  const { items, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('billing'); // billing, payment, confirmation
  const [mounted, setMounted] = useState(false);
  
  // Ensure cart store is initialized
  if (!items) {
    return (
      <div className={`min-h-screen transition-colors duration-200 ${theme === 'dark' ? 'dark' : ''}`}>
        <Layout>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-white">Loading cart...</p>
            </div>
          </div>
        </Layout>
      </div>
    );
  }
  
  const [billingInfo, setBillingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  const [order, setOrder] = useState(null);

  // Ensure component is mounted on client side
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render until mounted to avoid SSR issues
  if (!mounted) {
    return (
      <div className={`min-h-screen transition-colors duration-200 ${theme === 'dark' ? 'dark' : ''}`}>
        <Layout>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-white">Loading checkout...</p>
            </div>
          </div>
        </Layout>
      </div>
    );
  }

  const subtotal = items?.reduce((sum, item) => sum + item.courseId.price, 0) || 0;
  const tax = 0; // No tax for this example
  const total = subtotal + tax;

  const handleBillingChange = (field, value) => {
    setBillingInfo(prev => ({ ...prev, [field]: value }));
  };

  const handlePaymentChange = (field, value) => {
    setPaymentInfo(prev => ({ ...prev, [field]: value }));
  };

  const validateBillingInfo = () => {
    const required = ['firstName', 'lastName', 'email', 'address', 'city', 'state', 'zipCode'];
    for (const field of required) {
      if (!billingInfo[field].trim()) {
        toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(billingInfo.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    
    return true;
  };

  const validatePaymentInfo = () => {
    const required = ['cardNumber', 'expiryDate', 'cvv', 'cardholderName'];
    for (const field of required) {
      if (!paymentInfo[field].trim()) {
        toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }
    
    if (!/^\d{16}$/.test(paymentInfo.cardNumber.replace(/\s/g, ''))) {
      toast.error('Please enter a valid 16-digit card number');
      return false;
    }
    
    if (!/^\d{3,4}$/.test(paymentInfo.cvv)) {
      toast.error('Please enter a valid CVV');
      return false;
    }
    
    return true;
  };

  const handleBillingSubmit = (e) => {
    e.preventDefault();
    if (validateBillingInfo()) {
      setStep('payment');
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!validatePaymentInfo()) return;
    
    try {
      setLoading(true);
      
      const orderData = {
        courses: items.map(item => ({
          course: item.courseId._id,
          price: item.courseId.price
        })),
        billingInfo,
        paymentInfo,
        totalAmount: total
      };
      
      const response = await ordersAPI.create(orderData);
      setOrder(response.data.order);
      setStep('confirmation');
      clearCart();
      toast.success('Order placed successfully!');
      
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error(error.response?.data?.message || 'Error placing order');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToBilling = () => {
    setStep('billing');
  };

  const handleBackToPayment = () => {
    setStep('payment');
  };

  if (items.length === 0) {
    return (
      <div className={`min-h-screen transition-colors duration-200 ${theme === 'dark' ? 'dark' : ''}`}>
        <Layout>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
            <div className="text-center">
              <FiShoppingCart className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Your cart is empty</h2>
              <p className="text-gray-600 dark:text-white mb-6">
                Add some courses to your cart before proceeding to checkout.
              </p>
              <button
                onClick={() => router.push('/courses')}
                className="btn btn-primary"
              >
                Browse Courses
              </button>
            </div>
          </div>
        </Layout>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 ${theme === 'dark' ? 'dark' : ''}`}>
      <Layout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Checkout</h1>
              <p className="text-gray-600 dark:text-white">
                Complete your purchase and start learning
              </p>
            </div>

            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-center">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                    step === 'billing' || step === 'payment' || step === 'confirmation'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`}>
                    1
                  </div>
                  <div className={`w-16 h-1 ${
                    step === 'payment' || step === 'confirmation'
                      ? 'bg-primary-600'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}></div>
                </div>
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                    step === 'payment' || step === 'confirmation'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`}>
                    2
                  </div>
                  <div className={`w-16 h-1 ${
                    step === 'confirmation'
                      ? 'bg-primary-600'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}></div>
                </div>
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                    step === 'confirmation'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`}>
                    3
                  </div>
                </div>
              </div>
              <div className="flex justify-center mt-2 text-sm text-gray-600 dark:text-gray-300">
                <span className="mr-8">Billing</span>
                <span className="mr-8">Payment</span>
                <span>Confirmation</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {/* Billing Information */}
                {step === 'billing' && (
                  <div className="card">
                    <div className="p-6">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Billing Information</h2>
                      
                      <form onSubmit={handleBillingSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                              First Name *
                            </label>
                            <input
                              type="text"
                              value={billingInfo.firstName}
                              onChange={(e) => handleBillingChange('firstName', e.target.value)}
                              className="input w-full"
                              required
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                              Last Name *
                            </label>
                            <input
                              type="text"
                              value={billingInfo.lastName}
                              onChange={(e) => handleBillingChange('lastName', e.target.value)}
                              className="input w-full"
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                              Email *
                            </label>
                            <input
                              type="email"
                              value={billingInfo.email}
                              onChange={(e) => handleBillingChange('email', e.target.value)}
                              className="input w-full"
                              required
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                              Phone
                            </label>
                            <input
                              type="tel"
                              value={billingInfo.phone}
                              onChange={(e) => handleBillingChange('phone', e.target.value)}
                              className="input w-full"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                            Address *
                          </label>
                          <input
                            type="text"
                            value={billingInfo.address}
                            onChange={(e) => handleBillingChange('address', e.target.value)}
                            className="input w-full"
                            required
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                              City *
                            </label>
                            <input
                              type="text"
                              value={billingInfo.city}
                              onChange={(e) => handleBillingChange('city', e.target.value)}
                              className="input w-full"
                              required
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                              State *
                            </label>
                            <input
                              type="text"
                              value={billingInfo.state}
                              onChange={(e) => handleBillingChange('state', e.target.value)}
                              className="input w-full"
                              required
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                              ZIP Code *
                            </label>
                            <input
                              type="text"
                              value={billingInfo.zipCode}
                              onChange={(e) => handleBillingChange('zipCode', e.target.value)}
                              className="input w-full"
                              required
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                            Country
                          </label>
                          <select
                            value={billingInfo.country}
                            onChange={(e) => handleBillingChange('country', e.target.value)}
                            className="input w-full"
                          >
                            <option value="United States">United States</option>
                            <option value="Canada">Canada</option>
                            <option value="United Kingdom">United Kingdom</option>
                            <option value="Australia">Australia</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        
                        <div className="pt-4">
                          <button type="submit" className="btn btn-primary w-full">
                            Continue to Payment
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {/* Payment Information */}
                {step === 'payment' && (
                  <div className="card">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Payment Information</h2>
                        <button
                          onClick={handleBackToBilling}
                          className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm"
                        >
                          ← Back to Billing
                        </button>
                      </div>
                      
                      <PaymentForm
                        paymentInfo={paymentInfo}
                        onPaymentChange={handlePaymentChange}
                        onSubmit={handlePaymentSubmit}
                        loading={loading}
                      />
                    </div>
                  </div>
                )}

                {/* Order Confirmation */}
                {step === 'confirmation' && order && (
                  <div className="card">
                    <div className="p-6 text-center">
                      <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FiCheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                      </div>
                      
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Order Confirmed!
                      </h2>
                      
                      <p className="text-gray-600 dark:text-white mb-6">
                        Thank you for your purchase. Your order has been successfully placed.
                      </p>
                      
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Order ID: <span className="font-mono text-gray-900 dark:text-white">{order._id}</span>
                        </p>
                      </div>
                      
                      <div className="space-y-3">
                        <button
                          onClick={() => router.push('/my-courses')}
                          className="btn btn-primary w-full"
                        >
                          Start Learning
                        </button>
                        
                        <button
                          onClick={() => router.push('/courses')}
                          className="btn btn-outline w-full"
                        >
                          Browse More Courses
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar - Order Summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-8">
                  <div className="card">
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h3>
                      
                      <div className="space-y-3 mb-4">
                        {items.map((item, index) => (
                          <div key={index} className="flex items-center space-x-3">
                            <img
                              src={item.courseId.thumbnail || '/placeholder-course.jpg'}
                              alt={item.courseId.title}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {item.courseId.title}
                              </h4>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {item.courseId.instructor?.name || 'Unknown Instructor'}
                              </p>
                            </div>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              ${item.courseId.price}
                            </span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-300">Subtotal</span>
                          <span className="text-gray-900 dark:text-white">${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-300">Tax</span>
                          <span className="text-gray-900 dark:text-white">${tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-semibold border-t border-gray-200 dark:border-gray-700 pt-2">
                          <span className="text-gray-900 dark:text-white">Total</span>
                          <span className="text-primary-600 dark:text-primary-400">${total.toFixed(2)}</span>
                        </div>
                      </div>
                      
                      {/* Security Badges */}
                      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                          <div className="flex items-center space-x-1">
                            <FiLock className="w-4 h-4" />
                            <span>Secure</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <FiShield className="w-4 h-4" />
                            <span>Protected</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <FiCreditCard className="w-4 h-4" />
                            <span>Encrypted</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { ordersAPI } from '../../utils/api';
import { useCartStore } from '../../utils/store';
import { FiLock, FiCreditCard, FiShield, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

import PaymentForm from '../../components/PaymentForm';

export default function Checkout() {
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('billing'); // billing, payment, confirmation
  const [mounted, setMounted] = useState(false);
  
  // Ensure cart store is initialized
  if (!items) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading cart...</p>
          </div>
        </div>
      </Layout>
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
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading checkout...</p>
          </div>
        </div>
      </Layout>
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
    
    if (paymentInfo.cardNumber.replace(/\s/g, '').length < 13) {
      toast.error('Please enter a valid card number');
      return false;
    }
    
    if (paymentInfo.cvv.length < 3) {
      toast.error('Please enter a valid CVV');
      return false;
    }
    
    return true;
  };

  const handleBillingSubmit = async (e) => {
    e.preventDefault();
    if (!validateBillingInfo()) return;

    try {
      setLoading(true);
      
      // Create order first - send courseIds instead of cartItems
      const orderData = {
        courseIds: items.map(item => item.courseId._id), // Extract course IDs
        paymentMethod: 'pending'
      };
      
      console.log('Creating order with data:', orderData);
      
      const orderResponse = await ordersAPI.create(orderData);
      console.log('Order created successfully:', orderResponse.data);
      
      const createdOrder = orderResponse.data.order;
      setOrder(createdOrder);
      setStep('payment');
      
      toast.success('Order created successfully! Proceed to payment.');
      
    } catch (error) {
      console.error('Error creating order:', error);
      console.error('Error response:', error.response?.data);
      toast.error(error.response?.data?.message || 'Error creating order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Payment is now handled by PaymentForm component

  const handleBackToBilling = () => {
    setStep('billing');
  };

  const handleContinueShopping = () => {
    router.push('/courses');
  };

  const handleViewOrders = () => {
    router.push('/my-orders');
  };

  if (!items || items.length === 0) {
    if (step !== 'confirmation') {
      router.push('/cart');
      return null;
    }
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your purchase securely</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 ${
              step === 'billing' || step === 'payment' || step === 'confirmation' ? 'text-primary-600' : 'text-gray-400'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === 'billing' || step === 'payment' || step === 'confirmation' ? 'bg-primary-600 text-white' : 'bg-gray-200'
              }`}>
                1
              </div>
              <span className="text-sm font-medium">Billing</span>
            </div>
            
            <div className="w-16 h-0.5 bg-gray-200"></div>
            
            <div className={`flex items-center space-x-2 ${
              step === 'payment' || step === 'confirmation' ? 'text-primary-600' : 'text-gray-400'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === 'payment' || step === 'confirmation' ? 'bg-primary-600 text-white' : 'bg-gray-200'
              }`}>
                2
              </div>
              <span className="text-sm font-medium">Payment</span>
            </div>
            
            <div className="w-16 h-0.5 bg-gray-200"></div>
            
            <div className={`flex items-center space-x-2 ${
              step === 'confirmation' ? 'text-primary-600' : 'text-gray-400'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === 'confirmation' ? 'bg-primary-600 text-white' : 'bg-gray-200'
              }`}>
                3
              </div>
              <span className="text-sm font-medium">Confirmation</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Billing Information */}
            {step === 'billing' && (
              <div className="card">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Billing Information</h2>
                  <p className="text-gray-600 mt-1">Please provide your billing details</p>
                </div>
                
                <form onSubmit={handleBillingSubmit} className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                      <input
                        type="text"
                        value={billingInfo.firstName}
                        onChange={(e) => handleBillingChange('firstName', e.target.value)}
                        className="input"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                      <input
                        type="text"
                        value={billingInfo.lastName}
                        onChange={(e) => handleBillingChange('lastName', e.target.value)}
                        className="input"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                      <input
                        type="email"
                        value={billingInfo.email}
                        onChange={(e) => handleBillingChange('email', e.target.value)}
                        className="input"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        value={billingInfo.phone}
                        onChange={(e) => handleBillingChange('phone', e.target.value)}
                        className="input"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                    <input
                      type="text"
                      value={billingInfo.address}
                      onChange={(e) => handleBillingChange('address', e.target.value)}
                      className="input"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                      <input
                        type="text"
                        value={billingInfo.city}
                        onChange={(e) => handleBillingChange('city', e.target.value)}
                        className="input"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                      <input
                        type="text"
                        value={billingInfo.state}
                        onChange={(e) => handleBillingChange('state', e.target.value)}
                        className="input"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code *</label>
                      <input
                        type="text"
                        value={billingInfo.zipCode}
                        onChange={(e) => handleBillingChange('zipCode', e.target.value)}
                        className="input"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                    <select
                      value={billingInfo.country}
                      onChange={(e) => handleBillingChange('country', e.target.value)}
                      className="input"
                    >
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Australia">Australia</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  <button type="submit" className="w-full btn btn-primary py-3 text-lg">
                    Continue to Payment
                  </button>
                </form>
              </div>
            )}

            {/* Payment Information */}
            {step === 'payment' && (
              <div className="card">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Payment Information</h2>
                      <p className="text-gray-600 mt-1">Complete your purchase securely</p>
                    </div>
                    <button
                      onClick={handleBackToBilling}
                      className="text-sm text-primary-600 hover:text-primary-700"
                    >
                      Back to Billing
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <PaymentForm 
                    order={order}
                    onPaymentSuccess={(result) => {
                      setStep('confirmation');
                      clearCart();
                      toast.success('Payment processed successfully! Redirecting to My Courses...');
                      // Redirect to My Courses after a short delay
                      setTimeout(() => {
                        router.push('/my-courses');
                      }, 2000);
                    }}
                    onPaymentFailure={(error) => {
                      toast.error(error.error || 'Payment failed');
                    }}
                  />
                </div>
              </div>
            )}

            {/* Order Confirmation */}
            {step === 'confirmation' && (
              <div className="card text-center">
                <div className="p-12">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FiCheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Thank You for Your Purchase!</h2>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Your order has been successfully processed. You will receive a confirmation email shortly.
                  </p>
                  
                  {order && (
                    <div className="bg-gray-50 rounded-lg p-6 mb-8 max-w-md mx-auto">
                      <h3 className="font-semibold text-gray-900 mb-3">Order Details</h3>
                      <div className="text-sm text-gray-600 space-y-2">
                        <div className="flex justify-between">
                          <span>Order ID:</span>
                          <span className="font-medium">{order._id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Amount:</span>
                          <span className="font-medium">${order.totalAmount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Status:</span>
                          <span className="font-medium text-green-600">{order.status}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => router.push('/my-courses')}
                      className="btn btn-primary px-8 py-3"
                    >
                      Go to My Courses
                    </button>
                    <button
                      onClick={handleViewOrders}
                      className="btn btn-outline px-8 py-3"
                    >
                      View My Orders
                    </button>
                    <button
                      onClick={handleContinueShopping}
                      className="btn btn-outline px-8 py-3"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Order Summary</h2>
              
              {/* Course Items */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.courseId._id} className="flex items-start space-x-3">
                    <img
                      src={item.courseId.thumbnail || 'https://via.placeholder.com/60x40?text=Course'}
                      alt={item.courseId.title}
                      className="w-15 h-10 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                        {item.courseId.title}
                      </h3>
                      <p className="text-sm text-gray-600">${item.courseId.price}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Price Breakdown */}
              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 border-t border-gray-200 pt-3">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              
              {/* Security Badges */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <FiShield className="w-4 h-4" />
                    <span>Secure</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FiLock className="w-4 h-4" />
                    <span>Encrypted</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FiCreditCard className="w-4 h-4" />
                    <span>Protected</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

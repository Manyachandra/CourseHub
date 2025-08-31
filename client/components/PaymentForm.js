import React, { useState } from 'react';
import { paymentAPI } from '../utils/api';
import { useCartStore } from '../utils/store';
import toast from 'react-hot-toast';

export default function PaymentForm({ order, onPaymentSuccess, onPaymentFailure }) {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const { clearCart } = useCartStore();
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: '💳',
      description: 'Pay with Visa, Mastercard, American Express, or Discover'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: '🔵',
      description: 'Pay with your PayPal account'
    },
    {
      id: 'bank_transfer',
      name: 'Bank Transfer',
      icon: '🏦',
      description: 'Direct bank transfer (2-3 business days)'
    }
  ];

  const handleCardInputChange = (field, value) => {
    setCardDetails(prev => ({ ...prev, [field]: value }));
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const validateForm = () => {
    if (paymentMethod === 'card') {
      if (!cardDetails.number || cardDetails.number.replace(/\s/g, '').length < 16) {
        toast.error('Please enter a valid card number');
        return false;
      }
      if (!cardDetails.expiry || cardDetails.expiry.length < 5) {
        toast.error('Please enter a valid expiry date');
        return false;
      }
      if (!cardDetails.cvv || cardDetails.cvv.length < 3) {
        toast.error('Please enter a valid CVV');
        return false;
      }
      if (!cardDetails.name.trim()) {
        toast.error('Please enter the cardholder name');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      const paymentData = {
        orderId: order._id,
        paymentMethod,
        paymentDetails: paymentMethod === 'card' ? cardDetails : {}
      };

      console.log('Processing payment:', paymentData);

      const response = await paymentAPI.process(paymentData);

      if (response.data.message === 'Payment processed successfully') {
        // Clear cart after successful payment
        clearCart();
        console.log('Cart cleared after successful payment');
        
        toast.success('Payment processed successfully!');
        onPaymentSuccess && onPaymentSuccess(response.data);
      } else {
        toast.error(response.data.error || 'Payment failed');
        onPaymentFailure && onPaymentFailure(response.data);
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment processing failed. Please try again.');
      onPaymentFailure && onPaymentFailure({ error: 'Network error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Payment Details</h3>
          <div className="flex items-center text-sm text-gray-500">
            <span className="mr-1">🔒</span>
            Secure Payment
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-gray-900 mb-2">Order Summary</h4>
          <div className="space-y-1 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Total Amount:</span>
              <span className="font-semibold text-gray-900">
                ${order?.totalAmount ? order.totalAmount.toFixed(2) : '0.00'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Order ID:</span>
              <span className="font-mono text-xs">
                #{order?._id ? order._id.slice(-8) : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select Payment Method
          </label>
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <label
                key={method.id}
                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                  paymentMethod === method.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.id}
                  checked={paymentMethod === method.id}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="sr-only"
                />
                <span className={`text-2xl mr-3 ${
                  paymentMethod === method.id ? 'text-primary-600' : 'text-gray-400'
                }`}>
                  {method.icon}
                </span>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{method.name}</div>
                  <div className="text-sm text-gray-500">{method.description}</div>
                </div>
                {paymentMethod === method.id && (
                  <span className="text-primary-600 text-xl">✓</span>
                )}
              </label>
            ))}
          </div>
        </div>

        {/* Card Details Form */}
        {paymentMethod === 'card' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Card Number
              </label>
              <input
                type="text"
                value={cardDetails.number}
                onChange={(e) => handleCardInputChange('number', formatCardNumber(e.target.value))}
                placeholder="1234 5678 9012 3456"
                maxLength="19"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date
                </label>
                <input
                  type="text"
                  value={cardDetails.expiry}
                  onChange={(e) => handleCardInputChange('expiry', formatExpiry(e.target.value))}
                  placeholder="MM/YY"
                  maxLength="5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CVV
                </label>
                <input
                  type="text"
                  value={cardDetails.cvv}
                  onChange={(e) => handleCardInputChange('cvv', e.target.value.replace(/\D/g, ''))}
                  placeholder="123"
                  maxLength="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cardholder Name
              </label>
              <input
                type="text"
                value={cardDetails.name}
                onChange={(e) => handleCardInputChange('name', e.target.value)}
                placeholder="John Doe"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white py-3 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing Payment...
                </div>
              ) : (
                `Pay $${order?.totalAmount ? order.totalAmount.toFixed(2) : '0.00'}`
              )}
            </button>
          </form>
        )}

        {/* PayPal/Bank Transfer Info */}
        {paymentMethod !== 'card' && (
          <div className="text-center py-6">
            <div className="text-gray-500 mb-4">
              {paymentMethod === 'paypal' ? (
                <div>
                  <div className="w-12 h-12 mx-auto mb-2 text-blue-500 text-4xl">🔵</div>
                  <p>You will be redirected to PayPal to complete your payment.</p>
                </div>
              ) : (
                <div>
                  <div className="w-12 h-12 mx-auto mb-2 text-green-500 text-4xl">🏦</div>
                  <p>Bank transfer details will be provided after order confirmation.</p>
                </div>
              )}
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-primary-600 text-white py-3 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Processing...' : `Continue with ${paymentMethod === 'paypal' ? 'PayPal' : 'Bank Transfer'}`}
            </button>
          </div>
        )}

        {/* Security Notice */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>🔒 This is a test payment system. No real charges will be made.</p>
          <p>Your payment information is secure and encrypted.</p>
        </div>
      </div>
    </div>
  );
}

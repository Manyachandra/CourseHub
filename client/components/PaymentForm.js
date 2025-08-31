import React, { useState } from 'react';
import { paymentAPI } from '../utils/api';
import { useCartStore, useThemeStore } from '../utils/store';
import toast from 'react-hot-toast';

export default function PaymentForm({ paymentInfo, onPaymentChange, onSubmit, loading }) {
  const { theme } = useThemeStore();
  const [paymentMethod, setPaymentMethod] = useState('card');
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
    if (onPaymentChange) {
      onPaymentChange(field, value);
    }
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

    if (onSubmit) {
      onSubmit(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Payment Method Selection */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Select Payment Method</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              type="button"
              onClick={() => setPaymentMethod(method.id)}
              className={`p-4 border rounded-lg text-left transition-all duration-200 ${
                paymentMethod === method.id
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 ring-2 ring-primary-500/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{method.icon}</span>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">{method.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{method.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Payment Form */}
      {paymentMethod === 'card' && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Card Details</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
              Card Number
            </label>
            <input
              type="text"
              value={cardDetails.number}
              onChange={(e) => handleCardInputChange('number', formatCardNumber(e.target.value))}
              placeholder="1234 5678 9012 3456"
              className="input w-full"
              maxLength="19"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                Expiry Date
              </label>
              <input
                type="text"
                value={cardDetails.expiry}
                onChange={(e) => handleCardInputChange('expiry', formatExpiry(e.target.value))}
                placeholder="MM/YY"
                className="input w-full"
                maxLength="5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                CVV
              </label>
              <input
                type="text"
                value={cardDetails.cvv}
                onChange={(e) => handleCardInputChange('cvv', e.target.value.replace(/\D/g, ''))}
                placeholder="123"
                className="input w-full"
                maxLength="4"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
              Cardholder Name
            </label>
            <input
              type="text"
              value={cardDetails.name}
              onChange={(e) => handleCardInputChange('name', e.target.value)}
              placeholder="John Doe"
              className="input w-full"
            />
          </div>
        </div>
      )}

      {paymentMethod === 'paypal' && (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🔵</div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">PayPal Payment</h3>
          <p className="text-gray-600 dark:text-gray-300">
            You will be redirected to PayPal to complete your payment securely.
          </p>
        </div>
      )}

      {paymentMethod === 'bank_transfer' && (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🏦</div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Bank Transfer</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Complete your order and we'll send you bank transfer details via email.
          </p>
        </div>
      )}

      {/* Security Notice */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <svg className="w-5 h-5 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white">Secure Payment</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Your payment information is encrypted and secure. We never store your card details.
            </p>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        onClick={handleSubmit}
        disabled={loading}
        className="w-full btn btn-primary py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Processing Payment...</span>
          </div>
        ) : (
          `Complete Payment`
        )}
      </button>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { paymentAPI } from '../utils/api';
import { FiCreditCard, FiPaypal, FiBank, FiCheckCircle, FiXCircle, FiRefreshCw } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';

export default function TestPayment() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      const response = await paymentAPI.getMethods();
      setPaymentMethods(response.data.paymentMethods);
    } catch (error) {
      console.error('Failed to fetch payment methods:', error);
    }
  };

  const runTestPayment = async (method) => {
    setLoading(true);
    
    try {
      const response = await paymentAPI.test({
        amount: Math.floor(Math.random() * 100) + 10,
        currency: 'USD',
        paymentMethod: method,
        testMode: true
      });

      const result = response.data;
      
      const testResult = {
        id: Date.now(),
        method,
        success: result.success,
        timestamp: new Date().toLocaleTimeString(),
        details: result
      };

      setTestResults(prev => [testResult, ...prev]);
      
      if (result.success) {
        toast.success(`${method.toUpperCase()} test payment successful!`);
      } else {
        toast.error(`${method.toUpperCase()} test payment failed`);
      }

    } catch (error) {
      console.error('Test payment error:', error);
      toast.error('Test payment failed');
      
      const testResult = {
        id: Date.now(),
        method,
        success: false,
        timestamp: new Date().toLocaleTimeString(),
        details: { error: 'Network error' }
      };
      
      setTestResults(prev => [testResult, ...prev]);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const getMethodIcon = (method) => {
    switch (method) {
      case 'card': return FiCreditCard;
      case 'paypal': return FiPaypal;
      case 'bank_transfer': return FiBank;
      default: return FiCreditCard;
    }
  };

  const getMethodColor = (method) => {
    switch (method) {
      case 'card': return 'text-blue-600';
      case 'paypal': return 'text-blue-500';
      case 'bank_transfer': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              🧪 Payment System Testing
            </h1>
            <p className="text-gray-600">
              Test the dummy payment system with different payment methods
            </p>
          </div>

          {/* Payment Methods */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {paymentMethods.map((method) => {
              const Icon = getMethodIcon(method.id);
              return (
                <div
                  key={method.id}
                  className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
                >
                  <div className="text-center">
                    <Icon className={`w-12 h-12 mx-auto mb-3 ${getMethodColor(method.id)}`} />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {method.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {method.description}
                    </p>
                    <button
                      onClick={() => runTestPayment(method.id)}
                      disabled={loading}
                      className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {loading ? 'Testing...' : 'Test Payment'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Test Results */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Test Results
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={fetchPaymentMethods}
                  className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <FiRefreshCw className="w-4 h-4 mr-1" />
                  Refresh
                </button>
                <button
                  onClick={clearResults}
                  className="px-3 py-2 text-sm text-red-600 hover:text-red-700 transition-colors"
                >
                  Clear Results
                </button>
              </div>
            </div>

            {testResults.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FiCreditCard className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>No test results yet. Run a test payment to see results here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {testResults.map((result) => (
                  <div
                    key={result.id}
                    className={`border rounded-lg p-4 ${
                      result.success
                        ? 'border-green-200 bg-green-50'
                        : 'border-red-200 bg-red-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {result.success ? (
                          <FiCheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <FiXCircle className="w-5 h-5 text-red-600" />
                        )}
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900">
                              {result.method.toUpperCase()}
                            </span>
                            <span className={`text-sm px-2 py-1 rounded-full ${
                              result.success
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {result.success ? 'SUCCESS' : 'FAILED'}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500">
                            {result.timestamp}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">
                          Payment ID: {result.details.paymentId || 'N/A'}
                        </div>
                        {result.details.transactionId && (
                          <div className="text-sm text-gray-600">
                            Txn: {result.details.transactionId}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {result.details.error && (
                      <div className="mt-2 text-sm text-red-600">
                        Error: {result.details.error}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* API Endpoints Info */}
          <div className="bg-white rounded-lg shadow-md p-6 mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Available API Endpoints
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded">POST /api/payments/process</span>
                  <span className="text-gray-600 ml-2">Process payment</span>
                </div>
                <div className="text-sm">
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded">GET /api/payments/status/:orderId</span>
                  <span className="text-gray-600 ml-2">Get payment status</span>
                </div>
                <div className="text-sm">
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded">POST /api/payments/refund/:orderId</span>
                  <span className="text-gray-600 ml-2">Refund payment</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded">GET /api/payments/methods</span>
                  <span className="text-gray-600 ml-2">Get payment methods</span>
                </div>
                <div className="text-sm">
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded">POST /api/payments/test</span>
                  <span className="text-gray-600 ml-2">Test payment (dev)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-white rounded-lg shadow-md p-6 mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              🚀 Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <FiCheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  Mock payment processing
                </div>
                <div className="flex items-center text-sm">
                  <FiCheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  Multiple payment methods
                </div>
                <div className="flex items-center text-sm">
                  <FiCheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  Realistic processing delays
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <FiCheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  95% success rate simulation
                </div>
                <div className="flex items-center text-sm">
                  <FiCheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  Refund processing
                </div>
                <div className="flex items-center text-sm">
                  <FiCheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  Order status updates
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

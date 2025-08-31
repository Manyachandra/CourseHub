import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { paymentAPI } from '../utils/api';
import { useThemeStore } from '../utils/store';
import toast from 'react-hot-toast';

export default function TestPayment() {
  const router = useRouter();
  const { theme } = useThemeStore();
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
      case 'card': 
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        );
      case 'paypal': 
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      case 'bank_transfer': 
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      default: 
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        );
    }
  };

  const getStatusIcon = (success) => {
    if (success) {
      return (
        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      );
    } else {
      return (
        <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      );
    }
  };

  const getStatusColor = (success) => {
    return success ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
  };

  const getStatusBgColor = (success) => {
    return success ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900';
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${theme === 'dark' ? 'dark' : ''}`}>
      
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Payment Gateway Testing</h1>
              <p className="text-gray-600 dark:text-gray-300">
                Test different payment methods and verify gateway integration
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Payment Methods */}
              <div className="space-y-6">
                <div className="card">
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Available Payment Methods</h2>
                    
                    {paymentMethods.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
                        <p className="text-gray-600 dark:text-gray-300">Loading payment methods...</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {paymentMethods.map((method) => (
                          <button
                            key={method.id}
                            onClick={() => runTestPayment(method.type)}
                            disabled={loading}
                            className="w-full flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="text-gray-600 dark:text-gray-400">
                                {getMethodIcon(method.type)}
                              </div>
                              <div className="text-left">
                                <p className="font-medium text-gray-900 dark:text-white capitalize">
                                  {method.type.replace('_', ' ')}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {method.description || 'Test payment method'}
                                </p>
                              </div>
                            </div>
                            
                            {loading ? (
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
                            ) : (
                              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Test Configuration */}
                <div className="card">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Test Configuration</h3>
                    <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                      <div className="flex justify-between">
                        <span>Environment:</span>
                        <span className="font-medium text-green-600 dark:text-green-400">Test Mode</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Currency:</span>
                        <span className="font-medium">USD</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Amount Range:</span>
                        <span className="font-medium">$10 - $100</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Auto-generated:</span>
                        <span className="font-medium text-blue-600 dark:text-blue-400">Yes</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Test Results */}
              <div className="space-y-6">
                <div className="card">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Test Results</h2>
                      {testResults.length > 0 && (
                        <button
                          onClick={clearResults}
                          className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                        >
                          Clear All
                        </button>
                      )}
                    </div>
                    
                    {testResults.length === 0 ? (
                      <div className="text-center py-8">
                        <svg className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-gray-600 dark:text-gray-300">No test results yet</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Run a test payment to see results here</p>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {testResults.map((result) => (
                          <div
                            key={result.id}
                            className={`p-4 rounded-lg border ${getStatusBgColor(result.success)} border-gray-200 dark:border-gray-700`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                {getStatusIcon(result.success)}
                                <span className={`font-medium capitalize ${getStatusColor(result.success)}`}>
                                  {result.method.replace('_', ' ')}
                                </span>
                              </div>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {result.timestamp}
                              </span>
                            </div>
                            
                            <div className="text-sm">
                              <p className="text-gray-700 dark:text-gray-300 mb-1">
                                Status: <span className={getStatusColor(result.success)}>
                                  {result.success ? 'Success' : 'Failed'}
                                </span>
                              </p>
                              
                              {result.details.error && (
                                <p className="text-red-600 dark:text-red-400 text-xs">
                                  Error: {result.details.error}
                                </p>
                              )}
                              
                              {result.details.transactionId && (
                                <p className="text-gray-600 dark:text-gray-400 text-xs">
                                  Transaction ID: {result.details.transactionId}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Test Statistics */}
                {testResults.length > 0 && (
                  <div className="card">
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Test Statistics</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {testResults.filter(r => r.success).length}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Successful</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                            {testResults.filter(r => !r.success).length}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Failed</p>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="text-center">
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            {testResults.length > 0 ? Math.round((testResults.filter(r => r.success).length / testResults.length) * 100) : 0}%
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Success Rate</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Info */}
            <div className="mt-12 text-center">
              <div className="inline-flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>This is a test environment. No real payments will be processed.</span>
              </div>
            </div>
          </div>
        </div>
      
    </div>
  );
}

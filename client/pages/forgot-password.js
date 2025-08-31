import { useState } from 'react';
import Link from 'next/link';
import { useThemeStore } from '../utils/store';
import { FiMail, FiCheckCircle, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const { theme } = useThemeStore();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      // In a real app, this would send a password reset email
      // For now, we'll simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmitted(true);
      toast.success('Password reset link sent to your email!');
    } catch (error) {
      toast.error('Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className={`min-h-screen transition-colors duration-200 ${theme === 'dark' ? 'dark' : ''}`}>
        
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12">
            <div className="max-w-md w-full text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiCheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Check Your Email</h2>
              <p className="text-gray-600 dark:text-white mb-6">
                We've sent a password reset link to <strong>{email}</strong>. 
                Please check your email and click the link to reset your password.
              </p>
              <div className="space-y-4">
                <button
                  onClick={() => setSubmitted(false)}
                  className="btn btn-outline w-full"
                >
                  Send Another Link
                </button>
                <Link href="/login" className="btn btn-primary w-full">
                  Back to Login
                </Link>
              </div>
            </div>
          </div>
        
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 ${theme === 'dark' ? 'dark' : ''}`}>
      
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            {/* Header */}
            <div className="text-center">
              <div className="mx-auto h-12 w-12 bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">Forgot Password?</h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-white">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>

            {/* Form */}
            <div className="card">
              <form className="p-8 space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="input pl-10 w-full"
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary w-full py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </div>
              </form>
            </div>

            {/* Back to Login */}
            <div className="text-center">
              <Link 
                href="/login" 
                className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors duration-200"
              >
                <FiArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </Link>
            </div>

            {/* Help Text */}
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Remember your password?{' '}
                <Link href="/login" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      
    </div>
  );
}

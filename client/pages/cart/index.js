import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCartStore, useUserStore } from '../../utils/store';
import { useThemeStore } from '../../utils/store';
import toast from 'react-hot-toast';
import Pagination from '../../components/Pagination';

export default function Cart() {
  const router = useRouter();
  const { items: cartItems = [], removeFromCart, updateQuantity, clearCart, syncCart } = useCartStore();
  const { theme } = useThemeStore();
  const { user, isAuthenticated } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Ensure cartItems is always an array to prevent SSR errors
  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];

  // Check authentication and redirect if not logged in
  useEffect(() => {
    if (typeof window !== 'undefined' && !isAuthenticated()) {
      router.push('/login');
      return;
    }
  }, [isAuthenticated, router]);

  // Sync cart with backend on component mount (only if authenticated)
  useEffect(() => {
    if (isAuthenticated()) {
      syncCart();
    }
  }, [syncCart, isAuthenticated]);

  // Debug cart data
  useEffect(() => {
    console.log('Cart items updated:', safeCartItems);
    if (safeCartItems.length > 0) {
      console.log('First cart item structure:', safeCartItems[0]);
      console.log('First cart item course:', safeCartItems[0]?.courseId);
    }
  }, [safeCartItems]);

  // Show loading while checking authentication
  if (typeof window !== 'undefined' && !isAuthenticated()) {
    return (
      <div className={`min-h-screen transition-colors duration-200 ${theme === 'dark' ? 'dark' : ''}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show loading while syncing cart
  if (loading) {
    return (
      <div className={`min-h-screen transition-colors duration-200 ${theme === 'dark' ? 'dark' : ''}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading your cart...</p>
        </div>
      </div>
    );
  }

  // Pagination logic
  const itemsPerPage = 12;
  const totalPages = Math.ceil(safeCartItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCartItems = safeCartItems.slice(startIndex, endIndex);

  const calculateTotal = () => {
    console.log('Cart items for total calculation:', safeCartItems);
    return safeCartItems.reduce((total, item) => {
      const price = item.courseId?.price || 0;
      const quantity = 1; // Backend doesn't store quantity, always 1
      console.log(`Item: ${item.courseId?.title}, Price: ${price}, Quantity: ${quantity}`);
      return total + (price * quantity);
    }, 0);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await removeFromCart(itemId);
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Error removing item from cart');
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
      toast.success('Cart cleared');
    } catch (error) {
      toast.error('Error clearing cart');
    }
  };

  const handleCheckout = () => {
    if (safeCartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    router.push('/checkout');
  };

  if (safeCartItems.length === 0) {
    return (
      <div className={`min-h-screen transition-colors duration-200 ${theme === 'dark' ? 'dark' : ''}`}>
        <Head>
          <title>Shopping Cart - CourseHub</title>
          <meta name="description" content="Your shopping cart on CourseHub" />
        </Head>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="text-gray-400 dark:text-gray-500 mb-8">
            <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Your cart is empty
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Looks like you haven't added any courses to your cart yet.
          </p>
          
          <Link
            href="/courses"
            className="btn-primary px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-200"
          >
            Browse Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 ${theme === 'dark' ? 'dark' : ''}`}>
      <Head>
        <title>Shopping Cart - CourseHub</title>
        <meta name="description" content="Your shopping cart on CourseHub" />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Shopping Cart
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {safeCartItems.length} {safeCartItems.length === 1 ? 'course' : 'courses'} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Cart Items
                  </h2>
                  <button
                    onClick={handleClearCart}
                    className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors duration-200"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>

              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {currentCartItems.map((item) => (
                  <div key={item.courseId._id} className="p-6">
                    <div className="flex items-start space-x-4">
                      {/* Course Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={item.courseId.thumbnail || '/placeholder-course.jpg'}
                          alt={item.courseId.title}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                      </div>

                      {/* Course Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {item.courseId.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                          {item.courseId.category} • {item.courseId.level}
                        </p>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                          {item.courseId.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            {/* Quantity Controls */}
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                Quantity: 1
                              </span>
                            </div>

                                              {/* Price */}
                  <div className="text-lg font-semibold text-primary-600 dark:text-primary-400">
                    ${((item.courseId?.price || 0) * 1).toFixed(2)}
                  </div>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => handleRemoveItem(item.courseId._id)}
                            className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-700 transition-colors duration-200"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {safeCartItems.length > 0 && (
                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    totalItems={safeCartItems.length}
                    itemsPerPage={itemsPerPage}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card sticky top-8">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Order Summary
                </h2>
              </div>

              <div className="p-6 space-y-4">
                {/* Subtotal */}
                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>Subtotal ({safeCartItems.length} {safeCartItems.length === 1 ? 'course' : 'courses'})</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>

                {/* Tax */}
                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>Tax</span>
                  <span>$0.00</span>
                </div>

                {/* Total */}
                <div className="flex justify-between text-lg font-semibold text-gray-900 dark:text-white pt-4 border-t border-gray-200 dark:border-gray-700">
                  <span>Total</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  disabled={loading || safeCartItems.length === 0}
                  className="btn-primary w-full py-3 text-lg font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : 'Proceed to Checkout'}
                </button>

                {/* Continue Shopping */}
                <Link
                  href="/courses"
                  className="btn-outline w-full py-3 text-center block transition-all duration-200"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

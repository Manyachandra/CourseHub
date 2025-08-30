import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { cartAPI } from '../../utils/api';
import { useCartStore } from '../../utils/store';
import { FiTrash2, FiShoppingCart, FiArrowRight, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function Cart() {
  const router = useRouter();
  const { items, setItems, setTotal, removeItem, clearCart } = useCartStore();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartAPI.get();
      setItems(response.data.cart);
      
      const totalResponse = await cartAPI.getTotal();
      setTotal(totalResponse.data.total);
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Error loading cart');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (courseId) => {
    try {
      setUpdating(true);
      await cartAPI.remove(courseId);
      removeItem(courseId);
      
      // Recalculate total
      const totalResponse = await cartAPI.getTotal();
      setTotal(totalResponse.data.total);
      
      toast.success('Course removed from cart');
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Error removing course from cart');
    } finally {
      setUpdating(false);
    }
  };

  const handleClearCart = async () => {
    try {
      setUpdating(true);
      await cartAPI.clear();
      clearCart();
      toast.success('Cart cleared successfully');
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Error clearing cart');
    } finally {
      setUpdating(false);
    }
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    router.push('/checkout');
  };

  const handleContinueShopping = () => {
    router.push('/courses');
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-8"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="card p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-24 h-24 bg-gray-300 rounded"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                      <div className="h-6 bg-gray-300 rounded w-20"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
          <p className="text-gray-600">
            {items.length === 0 ? 'Your cart is empty' : `${items.length} course${items.length !== 1 ? 's' : ''} in your cart`}
          </p>
        </div>

        {items.length === 0 ? (
          /* Empty Cart */
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiShoppingCart className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added any courses to your cart yet. Start exploring our course catalog!
            </p>
            <button
              onClick={handleContinueShopping}
              className="btn btn-primary px-8 py-3 text-lg"
            >
              Browse Courses
            </button>
          </div>
        ) : (
          /* Cart Items */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items List */}
            <div className="lg:col-span-2">
              <div className="card">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Cart Items</h2>
                    <button
                      onClick={handleClearCart}
                      disabled={updating}
                      className="text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
                    >
                      {updating ? 'Clearing...' : 'Clear Cart'}
                    </button>
                  </div>
                </div>

                <div className="divide-y divide-gray-200">
                  {items.map((item) => (
                    <div key={item.courseId._id} className="p-6">
                      <div className="flex items-start space-x-4">
                        {/* Course Image */}
                        <div className="flex-shrink-0">
                          <img
                            src={item.courseId.thumbnail || 'https://via.placeholder.com/120x80?text=Course'}
                            alt={item.courseId.title}
                            className="w-24 h-20 object-cover rounded-lg"
                          />
                        </div>

                        {/* Course Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-lg font-medium text-gray-900 mb-1">
                                {item.courseId.title}
                              </h3>
                              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                {item.courseId.shortDescription}
                              </p>
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span className="flex items-center space-x-1">
                                  <FiShoppingCart className="w-4 h-4" />
                                  <span>Added {new Date(item.addedAt).toLocaleDateString()}</span>
                                </span>
                              </div>
                            </div>

                            {/* Price and Actions */}
                            <div className="flex flex-col items-end space-y-3">
                              <div className="text-right">
                                <div className="text-2xl font-bold text-primary-600">
                                  ${item.courseId.price}
                                </div>
                                {item.courseId.originalPrice && item.courseId.originalPrice > item.courseId.price && (
                                  <div className="text-sm text-gray-500 line-through">
                                    ${item.courseId.originalPrice}
                                  </div>
                                )}
                              </div>

                              <button
                                onClick={() => handleRemoveItem(item.courseId._id)}
                                disabled={updating}
                                className="text-red-600 hover:text-red-700 disabled:opacity-50 p-2 rounded-lg hover:bg-red-50 transition-colors"
                                title="Remove from cart"
                              >
                                <FiTrash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Order Summary</h2>

                {/* Summary Details */}
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal ({items.length} course{items.length !== 1 ? 's' : ''})</span>
                    <span className="font-medium">
                      ${items.reduce((sum, item) => sum + item.courseId.price, 0).toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">$0.00</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total</span>
                    <span className="text-lg font-bold text-primary-600">
                      ${items.reduce((sum, item) => sum + item.courseId.price, 0).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  disabled={updating || items.length === 0}
                  className="w-full btn btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Proceed to Checkout</span>
                  <FiArrowRight className="w-5 h-5 ml-2" />
                </button>

                {/* Continue Shopping */}
                <button
                  onClick={handleContinueShopping}
                  className="w-full btn btn-outline mt-3 py-3"
                >
                  Continue Shopping
                </button>

                {/* Additional Info */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="font-medium text-gray-900 mb-3">What's included:</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center space-x-2">
                      <FiX className="w-4 h-4 text-green-500" />
                      <span>Full lifetime access</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <FiX className="w-4 h-4 text-green-500" />
                      <span>Access on mobile and TV</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <FiX className="w-4 h-4 text-green-500" />
                      <span>Certificate of completion</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <FiX className="w-4 h-4 text-green-500" />
                      <span>30-day money-back guarantee</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

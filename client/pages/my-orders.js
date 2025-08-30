import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../components/Layout';
import { useUserStore } from '../utils/store';
import { ordersAPI } from '../utils/api';
import { FiPackage, FiCalendar, FiDollarSign, FiCheckCircle, FiClock, FiXCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function MyOrders() {
  const router = useRouter();
  const { user } = useUserStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    fetchOrders();
  }, [user, router]);

  const fetchOrders = async () => {
    try {
      const response = await ordersAPI.getUserOrders();
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'processing':
        return 'text-blue-600 bg-blue-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <FiCheckCircle className="w-4 h-4" />;
      case 'pending':
        return <FiClock className="w-4 h-4" />;
      case 'processing':
        return <FiClock className="w-4 h-4" />;
      case 'cancelled':
        return <FiXCircle className="w-4 h-4" />;
      default:
        return <FiPackage className="w-4 h-4" />;
    }
  };

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading orders...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-1/3 mb-8"></div>
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="card">
                    <div className="p-6">
                      <div className="h-4 bg-gray-300 rounded mb-2"></div>
                      <div className="h-3 bg-gray-300 rounded mb-4"></div>
                      <div className="h-6 bg-gray-300 rounded w-20"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">My Orders</h1>
            <p className="text-xl text-gray-600 mb-6">
              Track your course purchases and order history
            </p>
            {orders.length > 0 && (
              <div className="flex justify-center">
                <Link 
                  href="/my-courses" 
                  className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                >
                  🎓 Start Learning
                </Link>
              </div>
            )}
          </div>

          {/* Quick Access Section */}
          {orders.length > 0 && (
            <div className="mb-8">
              <div className="bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-200 rounded-lg p-6">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div className="text-center md:text-left mb-4 md:mb-0">
                    <h3 className="text-lg font-semibold text-primary-900 mb-2">Ready to Learn?</h3>
                    <p className="text-primary-700">
                      Access all your purchased courses and continue your learning journey
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link 
                      href="/my-courses" 
                      className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                    >
                      🎓 Go to My Courses
                    </Link>
                    <Link 
                      href="/courses" 
                      className="inline-flex items-center px-6 py-3 border border-primary-600 text-primary-600 font-medium rounded-lg hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                    >
                      🔍 Browse More Courses
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {orders.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiPackage className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Orders Yet</h3>
              <p className="text-gray-600 mb-6">
                You haven't purchased any courses yet. Start learning today!
              </p>
              <Link href="/courses" className="btn btn-primary">
                Browse Courses
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map(order => (
                <div key={order._id} className="card">
                  <div className="p-6">
                    {/* Order Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Order #{order._id.slice(-8).toUpperCase()}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Placed on {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="mt-2 sm:mt-0">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="ml-2 capitalize">{order.status}</span>
                        </span>
                      </div>
                    </div>

                    {/* Order Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <FiCalendar className="w-4 h-4 mr-2" />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <FiDollarSign className="w-4 h-4 mr-2" />
                        Total: ${order.totalAmount}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <FiPackage className="w-4 h-4 mr-2" />
                        {order.courses?.length || 0} course(s)
                      </div>
                    </div>

                    {/* Course List */}
                    <div className="border-t border-gray-200 pt-4">
                      <h4 className="font-medium text-gray-900 mb-3">Courses in this order:</h4>
                      <div className="space-y-3">
                        {order.courses?.map(course => (
                          <div key={course._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mr-3">
                                {course.thumbnail ? (
                                  <img 
                                    src={course.thumbnail} 
                                    alt={course.title}
                                    className="w-12 h-12 rounded-lg object-cover"
                                  />
                                ) : (
                                  <FiPackage className="w-6 h-6 text-gray-400" />
                                )}
                              </div>
                              <div>
                                <h5 className="font-medium text-gray-900">{course.title}</h5>
                                <p className="text-sm text-gray-500">{course.instructor?.name || 'Unknown Instructor'}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium text-gray-900">${course.price}</div>
                              <Link 
                                href={`/courses/${course._id}`}
                                className="text-sm text-primary-600 hover:text-primary-700"
                              >
                                View Course
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Actions */}
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={() => setSelectedOrder(selectedOrder === order._id ? null : order._id)}
                          className="btn btn-outline text-sm"
                        >
                          {selectedOrder === order._id ? 'Hide Details' : 'View Details'}
                        </button>
                        {order.status === 'completed' && (
                          <Link 
                            href="/my-courses"
                            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                          >
                            🎓 Start Learning
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* Expanded Order Details */}
                    {selectedOrder === order._id && (
                      <div className="border-t border-gray-200 pt-4 mt-4">
                        <h4 className="font-medium text-gray-900 mb-3">Order Details:</h4>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Order ID:</span>
                            <span className="font-mono">{order._id}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Payment Method:</span>
                            <span className="capitalize">{order.paymentMethod || 'Not specified'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Payment Status:</span>
                            <span className="capitalize">{order.paymentStatus || 'Not specified'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Billing Address:</span>
                            <span>{order.billingAddress ? `${order.billingAddress.street}, ${order.billingAddress.city}` : 'Not provided'}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

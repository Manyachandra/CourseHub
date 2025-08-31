import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useUserStore, useCartStore, useThemeStore } from '../utils/store';
import ThemeToggle from './ThemeToggle';

export default function Layout({ children }) {
  const router = useRouter();
  const { user, logout } = useUserStore();
  const { cartItems = [], clearCart } = useCartStore();
  const { theme, setTheme } = useThemeStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Initialize theme on component mount
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme-storage');
      if (savedTheme) {
        try {
          const { state } = JSON.parse(savedTheme);
          if (state.theme) {
            setTheme(state.theme);
          }
        } catch (error) {
          console.error('Error parsing theme storage:', error);
        }
      }
    }
  }, [setTheme]);

  const handleLogout = async () => {
    try {
      await logout();
      clearCart();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isActive = (path) => router.pathname === path;

  // Ensure cartItems is always an array to prevent SSR errors
  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];

  return (
    <div className={`min-h-screen transition-colors duration-200 ${theme === 'dark' ? 'dark' : ''}`}>
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">CourseHub</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link 
                href="/courses" 
                className={`nav-link ${isActive('/courses') ? 'active' : ''}`}
              >
                Courses
              </Link>
              <Link 
                href="/categories" 
                className={`nav-link ${isActive('/categories') ? 'active' : ''}`}
              >
                Categories
              </Link>
              {user && (
                <Link 
                  href="/my-courses" 
                  className={`nav-link ${isActive('/my-courses') ? 'active' : ''}`}
                >
                  My Courses
                </Link>
              )}
              {user && user.role === 'admin' && (
                <Link 
                  href="/test-payment" 
                  className="nav-link"
                >
                  🧪 Test Payment
                </Link>
              )}
            </nav>

            {/* Right side items */}
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <ThemeToggle />
              
              {/* Cart */}
              <Link href="/cart" className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m6 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
                {safeCartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {safeCartItems.length}
                  </span>
                )}
              </Link>

              {/* User Menu */}
              {user ? (
                <div className="relative group">
                  <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {user?.name?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                    <span className="hidden sm:block text-gray-700 dark:text-gray-300">{user?.name}</span>
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-2">
                      <Link href="/profile" className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                        Profile
                      </Link>
                      <Link href="/my-orders" className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                        My Orders
                      </Link>
                      {user?.role === 'admin' && (
                        <Link href="/admin-dashboard" className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                          Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link href="/login" className="btn btn-outline dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:border-gray-500">
                    Login
                  </Link>
                  <Link href="/register" className="btn btn-primary">
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 transition-colors duration-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link 
                href="/courses" 
                className={`block px-3 py-2 rounded-md text-base font-medium nav-link ${isActive('/courses') ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Courses
              </Link>
              <Link 
                href="/categories" 
                className={`block px-3 py-2 rounded-md text-base font-medium nav-link ${isActive('/categories') ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Categories
              </Link>
              {user && (
                <>
                  <Link 
                    href="/my-courses" 
                    className="block px-3 py-2 rounded-md text-base font-medium nav-link"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Courses
                  </Link>
                  <Link 
                    href="/profile" 
                    className="block px-3 py-2 rounded-md text-base font-medium nav-link"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link 
                    href="/my-orders" 
                    className="block px-3 py-2 rounded-md text-base font-medium nav-link"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                  {user.role === 'admin' && (
                    <>
                      <Link 
                        href="/admin-dashboard" 
                        className="block px-3 py-2 rounded-md text-base font-medium nav-link"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                      <Link 
                        href="/test-payment" 
                        className="block px-3 py-2 rounded-md text-base font-medium nav-link"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        🧪 Test Payment
                      </Link>
                    </>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors duration-200"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        {children}
      </main>

      {/* Footer */}
      <footer className="footer transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">C</span>
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white">CourseHub</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Your gateway to knowledge and skill development through high-quality online courses.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase mb-4">
                Quick Links
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/courses" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200">
                    Browse Courses
                  </Link>
                </li>
                <li>
                  <Link href="/categories" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200">
                    Categories
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200">
                    About Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase mb-4">
                Support
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/help" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-600 dark:text-gray-300 text-sm">
                © 2024 CourseHub. All rights reserved.
              </div>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <Link href="/privacy" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 text-sm transition-colors duration-200">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 text-sm transition-colors duration-200">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

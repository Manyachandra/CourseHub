import { useEffect, useCallback } from 'react';
import { Toaster } from 'react-hot-toast';
import { useUserStore, useThemeStore } from '../utils/store';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const { checkAuth, setLoading } = useUserStore();
  const { theme, setTheme } = useThemeStore();

  const initializeAuth = useCallback(async () => {
    try {
      setLoading(true);
      await checkAuth();
    } catch (error) {
      console.error('Auth initialization error:', error);
    } finally {
      setLoading(false);
    }
  }, [checkAuth, setLoading]);

  // Initialize theme on app load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check for saved theme preference or default to light
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
      } else {
        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDark ? 'dark' : 'light');
      }
    }
  }, [setTheme]);

  useEffect(() => {
    // Check if user is authenticated on app load
    initializeAuth();
  }, [initializeAuth]);

  return (
    <>
      <Component {...pageProps} />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: theme === 'dark' ? '#1f2937' : '#363636',
            color: '#fff',
          },
        }}
      />
    </>
  );
}

export default MyApp;

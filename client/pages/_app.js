import { useEffect, useCallback } from 'react';
import { Toaster } from 'react-hot-toast';
import { useUserStore } from '../utils/store';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const { checkAuth, setLoading } = useUserStore();

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
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </>
  );
}

export default MyApp;

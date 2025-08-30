import { useEffect, useCallback } from 'react';
import { Toaster } from 'react-hot-toast';
import { useUserStore } from '../utils/store';
import { authAPI } from '../utils/api';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const { setUser, setLoading } = useUserStore();

  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      const response = await authAPI.getCurrentUser();
      setUser(response.data.user);
    } catch (error) {
      // User is not authenticated
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Check if user is authenticated on app load
    checkAuth();
  }, [checkAuth]);

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

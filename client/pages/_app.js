import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useUserStore, useThemeStore } from '../utils/store';
import Layout from '../components/Layout';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  const { checkAuth } = useUserStore();
  const { theme, setTheme } = useThemeStore();

  useEffect(() => {
    // Initialize authentication
    checkAuth();

    // Initialize theme
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
      } else {
        // Check system preference if no saved theme
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(systemPrefersDark ? 'dark' : 'light');
      }
    }
  }, [checkAuth, setTheme]);

  useEffect(() => {
    // Apply theme to document
    if (typeof window !== 'undefined') {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
  }, [theme]);

  return (
    <Layout>
      <Component {...pageProps} />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: theme === 'dark' ? '#1f2937' : '#ffffff',
            color: theme === 'dark' ? '#ffffff' : '#1f2937',
            border: theme === 'dark' ? '1px solid #374151' : '1px solid #e5e7eb',
          },
        }}
      />
    </Layout>
  );
}

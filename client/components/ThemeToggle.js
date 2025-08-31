import { FiSun, FiMoon } from 'react-icons/fi';
import { useThemeStore } from '../utils/store';

export default function ThemeToggle() {
  const { theme, toggleTheme, isDark } = useThemeStore();

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 text-gray-600 hover:text-primary-600 transition-all duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-300 dark:hover:text-primary-400"
      aria-label={`Switch to ${isDark() ? 'light' : 'dark'} mode`}
    >
      <div className="relative w-5 h-5">
        {/* Sun Icon */}
        <FiSun 
          className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
            isDark() 
              ? 'opacity-0 rotate-90 scale-75' 
              : 'opacity-100 rotate-0 scale-100'
          }`}
        />
        {/* Moon Icon */}
        <FiMoon 
          className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
            isDark() 
              ? 'opacity-100 rotate-0 scale-100' 
              : 'opacity-0 -rotate-90 scale-75'
          }`}
        />
      </div>
    </button>
  );
}

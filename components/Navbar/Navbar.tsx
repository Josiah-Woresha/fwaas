// Navbar.tsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';
import { ThemeProvider } from '../ThemeContext/ThemeContext'; // Import the ThemeProvider

export default function Navbar({ isLoggedIn }: { isLoggedIn: boolean }) {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme(); // Use the theme context

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={() => router.back()}
              className="text-gray-600 dark:text-gray-100 hover:text-gray-900 dark:hover:text-gray-300 mr-4"
              title="Go Back"
            >
              <FaArrowLeft className="w-6 h-6" />
            </button>
            <Link href="/" className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Your App Name
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="bg-gray-200 dark:bg-gray-700 p-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              {theme === 'light' ? '🌞' : '🌙'}
            </button>
            {isLoggedIn && (
              <Link href="/integration" className="text-gray-600 dark:text-gray-100 hover:text-gray-900 dark:hover:text-gray-300">
                Integration Guide
              </Link>
            )}
            {/* Add other navbar links here */}
          </div>
        </div>
      </div>
    </nav>
  );
}
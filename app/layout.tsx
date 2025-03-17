import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import Logo from '../components/Logo';
import FeedbackWidget from '../components/FeedbackWidget/FeedbackWidget'; // Import the Client Component
import { ThemeProvider } from '../components/ThemeContext/ThemeContext'; // Import the ThemeProvider

// Define metadata
export const metadata: Metadata = {
  title: 'Get Your Feedback | GYF',
  description: 'A production-ready Get Your Feedback App to fetch user feedback for your project.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        {/* Embed the feedback widget script */}
        <FeedbackWidget />
      </head>
      <body className="bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
        {/* Wrap the app with ThemeProvider */}
        <ThemeProvider>
          <Logo /> {/* Logo component is now at the top of the page */}
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import Logo from '../components/Logo';
import FeedbackWidget from '../components/FeedbackWidget/FeedbackWidget'; // Import the Client Component

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
      <body className="bg-gray-50 text-gray-900">
        <div className="pt-5"> {/* Add padding-top to the container */}
          <Logo />
        </div>
        {children}
      </body>
    </html>
  );
}
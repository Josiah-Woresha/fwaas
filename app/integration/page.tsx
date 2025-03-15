'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter

export default function IntegrationPage() {
  const [copied, setCopied] = useState(false);
  const router = useRouter(); // Initialize the router

  const codeSnippet = `
  'use client';

  import Script from 'next/script';

  // Declare the FeedbackWidget object globally
  declare global {
    interface Window {
      FeedbackWidget: {
        init: (config: {
          websiteId: string;
          position: string;
          color: string;
        }) => void;
      };
    }
  }

  export default function FeedbackWidget() {
    return (
      <Script
        src="https://get-your-feedback.vercel.app/widget.js"
        strategy="afterInteractive"
        onLoad={() => {
          // Initialize the feedback widget after the script has loaded
          if (typeof window.FeedbackWidget !== 'undefined') {
            window.FeedbackWidget.init({
              websiteId: 'YOUR_WORKSPACE_ID', // Replace with your workspace ID
              position: 'bottom-right', // Position of the widget
              color: '#3498db', // Widget color
            });
          } else {
            console.error('FeedbackWidget is not defined.');
          }
        }}
      />
    );
  }
  `;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Arrow */}
        <button
          onClick={() => router.back()} // Navigate back to the previous page
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-6">GYF Widget Integration Guide</h1>

        {/* Step 1: Add the Script */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Step 1: Add the Script</h2>
          <p className="text-gray-600 mb-4">
            To embed the GYF widget, add the following code to your Next.js app. Create a new file called <code>FeedbackWidget.tsx</code> in your <code>components</code> folder.
          </p>
          <div className="bg-gray-100 p-4 rounded-lg relative">
            <pre className="overflow-x-auto text-sm text-gray-800">
              <code>{codeSnippet}</code>
            </pre>
            <button
              onClick={handleCopyCode}
              className="absolute top-2 right-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
            >
              {copied ? 'Copied!' : 'Copy Code'}
            </button>
          </div>
        </section>

        {/* Step 2: Embed the Widget */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Step 2: Embed the Widget</h2>
          <p className="text-gray-600 mb-4">
            Add the <code>FeedbackWidget</code> component to your app’s layout so it appears on every page.
          </p>
          <div className="bg-gray-100 p-4 rounded-lg">
            <pre className="overflow-x-auto text-sm text-gray-800">
              <code>
                {`
                import FeedbackWidget from '../components/FeedbackWidget';

                export default function RootLayout({
                  children,
                }: {
                  children: React.ReactNode;
                }) {
                  return (
                    <html lang="en">
                      <head>
                        <FeedbackWidget />
                      </head>
                      <body>
                        {children}
                      </body>
                    </html>
                  );
                }
                `}
              </code>
            </pre>
          </div>
        </section>

        {/* Step 3: Customize the Widget */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Step 3: Customize the Widget</h2>
          <p className="text-gray-600 mb-4">
            You can customize the widget by modifying the <code>FeedbackWidget.init</code> configuration.
          </p>
          <div className="bg-gray-100 p-4 rounded-lg">
            <pre className="overflow-x-auto text-sm text-gray-800">
              <code>
                {`
                window.FeedbackWidget.init({
                  websiteId: 'YOUR_WORKSPACE_ID', // Replace with your workspace ID
                  position: 'bottom-right', // Change the position
                  color: '#3498db', // Change the color
                });
                `}
              </code>
            </pre>
          </div>
        </section>

        {/* Step 4: Test the Widget */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Step 4: Test the Widget</h2>
          <p className="text-gray-600 mb-4">
            Run your app and verify that the widget appears and functions correctly.
          </p>
        </section>

        {/* Step 5: Deploy Your App */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Step 5: Deploy Your App</h2>
          <p className="text-gray-600 mb-4">
            Once the widget is working locally, deploy your app to your hosting platform (e.g., Vercel, Netlify).
          </p>
        </section>
      </div>
    </div>
  );
}
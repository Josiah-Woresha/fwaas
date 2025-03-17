'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '../../components/ThemeContext/ThemeContext'; // Import the ThemeProvider

export default function IntegrationPage() {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'nextjs' | 'react' | 'vue' | 'angular' | 'reactnative'>('nextjs'); // Narrowed type
  const router = useRouter();
  const { theme } = useTheme(); // Use the theme context

  // Code snippets for each technology
  const codeSnippets = {
    nextjs: `
      'use client';

      import Script from 'next/script';

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
              if (typeof window.FeedbackWidget !== 'undefined') {
                window.FeedbackWidget.init({
                  websiteId: 'YOUR_WORKSPACE_ID',
                  position: 'bottom-right',
                  color: '#3498db',
                });
              } else {
                console.error('FeedbackWidget is not defined.');
              }
            }}
          />
        );
      }
    `,
    react: `
      import React, { useEffect } from 'react';

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

      const FeedbackWidget = () => {
        useEffect(() => {
          const script = document.createElement('script');
          script.src = 'https://get-your-feedback.vercel.app/widget.js';
          script.async = true;
          script.onload = () => {
            window.FeedbackWidget.init({
              websiteId: 'YOUR_WORKSPACE_ID',
              position: 'bottom-right',
              color: '#3498db',
            });
          };
          document.body.appendChild(script);

          return () => {
            document.body.removeChild(script);
          };
        }, []);

        return null;
      };

      export default FeedbackWidget;
    `,
    vue: `
      <template>
        <div></div>
      </template>

      <script>
      export default {
        mounted() {
          const script = document.createElement('script');
          script.src = 'https://get-your-feedback.vercel.app/widget.js';
          script.async = true;
          script.onload = () => {
            window.FeedbackWidget.init({
              websiteId: 'YOUR_WORKSPACE_ID',
              position: 'bottom-right',
              color: '#3498db',
            });
          };
          document.body.appendChild(script);
        },
      };
      </script>
    `,
    angular: `
      import { Component, OnInit } from '@angular/core';

      @Component({
        selector: 'app-feedback-widget',
        template: '<div></div>',
      })
      export class FeedbackWidgetComponent implements OnInit {
        ngOnInit() {
          const script = document.createElement('script');
          script.src = 'https://get-your-feedback.vercel.app/widget.js';
          script.async = true;
          script.onload = () => {
            window.FeedbackWidget.init({
              websiteId: 'YOUR_WORKSPACE_ID',
              position: 'bottom-right',
              color: '#3498db',
            });
          };
          document.body.appendChild(script);
        }
      }
    `,
    reactnative: `
      import React, { useEffect } from 'react';
      import { WebView } from 'react-native-webview';

      const FeedbackWidget = () => {
        return (
          <WebView
            source={{ uri: 'https://get-your-feedback.vercel.app/widget.js' }}
            onLoadEnd={() => {
              window.FeedbackWidget.init({
                websiteId: 'YOUR_WORKSPACE_ID',
                position: 'bottom-right',
                color: '#3498db',
              });
            }}
          />
        );
      };

      export default FeedbackWidget;
    `,
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-4xl mx-auto">
        {/* Back Arrow */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 dark:text-gray-100 hover:text-gray-900 dark:hover:text-gray-300 mb-6"
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

        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">GYF Widget Integration Guide</h1>

        {/* Technology Tabs */}
        <div className="flex space-x-4 mb-6 overflow-x-auto">
          {(['nextjs', 'react', 'vue', 'angular', 'reactnative'] as const).map((tech) => (
            <button
              key={tech}
              onClick={() => setActiveTab(tech)}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                activeTab === tech
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {tech === 'nextjs' && 'Next.js'}
              {tech === 'react' && 'React'}
              {tech === 'vue' && 'Vue'}
              {tech === 'angular' && 'Angular'}
              {tech === 'reactnative' && 'React Native'}
            </button>
          ))}
        </div>

        {/* Steps for Integration */}
        <div className="space-y-8">
          {/* Step 1: Add the Script */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Step 1: Add the Script</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              To embed the GYF widget, add the following code to your {activeTab === 'nextjs' ? 'Next.js' : activeTab} app.
            </p>
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg relative">
              <pre className="overflow-x-auto text-sm text-gray-800 dark:text-gray-200">
                <code>{codeSnippets[activeTab]}</code>
              </pre>
              <button
                onClick={() => handleCopyCode(codeSnippets[activeTab])}
                className="absolute top-2 right-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
              >
                {copied ? 'Copied!' : 'Copy Code'}
              </button>
            </div>
          </section>

          {/* Step 2: Embed the Widget */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Step 2: Embed the Widget</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Add the <code>FeedbackWidget</code> component to your app’s layout so it appears on every page.
            </p>
            {activeTab === 'nextjs' && (
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                <pre className="overflow-x-auto text-sm text-gray-800 dark:text-gray-200">
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
            )}
          </section>

          {/* Step 3: Customize the Widget */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Step 3: Customize the Widget</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              You can customize the widget by modifying the <code>FeedbackWidget.init</code> configuration.
            </p>
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
              <pre className="overflow-x-auto text-sm text-gray-800 dark:text-gray-200">
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
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Step 4: Test the Widget</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Run your app and verify that the widget appears and functions correctly.
            </p>
          </section>

          {/* Step 5: Deploy Your App */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Step 5: Deploy Your App</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Once the widget is working locally, deploy your app to your hosting platform (e.g., Vercel, Netlify).
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
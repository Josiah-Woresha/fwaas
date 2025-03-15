'use client'; // Mark this as a Client Component

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
            websiteId: 'e4b77bfe-a4f4-41e6-a468-d5e77c69a9ee', // Replace with a valid workspace ID
            position: 'bottom-right',
            color: '#232526',
          });
        } else {
          console.error('FeedbackWidget is not defined.');
        }
      }}
    />
  );
}
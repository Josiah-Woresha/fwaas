'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

// Navbar Component
function Navbar() {
  const router = useRouter();

  return (
    <nav>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <div className="flex items-center justify-between h-16">
          {/* Empty div to balance the layout (left side) */}
          <div className="invisible">
            <button className="opacity-0">获取您的反馈</button>
          </div>

          {/* Center: Logo */}
          <div className="flex items-center justify-center flex-grow">
            <Image
              src="/logoipsum-291.svg"
              alt="Logo"
              width={72} // Adjust width as needed
              height={40} // Adjust height as needed
              className="cursor-pointer" // Make the logo clickable
              onClick={() => router.push('/auth/loggedin')} // Navigate to logged-in page on logo click
            />
          </div>

          {/* Right: Integration Guide Link */}
          <div className="flex items-center">
            <button
              onClick={() => router.push('/integration')}
              className="px-4 py-2 text-sm sm:text-base font-medium text-white bg-blue-600 
                        hover:bg-blue-700 rounded-lg transition-all duration-200"
            >
              Integration
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default function Logo() {
  return (
    <div className="mt-8"> {/* Increased margin top to mt-8 */}
      <Navbar />
    </div>
  );
}
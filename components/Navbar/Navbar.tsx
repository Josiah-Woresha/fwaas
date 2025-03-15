import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';

export default function Navbar({ isLoggedIn }: { isLoggedIn: boolean }) {
  const router = useRouter();

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-900 mr-4"
              title="Go Back"
            >
              <FaArrowLeft className="w-6 h-6" />
            </button>
            <Link href="/" className="text-lg font-semibold text-gray-900">
              Your App Name
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {isLoggedIn && (
              <Link href="/integration" className="text-gray-600 hover:text-gray-900">
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
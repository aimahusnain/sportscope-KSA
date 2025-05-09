'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function NotFound() {
  const searchParams = useSearchParams();
  const from = searchParams.get('from');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 py-20">
      <h1 className="text-5xl font-bold mb-4">404 – Page Not Found</h1>
      <p className="text-lg mb-6">
        {from
          ? `Looks like the page you're coming from (${from}) doesn't exist.`
          : `Sorry, we couldn't find the page you're looking for.`}
      </p>
      <Link
        href="/"
        className="bg-black text-white px-5 py-3 rounded-lg hover:bg-gray-800 transition"
      >
        Go Back Home
      </Link>
    </div>
  );
}

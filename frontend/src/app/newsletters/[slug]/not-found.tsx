import Link from 'next/link'

export default function NewsletterNotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">📰</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Newsletter Not Found
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          The newsletter you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>
        <div className="space-x-4">
          <Link
            href="/newsletters"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            View All Newsletters
          </Link>
          <Link
            href="/"
            className="inline-block border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Newsletter {
  id: number
  title: string
  slug: string
  excerpt: string
  featured_image?: string
  published_at: string
}

interface NewsletterResponse {
  count: number
  results: Newsletter[]
}

export default function NewslettersPage() {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchNewsletters = async () => {
    try {
      setLoading(true)
      setError('')
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://thehybridprotocol-production.up.railway.app'
      const response = await fetch(`${apiUrl}/api/newsletters/`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch newsletters: ${response.status}`)
      }
      
      const data: NewsletterResponse = await response.json()
      setNewsletters(data.results)
    } catch (err) {
      console.error('Error fetching newsletters:', err)
      setError(err instanceof Error ? err.message : 'Failed to load newsletters')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNewsletters()
  }, [])

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return 'Date unavailable'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-96 mx-auto mb-8"></div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-lg shadow-md p-6">
                    <div className="h-48 bg-gray-300 rounded mb-4"></div>
                    <div className="h-6 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded w-24"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-red-600 text-xl mb-4">⚠️ {error}</div>
            <button
              onClick={fetchNewsletters}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            The Hybrid Protocol Newsletter
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Insights, updates, and deep dives into the intersection of technology, wellness, and human potential.
          </p>
        </div>

        {/* Content */}
        {newsletters.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">
              📰 No newsletters published yet
            </div>
            <p className="text-gray-400">
              Check back soon for our latest insights and updates!
            </p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {newsletters.map((newsletter) => (
              <article key={newsletter.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {/* Featured Image */}
                {newsletter.featured_image && (
                  <div className="relative h-48 w-full">
                    <Image
                      src={newsletter.featured_image}
                      alt={newsletter.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}

                <div className="p-6">
                  {/* Date */}
                  <div className="text-sm text-gray-500 mb-2">
                    {formatDate(newsletter.published_at)}
                  </div>

                  {/* Title */}
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    <Link 
                      href={`/newsletters/${newsletter.slug}`}
                      className="hover:text-blue-600 transition-colors"
                    >
                      {newsletter.title}
                    </Link>
                  </h2>

                  {/* Excerpt */}
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {newsletter.excerpt}
                  </p>

                  {/* Read More Link */}
                  <Link
                    href={`/newsletters/${newsletter.slug}`}
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Read Full Article →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Newsletter Signup CTA */}
        <div className="mt-16 bg-blue-50 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Stay Updated
          </h3>
          <p className="text-gray-600 mb-6">
            Subscribe to receive our latest insights and updates directly in your inbox.
          </p>
          <Link
            href="/#newsletter-signup"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Subscribe to Newsletter
          </Link>
        </div>
      </div>
    </div>
  )
}
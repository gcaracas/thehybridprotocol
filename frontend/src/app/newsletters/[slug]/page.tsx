import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Metadata } from 'next'

interface Newsletter {
  id: number
  title: string
  slug: string
  content: string
  excerpt: string
  featured_image_url?: string
  published_at: string
  created_at: string
  updated_at: string
}

interface NewsletterPageProps {
  params: Promise<{
    slug: string
  }>
}

async function getNewsletter(slug: string): Promise<Newsletter | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://thehybridprotocol-production.up.railway.app'
  
  try {
    console.log(`[SSR] Fetching newsletter with slug: ${slug}`)
    console.log(`[SSR] API URL: ${apiUrl}`)
    
    const response = await fetch(`${apiUrl}/api/newsletters/${slug}/`, {
      next: { revalidate: 60 } // Revalidate every minute
    })
    
    console.log(`[SSR] Response status: ${response.status}`)
    
    if (!response.ok) {
      if (response.status === 404) {
        console.log(`[SSR] Newsletter not found: ${slug}`)
        return null
      }
      throw new Error(`Failed to fetch newsletter: ${response.status}`)
    }
    
    const newsletter = await response.json()
    console.log(`[SSR] Newsletter found: ${newsletter.title}`)
    return newsletter
    
  } catch (error) {
    console.error(`[SSR] Error fetching newsletter:`, error)
    throw error
  }
}

export async function generateMetadata({ params }: NewsletterPageProps): Promise<Metadata> {
  try {
    const { slug } = await params
    const newsletter = await getNewsletter(slug)
    
    if (!newsletter) {
      return {
        title: 'Newsletter Not Found - The Hybrid Protocol',
        description: 'The requested newsletter could not be found.'
      }
    }
    
          return {
        title: `${newsletter.title} - The Hybrid Protocol Newsletter`,
        description: newsletter.excerpt,
        openGraph: {
          title: newsletter.title,
          description: newsletter.excerpt,
          images: newsletter.featured_image_url ? [newsletter.featured_image_url] : undefined,
        },
      }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Newsletter - The Hybrid Protocol',
      description: 'Read the latest insights from The Hybrid Protocol.'
    }
  }
}

export default async function NewsletterPage({ params }: NewsletterPageProps) {
  try {
    const { slug } = await params
    console.log(`[SSR] Newsletter page rendering for slug: ${slug}`)
    
    const newsletter = await getNewsletter(slug)
    
    if (!newsletter) {
      console.log(`[SSR] Newsletter not found, showing 404`)
      notFound()
    }
    
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
    
    const formatContent = (content: string) => {
      // Convert line breaks to paragraphs
      return content.split('\n\n').map((paragraph, index) => (
        <p key={index} className="mb-4 text-gray-700 leading-relaxed">
          {paragraph.trim()}
        </p>
      ))
    }
    
    return (
      <div className="min-h-screen bg-white">
        {/* Navigation */}
        <nav className="bg-white border-b border-gray-200 py-4">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/newsletters"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Back to Newsletters
            </Link>
          </div>
        </nav>

        {/* Article */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <header className="mb-8">
            <div className="text-sm text-gray-500 mb-4">
              {formatDate(newsletter.published_at)}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {newsletter.title}
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              {newsletter.excerpt}
            </p>
          </header>

          {/* Featured Image */}
          {newsletter.featured_image_url && (
            <div className="relative w-full h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
              <Image
                src={newsletter.featured_image_url}
                alt={newsletter.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <div className="text-lg">
              {formatContent(newsletter.content)}
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Published on {formatDate(newsletter.published_at)}
                {newsletter.updated_at !== newsletter.created_at && (
                  <span> • Updated {formatDate(newsletter.updated_at)}</span>
                )}
              </div>
              
              <Link
                href="/newsletters"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                More Newsletters →
              </Link>
            </div>
          </footer>
        </article>

        {/* Newsletter Signup CTA */}
        <section className="bg-gray-50 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Enjoyed this newsletter?
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
        </section>
      </div>
    )
  } catch (error) {
    console.error('Error rendering newsletter page:', error)
    notFound()
  }
}
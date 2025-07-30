'use client';

import { useState, useRef, useEffect } from 'react';

interface NewsletterSignupProps {
  variant?: 'inline' | 'section';
  className?: string;
  id?: string;
}

export default function NewsletterSignup({ 
  variant = 'inline', 
  className = '',
  id
}: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/email-signup/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          source: 'website'
        }),
      });

      if (response.ok) {
        setMessage('Successfully subscribed to newsletter!');
        setIsSuccess(true);
        setEmail('');
        setFirstName('');
        setLastName('');
      } else {
        const errorData = await response.json();
        setMessage(errorData.email?.[0] || 'Something went wrong. Please try again.');
        setIsSuccess(false);
      }
    } catch {
      setMessage('Network error. Please try again.');
      setIsSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (variant === 'section') {
    return (
      <section id={id} className={`py-16 bg-blue-50 ${className}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Stay Updated
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Get the latest insights on health, wellness, and performance delivered to your inbox.
            </p>
          </div>
          
          <div className="mt-8 max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={isSubmitting}
                  className="px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={isSubmitting}
                  className="px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <input
                ref={emailInputRef}
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
            
            {message && (
              <div className={`mt-4 p-4 rounded-md ${
                isSuccess ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                {message}
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  // Inline variant
  return (
    <div className={`bg-white p-6 rounded-lg shadow-md ${className}`}>
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Subscribe to Newsletter
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            disabled={isSubmitting}
            className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            disabled={isSubmitting}
            className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <input
          ref={emailInputRef}
          type="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isSubmitting}
          required
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white px-4 py-2 text-sm rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>
      
      {message && (
        <div className={`mt-3 p-3 text-sm rounded-md ${
          isSuccess ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {message}
        </div>
      )}
    </div>
  );
}
"use client";

import { useState } from "react";
import Image from "next/image";
import { Input, Button, Typography } from "./ui/Typography";
import { 
  EnvelopeIcon, 
  CheckCircleIcon,
  UserIcon,
  SparklesIcon
} from "@heroicons/react/24/solid";

export function NewsletterSignupNew() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://thehybridprotocol-production.up.railway.app';
      const response = await fetch(`${apiUrl}/api/email-signup/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          source: 'homepage_newsletter_signup'
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
        setEmail("");
        setFirstName("");
        setLastName("");
      } else {
        const data = await response.json();
        if (data.email && data.email.includes('already exists')) {
          setError("You're already subscribed! Check your inbox for our latest insights.");
        } else {
          setError("Something went wrong. Please try again.");
        }
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <section className="py-20 bg-white border-t-4 border-protocol-golden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-protocol-sage rounded-2xl p-8 shadow-wellness">
              <div className="w-20 h-20 bg-protocol-golden rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircleIcon className="h-10 w-10 text-white" />
              </div>
              
              <Typography variant="h3" className="text-2xl md:text-3xl font-bold text-protocol-dark-green mb-4">
                Welcome to the Transformation!
              </Typography>
              
              <Typography variant="lead" className="text-gray-700 mb-6">
                Check your inbox for your first weekly insight. You&apos;re about to discover simple shifts that create profound metabolic changes.
              </Typography>

              <div className="bg-white rounded-lg p-4 border-l-4 border-protocol-olive">
                <Typography variant="small" className="text-gray-600">
                  <span className="font-semibold text-protocol-olive">Pro tip:</span> Add us to your contacts to ensure you never miss a breakthrough insight.
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="newsletter-signup" className="py-20 bg-white border-t-4 border-protocol-golden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Side - Content */}
            <div className="space-y-6">
              <div className="space-y-4">
                <Typography 
                  variant="small" 
                  className="text-protocol-olive font-semibold uppercase tracking-wider"
                >
                  Weekly Metabolic Insights
                </Typography>
                
                <Typography 
                  variant="h2" 
                  className="text-3xl md:text-4xl lg:text-5xl font-bold text-protocol-dark-green leading-tight"
                >
                  Start With One{" "}
                  <span className="text-protocol-golden">Simple Shift</span>{" "}
                  Each Week.
                </Typography>
                
                <Typography 
                  variant="lead" 
                  className="text-lg text-gray-700 leading-relaxed"
                >
                  Subscribe for weekly insights on fasting, food, and metabolic healing. Transform your health one evidence-based strategy at a time.
                </Typography>
              </div>

              {/* Benefits */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <SparklesIcon className="h-5 w-5 text-protocol-golden" />
                  <span className="text-gray-700">Science-backed protocols you can implement immediately</span>
                </div>
                <div className="flex items-center gap-3">
                  <SparklesIcon className="h-5 w-5 text-protocol-golden" />
                  <span className="text-gray-700">Real transformation stories from people over 40</span>
                </div>
                <div className="flex items-center gap-3">
                  <SparklesIcon className="h-5 w-5 text-protocol-golden" />
                  <span className="text-gray-700">Weekly metabolic challenges that create lasting change</span>
                </div>
              </div>

              {/* Social Proof */}
              <div className="bg-protocol-sage rounded-lg p-4">
                <Typography variant="small" className="text-gray-600 italic">
                  &quot;These weekly insights have completely changed how I think about food and fasting. I&apos;ve lost 23 pounds and feel 10 years younger!&quot;
                </Typography>
                <Typography variant="small" className="text-protocol-olive font-semibold mt-2">
                  - Sarah M., Age 52
                </Typography>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="relative">
              {/* Background Image */}
              <div className="absolute -top-8 -right-8 w-32 h-32 opacity-10">
                <Image
                  src="https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=200&h=200&fit=crop"
                  alt="Healthy food"
                  fill
                  className="object-cover rounded-full"
                />
              </div>

              <div className="bg-protocol-sage rounded-2xl p-8 shadow-wellness border border-protocol-olive/20 relative z-10">
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Form Header */}
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-protocol-olive rounded-full flex items-center justify-center mx-auto mb-4">
                      <EnvelopeIcon className="h-8 w-8 text-white" />
                    </div>
                    <Typography variant="h4" className="text-protocol-dark-green font-bold">
                      Join 10,000+ Transformers
                    </Typography>
                  </div>

                  {/* Name Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Input
                        type="text"
                        label="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        disabled={isSubmitting}
                        className="!border-protocol-olive/50 focus:!border-protocol-olive"
                        labelProps={{
                          className: "text-gray-600"
                        }}
                        icon={<UserIcon className="h-5 w-5 text-protocol-olive" />}
                      />
                    </div>
                    <div>
                      <Input
                        type="text"
                        label="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        disabled={isSubmitting}
                        className="!border-protocol-olive/50 focus:!border-protocol-olive"
                        labelProps={{
                          className: "text-gray-600"
                        }}
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div>
                    <Input
                      type="email"
                      label="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isSubmitting}
                      className="!border-protocol-olive/50 focus:!border-protocol-olive"
                      labelProps={{
                        className: "text-gray-600"
                      }}
                      icon={<EnvelopeIcon className="h-5 w-5 text-protocol-olive" />}
                    />
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
                      {error}
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting || !email.trim() || !firstName.trim() || !lastName.trim()}
                    className="w-full bg-protocol-olive hover:bg-protocol-olive/90 text-white font-semibold py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Subscribing...
                      </>
                    ) : (
                      "Get Your First Insight →"
                    )}
                  </Button>

                  {/* Privacy Note */}
                  <Typography variant="small" className="text-gray-500 text-center">
                    No spam, ever. Unsubscribe with one click. 
                    Your data is 100% secure.
                  </Typography>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default NewsletterSignupNew;
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { 
  ArrowRight, 
  Star, 
  Users, 
  Trophy, 
  Target,
  PlayCircle,
  CheckCircle,
  Sparkles,
  TrendingUp,
  Shield
} from 'lucide-react'

export function LandingHero() {
  const [isVisible, setIsVisible] = useState(false)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  useEffect(() => {
    setIsVisible(true)
    
    // Rotate testimonials
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "D1 Soccer Recruit",
      quote: "GoRedShirt helped me connect with the perfect coach and get recruited to my dream school!",
      rating: 5
    },
    {
      name: "Coach Mike Torres",
      role: "Elite Performance Coach",
      quote: "This platform transformed my coaching business. I can focus on athletes, not admin work.",
      rating: 5
    },
    {
      name: "David Chen",
      role: "Parent",
      quote: "Finally, a platform that makes recruiting transparent and manageable for families.",
      rating: 5
    }
  ]

  const stats = [
    { label: "Athletes Recruited", value: "1,200+", icon: Trophy },
    { label: "Elite Coaches", value: "500+", icon: Users },
    { label: "Success Rate", value: "94%", icon: Target },
    { label: "Scholarships Won", value: "$12M+", icon: Star }
  ]

  return (
    <div className="relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-900 dark:to-red-900/10"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-500/5 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column - Content */}
          <div className={`space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            
            {/* Beta Badge */}
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
                <Sparkles className="w-3 h-3 mr-1" />
                Now in Beta
              </Badge>
              <span className="text-sm text-muted-foreground">
                Join 500+ early adopters
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold">
                <span className="bg-gradient-to-r from-gray-900 via-red-600 to-red-700 bg-clip-text text-transparent dark:from-white dark:via-red-400 dark:to-red-500">
                  Get Recruited.
                </span>
                <br />
                <span className="text-gray-900 dark:text-white">
                  Get Results.
                </span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed">
                Connect with elite coaches, build your recruiting profile, and get recruited to your dream school. The complete platform for athletic recruitment.
              </p>
            </div>

            {/* Value Propositions */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium">Elite Coach Network</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium">Recruiting Tools</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium">Performance Tracking</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium">Scholarship Support</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register">
                <Button 
                  size="lg" 
                  className="group w-full sm:w-auto bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Start Free Trial
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>

              <Button 
                variant="outline" 
                size="lg"
                className="group w-full sm:w-auto border-red-200 hover:border-red-300 hover:bg-red-50 dark:border-red-800 dark:hover:border-red-700 dark:hover:bg-red-900/20 font-semibold px-8 py-3"
              >
                <PlayCircle className="w-4 h-4 mr-2" />
                Watch Demo
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="pt-4">
              <p className="text-sm text-muted-foreground mb-3">
                Trusted by athletes at top programs
              </p>
              <div className="flex items-center space-x-6 opacity-60">
                <div className="text-xs font-semibold">STANFORD</div>
                <div className="text-xs font-semibold">UCLA</div>
                <div className="text-xs font-semibold">DUKE</div>
                <div className="text-xs font-semibold">UNC</div>
                <div className="text-xs font-semibold">TEXAS</div>
              </div>
            </div>
          </div>

          {/* Right Column - Visual Content */}
          <div className={`space-y-6 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {stats.map((stat, index) => (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-red-100 dark:border-red-900/20">
                  <CardContent className="p-4 text-center">
                    <stat.icon className="w-6 h-6 mx-auto mb-2 text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform" />
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Testimonial Card */}
            <Card className="relative overflow-hidden border-red-100 dark:border-red-900/20 shadow-lg">
              <CardContent className="p-6">
                <div className="absolute top-4 right-4">
                  <div className="flex space-x-1">
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                
                <blockquote className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  "{testimonials[currentTestimonial].quote}"
                </blockquote>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {testimonials[currentTestimonial].name[0]}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {testimonials[currentTestimonial].name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {testimonials[currentTestimonial].role}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feature Highlight */}
            <Card className="border-red-100 dark:border-red-900/20 bg-gradient-to-br from-red-50 to-white dark:from-red-900/10 dark:to-gray-900">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-red-600 rounded-lg">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Verified Coaches Only
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Every coach is background-checked and verified for credentials, ensuring safe and professional interactions.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Progress Indicator */}
            <div className="flex justify-center space-x-2 pt-4">
              {testimonials.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    index === currentTestimonial ? 'bg-red-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Users, 
  Target, 
  TrendingUp, 
  MessageSquare, 
  Calendar,
  Video,
  Award,
  Shield,
  Smartphone,
  BarChart3,
  Search,
  DollarSign,
  ArrowRight,
  Play,
  CheckCircle2
} from 'lucide-react'

export function FeatureShowcase() {
  const [activeFeature, setActiveFeature] = useState(0)

  const features = [
    {
      id: 'matching',
      name: 'Smart Coach Matching',
      description: 'AI-powered matching connects you with the perfect coach based on your sport, goals, and location.',
      icon: Target,
      image: '/api/placeholder/600/400',
      benefits: ['Verified coach profiles', 'Compatibility scoring', 'Instant connections'],
      category: 'athletes'
    },
    {
      id: 'recruiting',
      name: 'Recruiting Profile',
      description: 'Build a comprehensive profile that showcases your skills, stats, and achievements to college scouts.',
      icon: Award,
      image: '/api/placeholder/600/400',
      benefits: ['Professional templates', 'Video highlights', 'Stats tracking'],
      category: 'athletes'
    },
    {
      id: 'communication',
      name: 'Secure Messaging',
      description: 'Connect safely with coaches through our verified, monitored messaging platform.',
      icon: MessageSquare,
      image: '/api/placeholder/600/400',
      benefits: ['End-to-end encryption', 'File sharing', 'Video calls'],
      category: 'both'
    },
    {
      id: 'analytics',
      name: 'Performance Analytics',
      description: 'Track progress with detailed analytics and insights to improve your game.',
      icon: BarChart3,
      image: '/api/placeholder/600/400',
      benefits: ['Progress tracking', 'Goal setting', 'Performance insights'],
      category: 'both'
    },
    {
      id: 'marketplace',
      name: 'Coach Marketplace',
      description: 'Grow your coaching business with tools to attract, manage, and coach athletes.',
      icon: Users,
      image: '/api/placeholder/600/400',
      benefits: ['Client management', 'Payment processing', 'Scheduling tools'],
      category: 'coaches'
    },
    {
      id: 'payments',
      name: 'Secure Payments',
      description: 'Streamlined payment processing with transparent pricing and instant payouts.',
      icon: DollarSign,
      image: '/api/placeholder/600/400',
      benefits: ['Stripe integration', '90-95% revenue share', 'Instant payouts'],
      category: 'coaches'
    }
  ]

  const categories = [
    { id: 'athletes', name: 'For Athletes', icon: Target, color: 'blue' },
    { id: 'coaches', name: 'For Coaches', icon: Users, color: 'green' },
    { id: 'both', name: 'Platform Features', icon: TrendingUp, color: 'red' }
  ]

  const getFilteredFeatures = (category: string) => {
    return features.filter(f => f.category === category || category === 'all')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
      {/* Header */}
      <div className="text-center mb-12">
        <Badge variant="outline" className="mb-4 bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
          Platform Features
        </Badge>
        
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Everything You Need to Succeed
        </h2>
        
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          From smart matching to performance analytics, our platform provides all the tools 
          athletes and coaches need to achieve their goals.
        </p>
      </div>

      {/* Feature Tabs */}
      <Tabs defaultValue="athletes" className="space-y-8">
        <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="flex items-center space-x-2"
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{category.name}</span>
              </TabsTrigger>
            )
          })}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="space-y-8">
            
            {/* Feature Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
              {getFilteredFeatures(category.id).map((feature, index) => {
                const Icon = feature.icon
                return (
                  <Card 
                    key={feature.id}
                    className="group cursor-pointer transition-all duration-300 hover:shadow-lg border-gray-200 dark:border-gray-800 hover:border-red-200 dark:hover:border-red-800"
                    onClick={() => setActiveFeature(index)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                          <Icon className="w-6 h-6 text-red-600 dark:text-red-400" />
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-red-600 group-hover:translate-x-1 transition-all" />
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {feature.name}
                      </h3>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                        {feature.description}
                      </p>

                      <ul className="space-y-2">
                        {feature.benefits.map((benefit, i) => (
                          <li key={i} className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                            <CheckCircle2 className="w-3 h-3 text-green-600 mr-2" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Featured Showcase */}
      <div className="mt-16 bg-gradient-to-r from-gray-50 to-red-50 dark:from-gray-900 dark:to-red-900/10 rounded-2xl p-8 lg:p-12">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          
          {/* Content */}
          <div className="space-y-6">
            <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
              New Feature
            </Badge>
            
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
              AI-Powered Video Analysis
            </h3>
            
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Upload your training videos and get instant feedback from our AI coach. 
              Identify areas for improvement and track your progress over time.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded">
                  <Video className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-sm font-medium">Motion Analysis</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded">
                  <BarChart3 className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-sm font-medium">Performance Metrics</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded">
                  <Target className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-sm font-medium">Technique Tips</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded">
                  <TrendingUp className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                </div>
                <span className="text-sm font-medium">Progress Tracking</span>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                Try It Free
              </Button>
              <Button variant="outline" className="border-red-200 hover:border-red-300 hover:bg-red-50 dark:border-red-800 dark:hover:border-red-700">
                <Play className="w-4 h-4 mr-2" />
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden shadow-2xl">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-sm opacity-75">AI Video Analysis Demo</p>
                </div>
              </div>
              
              {/* Overlay UI Elements */}
              <div className="absolute top-4 left-4">
                <div className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                  ANALYZING...
                </div>
              </div>
              
              <div className="absolute bottom-4 right-4">
                <div className="bg-black/50 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>Score: 87/100</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Cards */}
            <div className="absolute -right-4 top-8 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border max-w-xs">
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="font-medium">Form Analysis Complete</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                3 improvement areas identified
              </p>
            </div>

            <div className="absolute -left-4 bottom-8 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border max-w-xs">
              <div className="flex items-center space-x-2 text-sm">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span className="font-medium">15% Improvement</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Since last session
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Benefits */}
      <div className="mt-16 grid md:grid-cols-3 gap-6">
        <Card className="text-center border-gray-200 dark:border-gray-800">
          <CardContent className="p-6">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-full w-fit mx-auto mb-4">
              <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Safe & Secure
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Background checks, verified profiles, and secure communication keep everyone safe.
            </p>
          </CardContent>
        </Card>

        <Card className="text-center border-gray-200 dark:border-gray-800">
          <CardContent className="p-6">
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-full w-fit mx-auto mb-4">
              <Smartphone className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Mobile First
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Full-featured mobile apps keep you connected and productive on the go.
            </p>
          </CardContent>
        </Card>

        <Card className="text-center border-gray-200 dark:border-gray-800">
          <CardContent className="p-6">
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-full w-fit mx-auto mb-4">
              <Search className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Smart Discovery
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              AI-powered recommendations help you find the perfect matches and opportunities.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
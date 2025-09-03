'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Search, 
  HelpCircle, 
  Book, 
  MessageCircle, 
  Phone, 
  Mail,
  ExternalLink,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
  Star,
  Clock,
  Users,
  Shield,
  CreditCard,
  Settings,
  Video,
  FileText,
  Lightbulb
} from 'lucide-react'

interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
  helpful: number
  notHelpful: number
  tags: string[]
}

interface GuideArticle {
  id: string
  title: string
  description: string
  category: string
  readTime: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  lastUpdated: Date
}

export function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { id: 'all', name: 'All Categories', icon: Book },
    { id: 'getting-started', name: 'Getting Started', icon: Users },
    { id: 'account', name: 'Account & Profile', icon: Settings },
    { id: 'coaching', name: 'Coaching', icon: Users },
    { id: 'payments', name: 'Billing & Payments', icon: CreditCard },
    { id: 'safety', name: 'Safety & Security', icon: Shield },
    { id: 'technical', name: 'Technical Support', icon: Settings },
  ]

  const faqItems: FAQItem[] = [
    {
      id: 'faq1',
      question: 'How do I find the right coach for my sport?',
      answer: 'Our AI-powered matching system analyzes your sport, skill level, location, and goals to recommend the best coaches. You can also browse coaches manually using our filters for sport, experience, location, and price range.',
      category: 'getting-started',
      helpful: 45,
      notHelpful: 2,
      tags: ['matching', 'coaches', 'search']
    },
    {
      id: 'faq2',
      question: 'Is my personal information safe on GoRedShirt?',
      answer: 'Yes, we take privacy very seriously. All coaches are background-checked, communications are monitored for safety, and we use enterprise-grade security to protect your data. We never share personal information without your consent.',
      category: 'safety',
      helpful: 89,
      notHelpful: 1,
      tags: ['safety', 'privacy', 'security']
    },
    {
      id: 'faq3',
      question: 'How does billing work for coaching sessions?',
      answer: 'Payment is processed securely through Stripe when you book a session. Coaches set their own rates, and our platform takes a small service fee. You can view all charges in your billing section.',
      category: 'payments',
      helpful: 34,
      notHelpful: 5,
      tags: ['billing', 'payments', 'sessions']
    },
    {
      id: 'faq4',
      question: 'Can I cancel or reschedule a coaching session?',
      answer: 'Yes, you can cancel or reschedule sessions up to 24 hours before the scheduled time for a full refund. Cancellations within 24 hours may be subject to the coach\'s cancellation policy.',
      category: 'coaching',
      helpful: 67,
      notHelpful: 8,
      tags: ['cancellation', 'rescheduling', 'refund']
    },
    {
      id: 'faq5',
      question: 'How do I create an effective recruiting profile?',
      answer: 'Include high-quality photos and videos, detailed stats, academic information, and a compelling personal statement. Highlight your achievements and goals. Our profile builder guides you through each section.',
      category: 'getting-started',
      helpful: 78,
      notHelpful: 3,
      tags: ['profile', 'recruiting', 'tips']
    }
  ]

  const guideArticles: GuideArticle[] = [
    {
      id: 'guide1',
      title: 'Complete Guide to Athletic Recruiting',
      description: 'Everything you need to know about the college recruiting process, from freshman year through commitment.',
      category: 'getting-started',
      readTime: 15,
      difficulty: 'beginner',
      lastUpdated: new Date('2024-01-15')
    },
    {
      id: 'guide2',
      title: 'Creating Highlight Videos That Get Noticed',
      description: 'Professional tips for filming, editing, and sharing videos that showcase your athletic abilities.',
      category: 'getting-started',
      readTime: 10,
      difficulty: 'intermediate',
      lastUpdated: new Date('2024-01-10')
    },
    {
      id: 'guide3',
      title: 'Safety Guidelines for Athletes',
      description: 'Important safety practices when connecting with coaches and participating in training sessions.',
      category: 'safety',
      readTime: 8,
      difficulty: 'beginner',
      lastUpdated: new Date('2024-01-12')
    },
    {
      id: 'guide4',
      title: 'Maximizing Your Coach Relationships',
      description: 'How to build strong, productive relationships with your coaches for long-term success.',
      category: 'coaching',
      readTime: 12,
      difficulty: 'intermediate',
      lastUpdated: new Date('2024-01-08')
    }
  ]

  const contactOptions = [
    {
      title: 'Live Chat',
      description: 'Get instant help from our support team',
      icon: MessageCircle,
      action: 'Start Chat',
      availability: 'Available now',
      color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    },
    {
      title: 'Email Support',
      description: 'Send us a detailed message',
      icon: Mail,
      action: 'Send Email',
      availability: 'Response within 24 hours',
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
    },
    {
      title: 'Phone Support',
      description: 'Speak with a support specialist',
      icon: Phone,
      action: 'Call Now',
      availability: 'Mon-Fri 9AM-6PM EST',
      color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
    }
  ]

  const filteredFAQ = faqItems.filter(item => {
    const matchesSearch = searchQuery === '' || 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const filteredGuides = guideArticles.filter(article => {
    const matchesSearch = searchQuery === '' || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Help Center
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Find answers to common questions and get the support you need
        </p>
        
        {/* Search */}
        <div className="max-w-md mx-auto relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search help articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Quick Help Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        {contactOptions.map((option) => {
          const Icon = option.icon
          return (
            <Card key={option.title} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className={`w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center ${option.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {option.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  {option.description}
                </p>
                <Badge variant="outline" className="text-xs mb-3">
                  {option.availability}
                </Badge>
                <Button variant="outline" size="sm" className="w-full">
                  {option.action}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="faq" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="faq">Frequently Asked Questions</TabsTrigger>
          <TabsTrigger value="guides">Guides & Tutorials</TabsTrigger>
          <TabsTrigger value="contact">Contact Support</TabsTrigger>
        </TabsList>

        {/* Categories Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center space-x-1"
              >
                <Icon className="w-3 h-3" />
                <span>{category.name}</span>
              </Button>
            )
          })}
        </div>

        <TabsContent value="faq" className="space-y-4">
          {filteredFAQ.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No FAQs found
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Try adjusting your search terms or category filter
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredFAQ.map((faq) => (
                <Card key={faq.id} className="hover:shadow-sm transition-shadow">
                  <CardContent className="p-6">
                    <details className="group">
                      <summary className="flex items-center justify-between cursor-pointer list-none">
                        <h3 className="font-medium text-gray-900 dark:text-white pr-4">
                          {faq.question}
                        </h3>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-open:rotate-90 transition-transform" />
                      </summary>
                      
                      <div className="mt-4 pt-4 border-t space-y-4">
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                          {faq.answer}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex space-x-2">
                            {faq.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Was this helpful?</span>
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm" className="h-8 px-2">
                                <ThumbsUp className="w-3 h-3 mr-1" />
                                {faq.helpful}
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 px-2">
                                <ThumbsDown className="w-3 h-3 mr-1" />
                                {faq.notHelpful}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </details>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="guides" className="space-y-4">
          {filteredGuides.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Book className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No guides found
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Try adjusting your search terms or category filter
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {filteredGuides.map((guide) => (
                <Card key={guide.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <CardTitle className="text-lg leading-tight">
                          {guide.title}
                        </CardTitle>
                        <CardDescription>
                          {guide.description}
                        </CardDescription>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center text-gray-500 dark:text-gray-400">
                          <Clock className="w-3 h-3 mr-1" />
                          {guide.readTime} min read
                        </div>
                        <Badge className={getDifficultyColor(guide.difficulty)}>
                          {guide.difficulty}
                        </Badge>
                      </div>
                      
                      <span className="text-gray-500 dark:text-gray-400">
                        Updated {guide.lastUpdated.toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle>Send us a message</CardTitle>
                <CardDescription>
                  Can't find what you're looking for? We're here to help.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Subject</label>
                  <Input placeholder="What can we help you with?" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <select className="w-full p-2 border rounded-md">
                    <option>Technical Support</option>
                    <option>Billing Question</option>
                    <option>Account Issue</option>
                    <option>Feature Request</option>
                    <option>Other</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Message</label>
                  <textarea 
                    className="w-full p-2 border rounded-md h-24 resize-none"
                    placeholder="Please describe your issue in detail..."
                  />
                </div>
                
                <Button className="w-full bg-red-600 hover:bg-red-700">
                  Send Message
                </Button>
              </CardContent>
            </Card>

            {/* Support Resources */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
                    Quick Tips
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm">
                    <p className="font-medium mb-1">Before contacting support:</p>
                    <ul className="space-y-1 text-gray-600 dark:text-gray-300 ml-4">
                      <li>• Check your email for any updates</li>
                      <li>• Try refreshing the page</li>
                      <li>• Clear your browser cache</li>
                      <li>• Check our status page for outages</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Response Times</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Live Chat</span>
                    <span className="text-green-600 font-medium">Immediate</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Email Support</span>
                    <span className="text-blue-600 font-medium">&lt; 24 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phone Support</span>
                    <span className="text-purple-600 font-medium">&lt; 5 minutes</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">System Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-sm font-medium">All Systems Operational</span>
                  </div>
                  <Button variant="link" className="p-0 h-auto text-sm mt-2">
                    View Status Page
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
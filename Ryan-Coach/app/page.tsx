'use client'

import { useAuth } from '@/lib/auth/context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import Link from 'next/link'
import { 
  Zap, 
  Users, 
  Calendar, 
  TrendingUp, 
  Shield, 
  Star, 
  CheckCircle, 
  ArrowRight,
  Play,
  Target,
  Award,
  Clock,
  DollarSign,
  BarChart3,
  Heart,
  Smartphone,
  Lock,
  Building2
} from 'lucide-react'

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary/20 rounded-full animate-pulse" />
            <div className="absolute inset-0 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
          <div className="text-lg font-medium animate-pulse">Loading your experience...</div>
        </div>
      </div>
    )
  }

  if (user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center gap-2 group cursor-pointer">
                <div className="p-2 bg-gradient-to-br from-primary to-primary/80 rounded-md group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-primary/25">
                  <Zap className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Ryan Coach</div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Link href="/login">
                <Button variant="ghost" className="hover:scale-105 transition-transform">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button className="hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-primary/25">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,theme(colors.primary.DEFAULT)_0%,transparent_50%)] opacity-10" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,theme(colors.secondary.DEFAULT)_0%,transparent_50%)] opacity-10" />
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
            <div className="text-center space-y-8">
              <div className="animate-fade-in-up">
                <Badge variant="outline" className="mx-auto animate-pulse-slow hover:scale-105 transition-transform cursor-default">
                  <Star className="h-3 w-3 mr-1 text-yellow-500 animate-spin-slow" />
                  Trusted by 1000+ coaches worldwide
                </Badge>
              </div>
              
              <div className="animate-fade-in-up animation-delay-200">
                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                  Transform Lives Through
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 block animate-gradient-x">
                    Expert Coaching
                  </span>
                </h1>
              </div>
              
              <div className="animate-fade-in-up animation-delay-400">
                <p className="mt-6 text-xl leading-8 text-muted-foreground max-w-3xl mx-auto">
                  The complete platform connecting certified fitness professionals with motivated clients. 
                  Book sessions, track progress, and build lasting fitness transformations.
                </p>
              </div>
              
              <div className="animate-fade-in-up animation-delay-600">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
                  <Link href="/register">
                    <Button size="lg" className="text-lg px-8 py-6 group hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-primary/25 bg-gradient-to-r from-primary to-primary/90 hover:from-primary hover:to-primary">
                      Start Your Journey
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                    </Button>
                  </Link>
                  <Button variant="outline" size="lg" className="text-lg px-8 py-6 group hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:shadow-lg glass">
                    <Play className="mr-2 h-5 w-5 group-hover:scale-125 group-hover:animate-pulse transition-transform" />
                    Watch Demo
                  </Button>
                </div>
              </div>

              <div className="animate-fade-in-up animation-delay-800">
                <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2 hover:text-green-600 transition-colors cursor-pointer">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    No setup fees
                  </div>
                  <div className="flex items-center gap-2 hover:text-green-600 transition-colors cursor-pointer">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    14-day free trial
                  </div>
                  <div className="flex items-center gap-2 hover:text-green-600 transition-colors cursor-pointer">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Cancel anytime
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-gradient-to-r from-muted/80 to-muted/40 border-y border-border/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center group">
                <div className="p-6 rounded-2xl glass border border-border/50 hover:border-primary/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 cursor-default">
                  <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">5,000+</div>
                  <div className="text-sm text-muted-foreground mt-2 font-medium">Active Sessions</div>
                </div>
              </div>
              <div className="text-center group">
                <div className="p-6 rounded-2xl glass border border-border/50 hover:border-primary/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 cursor-default">
                  <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">1,200+</div>
                  <div className="text-sm text-muted-foreground mt-2 font-medium">Certified Coaches</div>
                </div>
              </div>
              <div className="text-center group">
                <div className="p-6 rounded-2xl glass border border-border/50 hover:border-primary/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 cursor-default">
                  <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-green-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">98%</div>
                  <div className="text-sm text-muted-foreground mt-2 font-medium">Client Satisfaction</div>
                </div>
              </div>
              <div className="text-center group">
                <div className="p-6 rounded-2xl glass border border-border/50 hover:border-primary/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 cursor-default">
                  <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">24/7</div>
                  <div className="text-sm text-muted-foreground mt-2 font-medium">Platform Support</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-16">
              <Badge variant="outline">Features</Badge>
              <h2 className="text-3xl font-bold sm:text-4xl">
                Everything you need to succeed
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Comprehensive tools for coaches and clients to build successful fitness relationships
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              {/* For Clients */}
              <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] border-2 hover:border-blue-200 dark:hover:border-blue-800 glass hover-lift">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-blue-500/5 to-transparent group-hover:from-blue-500/30 transition-all duration-500" />
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse shadow-lg shadow-blue-500/50"></div>
                </div>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">For Clients</CardTitle>
                      <CardDescription>Transform your fitness journey</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 text-sm hover:translate-x-1 transition-transform duration-200">
                    <Target className="h-4 w-4 text-blue-600" />
                    <span>Browse certified coaches by specialty</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm hover:translate-x-1 transition-transform duration-200">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span>Book sessions with flexible scheduling</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm hover:translate-x-1 transition-transform duration-200">
                    <BarChart3 className="h-4 w-4 text-blue-600" />
                    <span>Track progress with detailed analytics</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm hover:translate-x-1 transition-transform duration-200">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <span>Secure payments with Stripe</span>
                  </div>
                  <div className="pt-4">
                    <Link href="/register">
                      <Button variant="outline" className="w-full group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-300 hover:scale-105">
                        Find Your Coach
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* For Coaches */}
              <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-500 ring-2 ring-primary/20 hover:ring-primary/40 glass hover-lift hover:scale-[1.02]">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
                <Badge className="absolute top-4 right-4 animate-pulse-slow">Most Popular</Badge>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">For Coaches</CardTitle>
                      <CardDescription>Grow your coaching business</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Users className="h-4 w-4 text-primary" />
                    <span>Comprehensive client management</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>Flexible availability scheduling</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <span>Track client progress & outcomes</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <DollarSign className="h-4 w-4 text-primary" />
                    <span>Instant payments & earnings dashboard</span>
                  </div>
                  <div className="pt-4">
                    <Link href="/register">
                      <Button className="w-full">
                        Start Coaching
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Enterprise */}
              <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] glass hover-lift">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent" />
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                      <Building2 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Enterprise</CardTitle>
                      <CardDescription>Scale your fitness business</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Shield className="h-4 w-4 text-purple-600" />
                    <span>Advanced security & compliance</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <BarChart3 className="h-4 w-4 text-purple-600" />
                    <span>Advanced analytics & reporting</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Users className="h-4 w-4 text-purple-600" />
                    <span>Multi-location management</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Smartphone className="h-4 w-4 text-purple-600" />
                    <span>Custom mobile app branding</span>
                  </div>
                  <div className="pt-4">
                    <Button variant="outline" className="w-full group-hover:bg-purple-600 group-hover:text-white">
                      Contact Sales
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 bg-muted/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-16">
              <Badge variant="outline">How It Works</Badge>
              <h2 className="text-3xl font-bold sm:text-4xl">
                Get started in 3 simple steps
              </h2>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xl font-bold">
                  1
                </div>
                <h3 className="text-xl font-semibold">Create Your Profile</h3>
                <p className="text-muted-foreground">
                  Sign up as a coach or client and complete your profile with your goals, specialties, and preferences.
                </p>
              </div>
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-semibold">Connect & Schedule</h3>
                <p className="text-muted-foreground">
                  Find your perfect match and book sessions that fit your schedule. Flexible timing for busy lifestyles.
                </p>
              </div>
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xl font-bold">
                  3
                </div>
                <h3 className="text-xl font-semibold">Track Progress</h3>
                <p className="text-muted-foreground">
                  Monitor your fitness journey with detailed analytics, progress photos, and achievement milestones.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-16">
              <Badge variant="outline">Testimonials</Badge>
              <h2 className="text-3xl font-bold sm:text-4xl">
                Loved by coaches and clients
              </h2>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">
                    &ldquo;Ryan Coach has transformed my business. I can focus on coaching while the platform handles everything else.&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                      SC
                    </div>
                    <div>
                      <div className="font-semibold">Sarah Chen</div>
                      <div className="text-sm text-muted-foreground">Certified Personal Trainer</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">
                    &ldquo;Found an amazing coach who understands my goals. The progress tracking keeps me motivated!&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                      MJ
                    </div>
                    <div>
                      <div className="font-semibold">Mike Johnson</div>
                      <div className="text-sm text-muted-foreground">Marathon Runner</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">
                    &ldquo;The payment system is seamless and the client management tools are incredibly intuitive.&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                      AD
                    </div>
                    <div>
                      <div className="font-semibold">Alex Davis</div>
                      <div className="text-sm text-muted-foreground">Yoga Instructor</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-primary text-primary-foreground">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold sm:text-4xl mb-6">
              Ready to start your fitness journey?
            </h2>
            <p className="text-xl opacity-90 mb-8">
              Join thousands of coaches and clients transforming lives through expert coaching.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                  Get Started Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-primary rounded-md">
                  <Zap className="h-5 w-5 text-primary-foreground" />
                </div>
                <div className="text-lg font-bold">Ryan Coach</div>
              </div>
              <p className="text-muted-foreground text-sm">
                The premier platform for connecting fitness professionals with motivated clients.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground">For Coaches</Link></li>
                <li><Link href="#" className="hover:text-foreground">For Clients</Link></li>
                <li><Link href="#" className="hover:text-foreground">Pricing</Link></li>
                <li><Link href="#" className="hover:text-foreground">Features</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground">Help Center</Link></li>
                <li><Link href="#" className="hover:text-foreground">Contact Us</Link></li>
                <li><Link href="#" className="hover:text-foreground">Community</Link></li>
                <li><Link href="#" className="hover:text-foreground">Status</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground">About</Link></li>
                <li><Link href="#" className="hover:text-foreground">Blog</Link></li>
                <li><Link href="#" className="hover:text-foreground">Careers</Link></li>
                <li><Link href="#" className="hover:text-foreground">Privacy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 mt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Ryan Coach. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
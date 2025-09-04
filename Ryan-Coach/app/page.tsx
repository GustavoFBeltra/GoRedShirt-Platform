'use client'

import { useAuth } from '@/lib/auth/context'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
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
  Building2,
  Trophy,
  Activity,
  ChevronRight
} from 'lucide-react'

// Import GoRedShirt Theme System
import { 
  ThemeCard,
  ThemeButton,
  ThemeIcon,
  staggeredDelay,
  textGradient,
  glassmorphism,
  shadows,
  animations,
  theme
} from '@/components/ui/theme-system'
import { UltimateBackground } from '@/components/ui/ultimate-background'
import { cn } from '@/lib/utils'

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <UltimateBackground className="fixed inset-0" />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-red-600/20 rounded-full animate-pulse" />
            <div className="absolute inset-0 w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
          </div>
          <div className={cn("text-lg font-medium animate-pulse", textGradient('primary'))}>
            Loading your experience...
          </div>
        </div>
      </div>
    )
  }

  if (user) {
    return null
  }

  return (
    <div className="relative min-h-screen">
      {/* Ultimate Background */}
      <UltimateBackground className="fixed inset-0" />
      
      {/* Content Overlay */}
      <div className="relative z-10">
        {/* Header */}
        <header className={cn(
          "border-b border-white/20 sticky top-0 z-50",
          glassmorphism.nav
        )}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <div className="flex items-center gap-2 group cursor-pointer">
                  <ThemeIcon variant="primary" hover="scaleRotate">
                    <div className="relative">
                      <div className="text-white font-bold text-lg">GR</div>
                      <div className="absolute inset-0 animate-pulse bg-red-400/20 rounded" />
                    </div>
                  </ThemeIcon>
                  <div className={cn("text-xl font-bold", textGradient('primary'))}>
                    GoRedShirt
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <ThemeToggle />
                <Link href="/login">
                  <ThemeButton variant="ghost" className="hover:scale-105">
                    Sign In
                  </ThemeButton>
                </Link>
                <Link href="/register">
                  <ThemeButton variant="primary">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </ThemeButton>
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main>
          {/* Hero Section */}
          <section className="relative py-24 lg:py-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center space-y-8">
                <div className="animate-fade-in-up" style={staggeredDelay(0)}>
                  <div className={cn(
                    "inline-flex items-center gap-2 px-4 py-2 rounded-full border-0",
                    glassmorphism.cardSoft,
                    "hover:scale-105 transition-all duration-300 cursor-default"
                  )}>
                    <ThemeIcon variant="glass" hover="scaleRotate" className="!p-1">
                      <Trophy className="h-3 w-3 text-red-600" />
                    </ThemeIcon>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Trusted by 10,000+ athletes worldwide
                    </span>
                  </div>
                </div>
                
                <div className="animate-fade-in-up" style={staggeredDelay(1)}>
                  <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                    Elevate Athletic
                    <span className={cn("block", textGradient('primary'))}>
                      Performance
                    </span>
                  </h1>
                </div>
                
                <div className="animate-fade-in-up" style={staggeredDelay(2)}>
                  <p className="mt-6 text-xl leading-8 text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                    The complete recruiting platform connecting elite athletes with coaches and recruiters. 
                    Track performance, showcase talent, and discover opportunities.
                  </p>
                </div>
                
                <div className="animate-fade-in-up" style={staggeredDelay(3)}>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12">
                    <Link href="/register">
                      <ThemeButton size="lg" variant="primary" className="text-lg px-8 py-6 group">
                        Start Your Journey
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                      </ThemeButton>
                    </Link>
                    <ThemeButton size="lg" variant="foundation" className="text-lg px-8 py-6 group hover:scale-105 transition-all duration-300">
                      <Play className="mr-2 h-5 w-5 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300" />
                      Watch Demo
                    </ThemeButton>
                  </div>
                </div>

                <div className="animate-fade-in-up" style={staggeredDelay(4)}>
                  <div className="flex flex-wrap items-center justify-center gap-8 mt-16">
                    {[
                      { icon: CheckCircle, text: "Elite athlete profiles" },
                      { icon: Shield, text: "Performance tracking" },
                      { icon: Trophy, text: "Recruiter discovery" }
                    ].map((feature, idx) => (
                      <div key={idx} className={cn(
                        "flex items-center gap-2 text-sm font-medium",
                        "hover:text-red-600 transition-colors cursor-pointer"
                      )}>
                        <feature.icon className="h-4 w-4 text-red-600" />
                        <span className="text-slate-600 dark:text-slate-400">{feature.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                {[
                  { number: "25,000+", label: "Elite Athletes", icon: Trophy },
                  { number: "2,500+", label: "College Coaches", icon: Users },
                  { number: "96%", label: "Scholarship Success", icon: Award },
                  { number: "24/7", label: "Platform Support", icon: Shield }
                ].map((stat, index) => (
                  <ThemeCard 
                    key={index}
                    variant="hover" 
                    className="text-center animate-fade-in-up"
                    style={staggeredDelay(index)}
                  >
                    <div className="space-y-4">
                      <ThemeIcon 
                        variant="primary" 
                        hover="scaleRotate"
                        className="mx-auto"
                      >
                        <stat.icon className="h-5 w-5" />
                      </ThemeIcon>
                      
                      <div className={cn(
                        "text-4xl lg:text-5xl font-bold",
                        textGradient('primary')
                      )}>
                        {stat.number}
                      </div>
                      
                      <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                        {stat.label}
                      </div>
                    </div>
                  </ThemeCard>
                ))}
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center space-y-4 mb-16 animate-fade-in-up">
                <div className={cn(
                  "inline-flex items-center gap-2 px-4 py-2 rounded-full border-0",
                  glassmorphism.cardSoft
                )}>
                  <Activity className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Features</span>
                </div>
                <h2 className={cn("text-3xl font-bold sm:text-4xl", textGradient('foundation'))}>
                  Everything you need to succeed
                </h2>
                <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                  Complete platform for athletes, coaches, and recruiters in the recruiting process
                </p>
              </div>

              <div className="grid gap-8 lg:grid-cols-3">
                {/* For Athletes */}
                <ThemeCard 
                  variant="interactive" 
                  className="group cursor-pointer animate-fade-in-up"
                  style={staggeredDelay(0)}
                  onMouseEnter={() => setHoveredCard('athletes')}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* Background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-600/5 to-slate-700/5" />
                  <div className={cn(
                    "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500",
                    "from-slate-600 to-slate-700",
                    hoveredCard === 'athletes' && "opacity-10"
                  )} />
                  
                  <div className="relative space-y-6">
                    <div className="flex items-center gap-4">
                      <ThemeIcon 
                        variant="foundation" 
                        hover="scaleRotateStrong"
                        className={cn(
                          "transition-all duration-300",
                          hoveredCard === 'athletes' && "scale-110 rotate-6"
                        )}
                      >
                        <Trophy className="h-6 w-6" />
                      </ThemeIcon>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                          For Athletes
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400">Showcase your talent</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {[
                        { icon: Target, text: "Elite performance profiles" },
                        { icon: BarChart3, text: "Advanced metrics tracking" },
                        { icon: Activity, text: "Media gallery & highlights" },
                        { icon: Users, text: "Recruiter visibility" }
                      ].map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-sm hover:translate-x-1 transition-transform duration-200">
                          <feature.icon className="h-4 w-4 text-slate-600" />
                          <span className="text-slate-700 dark:text-slate-300">{feature.text}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Link href="/register" className="block">
                      <ThemeButton variant="foundation" className="w-full group">
                        Create Profile
                        <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </ThemeButton>
                    </Link>
                  </div>
                </ThemeCard>

                {/* For Coaches */}
                <ThemeCard 
                  variant="interactive" 
                  className="group cursor-pointer animate-fade-in-up ring-2 ring-red-600/20"
                  style={staggeredDelay(1)}
                  onMouseEnter={() => setHoveredCard('coaches')}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* Most Popular Badge */}
                  <div className="absolute top-4 right-4">
                    <div className="bg-red-600 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                      Most Popular
                    </div>
                  </div>
                  
                  {/* Background gradients */}
                  <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-red-700/5" />
                  <div className={cn(
                    "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500",
                    "from-red-600 to-red-700", 
                    hoveredCard === 'coaches' && "opacity-10"
                  )} />
                  
                  <div className="relative space-y-6">
                    <div className="flex items-center gap-4">
                      <ThemeIcon 
                        variant="primary" 
                        hover="scaleRotateStrong"
                        className={cn(
                          "transition-all duration-300",
                          hoveredCard === 'coaches' && "scale-110 rotate-12"
                        )}
                      >
                        <Award className="h-6 w-6" />
                      </ThemeIcon>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                          For Coaches
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400">Grow your program</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {[
                        { icon: Users, text: "Athlete discovery system" },
                        { icon: BarChart3, text: "Performance analytics" },
                        { icon: Calendar, text: "Recruiting pipeline" },
                        { icon: Shield, text: "Verified athlete data" }
                      ].map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-sm hover:translate-x-1 transition-transform duration-200">
                          <feature.icon className="h-4 w-4 text-red-600" />
                          <span className="text-slate-700 dark:text-slate-300">{feature.text}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Link href="/register" className="block">
                      <ThemeButton variant="primary" className="w-full group">
                        Start Recruiting
                        <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </ThemeButton>
                    </Link>
                  </div>
                </ThemeCard>

                {/* For Recruiters */}
                <ThemeCard 
                  variant="interactive" 
                  className="group cursor-pointer animate-fade-in-up"
                  style={staggeredDelay(2)}
                  onMouseEnter={() => setHoveredCard('recruiters')}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* Background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-600/5 to-slate-700/5" />
                  <div className={cn(
                    "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500",
                    "from-slate-600 to-slate-700",
                    hoveredCard === 'recruiters' && "opacity-10"
                  )} />
                  
                  <div className="relative space-y-6">
                    <div className="flex items-center gap-4">
                      <ThemeIcon 
                        variant="foundation" 
                        hover="scaleRotateStrong"
                        className={cn(
                          "transition-all duration-300",
                          hoveredCard === 'recruiters' && "scale-110 rotate-6"
                        )}
                      >
                        <Building2 className="h-6 w-6" />
                      </ThemeIcon>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                          For Recruiters
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400">Find top talent</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {[
                        { icon: Target, text: "Advanced search filters" },
                        { icon: BarChart3, text: "Performance comparisons" },
                        { icon: Users, text: "Prospect management" },
                        { icon: Heart, text: "Direct communication" }
                      ].map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-sm hover:translate-x-1 transition-transform duration-200">
                          <feature.icon className="h-4 w-4 text-slate-600" />
                          <span className="text-slate-700 dark:text-slate-300">{feature.text}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Link href="/register" className="block">
                      <ThemeButton variant="foundation" className="w-full group">
                        Discover Talent
                        <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </ThemeButton>
                    </Link>
                  </div>
                </ThemeCard>
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section className="py-24 relative">
            {/* Subtle background overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-50/50 to-white/50 dark:from-slate-900/50 dark:to-slate-800/50" />
            
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center space-y-4 mb-16 animate-fade-in-up">
                <div className={cn(
                  "inline-flex items-center gap-2 px-4 py-2 rounded-full border-0",
                  glassmorphism.cardSoft
                )}>
                  <Target className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">How It Works</span>
                </div>
                <h2 className={cn("text-3xl font-bold sm:text-4xl", textGradient('foundation'))}>
                  Get started in 3 simple steps
                </h2>
                <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                  Join the recruiting revolution and elevate your athletic journey
                </p>
              </div>

              <div className="grid gap-8 md:gap-12 md:grid-cols-3">
                {[
                  {
                    step: "1",
                    title: "Build Your Profile",
                    description: "Create your elite athlete profile with performance metrics, media highlights, and academic achievements.",
                    icon: Trophy
                  },
                  {
                    step: "2", 
                    title: "Track Performance",
                    description: "Log workouts, record metrics, and upload game highlights to showcase your athletic development.",
                    icon: BarChart3
                  },
                  {
                    step: "3",
                    title: "Get Discovered",
                    description: "Connect with coaches and recruiters actively searching for athletes with your skills and potential.",
                    icon: Users
                  }
                ].map((item, index) => (
                  <ThemeCard 
                    key={index}
                    variant="hover" 
                    className="text-center animate-fade-in-up group"
                    style={staggeredDelay(index)}
                  >
                    <div className="space-y-6">
                      <div className="relative">
                        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg hover:shadow-red-500/25 transition-shadow duration-300">
                          {item.step}
                        </div>
                        <div className="absolute -inset-2 bg-red-600/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </div>
                      
                      <ThemeIcon 
                        variant="foundation" 
                        hover="scaleRotate"
                        className="mx-auto"
                      >
                        <item.icon className="h-5 w-5" />
                      </ThemeIcon>
                      
                      <div className="space-y-3">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                          {item.title}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </ThemeCard>
                ))}
              </div>
            </div>
          </section>

          {/* Testimonials */}
          <section className="py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center space-y-4 mb-16 animate-fade-in-up">
                <div className={cn(
                  "inline-flex items-center gap-2 px-4 py-2 rounded-full border-0",
                  glassmorphism.cardSoft
                )}>
                  <Star className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Testimonials</span>
                </div>
                <h2 className={cn("text-3xl font-bold sm:text-4xl", textGradient('foundation'))}>
                  Trusted by elite athletes
                </h2>
                <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                  See how GoRedShirt is transforming athletic careers nationwide
                </p>
              </div>

              <div className="grid gap-8 md:gap-10 md:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    quote: "GoRedShirt helped me connect with D1 coaches I never would have reached. Now I'm playing at my dream school!",
                    name: "Marcus Johnson",
                    role: "D1 Football Player",
                    initials: "MJ",
                    sport: "Football"
                  },
                  {
                    quote: "The performance tracking and media gallery made my recruiting process so much easier. Coaches loved the professional presentation.",
                    name: "Sarah Williams", 
                    role: "D1 Soccer Player",
                    initials: "SW",
                    sport: "Soccer"
                  },
                  {
                    quote: "As a coach, GoRedShirt gives me access to verified athlete data and performance metrics. It's revolutionized our recruiting.",
                    name: "Coach Davis",
                    role: "College Basketball Coach",
                    initials: "CD", 
                    sport: "Basketball"
                  }
                ].map((testimonial, index) => (
                  <ThemeCard 
                    key={index}
                    variant="hover" 
                    className="animate-fade-in-up"
                    style={staggeredDelay(index)}
                  >
                    <div className="space-y-6">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      
                      <blockquote className="text-slate-700 dark:text-slate-300 italic">
                        &ldquo;{testimonial.quote}&rdquo;
                      </blockquote>
                      
                      <div className="flex items-center gap-4">
                        <ThemeIcon variant="primary" className="!w-12 !h-12">
                          <span className="text-white font-semibold text-sm">
                            {testimonial.initials}
                          </span>
                        </ThemeIcon>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {testimonial.name}
                          </div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">
                            {testimonial.role}
                          </div>
                          <div className="text-xs text-red-600 font-medium">
                            {testimonial.sport}
                          </div>
                        </div>
                      </div>
                    </div>
                  </ThemeCard>
                ))}
              </div>
            </div>
          </section>

          {/* Achievement Banner CTA */}
          <section className="py-24 relative">
            <ThemeCard 
              variant="interactive" 
              className="max-w-4xl mx-auto text-center relative overflow-hidden border-0 animate-fade-in-up hover:scale-[1.02] transition-all duration-500"
              style={{ background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%, #7f1d1d 100%)' }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
              <div className="relative space-y-6 text-white p-12">
                <div className="flex justify-center">
                  <ThemeIcon variant="glass" className="!p-4 !bg-white/20">
                    <Trophy className="h-8 w-8 text-white" />
                  </ThemeIcon>
                </div>
                
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold sm:text-4xl">
                    Ready to elevate your athletic journey?
                  </h2>
                  <p className="text-xl opacity-90 max-w-2xl mx-auto">
                    Join thousands of elite athletes, coaches, and recruiters transforming careers through GoRedShirt.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                  <Link href="/register">
                    <ThemeButton 
                      size="lg" 
                      variant="secondary" 
                      className="text-lg px-8 py-6 bg-white text-red-600 hover:bg-gray-100 hover:scale-105 hover:shadow-xl transition-all duration-300 group"
                    >
                      Start Your Journey
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </ThemeButton>
                  </Link>
                  <Link href="/login">
                    <ThemeButton 
                      size="lg" 
                      variant="ghost" 
                      className="text-lg px-8 py-6 text-white hover:bg-white/20 border border-white/30 hover:border-white/50 hover:scale-105 transition-all duration-300"
                    >
                      Sign In
                    </ThemeButton>
                  </Link>
                </div>
              </div>
            </ThemeCard>
          </section>
        </main>

        {/* Footer */}
        <footer className={cn("relative border-t border-white/20", glassmorphism.cardSoft)}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid gap-8 md:grid-cols-4">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <ThemeIcon variant="primary" hover="scaleRotate">
                    <div className="relative">
                      <div className="text-white font-bold text-sm">GR</div>
                    </div>
                  </ThemeIcon>
                  <div className={cn("text-lg font-bold", textGradient('primary'))}>
                    GoRedShirt
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm max-w-xs">
                  The premier recruiting platform connecting elite athletes with opportunities.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4 text-gray-900 dark:text-white">Platform</h4>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <li><Link href="/register" className="hover:text-red-600 transition-colors">For Athletes</Link></li>
                  <li><Link href="/register" className="hover:text-red-600 transition-colors">For Coaches</Link></li>
                  <li><Link href="/discovery" className="hover:text-red-600 transition-colors">Discover Talent</Link></li>
                  <li><Link href="#" className="hover:text-red-600 transition-colors">Performance Tracking</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4 text-gray-900 dark:text-white">Support</h4>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <li><Link href="#" className="hover:text-red-600 transition-colors">Help Center</Link></li>
                  <li><Link href="#" className="hover:text-red-600 transition-colors">Contact Us</Link></li>
                  <li><Link href="#" className="hover:text-red-600 transition-colors">Community</Link></li>
                  <li><Link href="#" className="hover:text-red-600 transition-colors">Status</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4 text-gray-900 dark:text-white">Company</h4>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <li><Link href="#" className="hover:text-red-600 transition-colors">About</Link></li>
                  <li><Link href="#" className="hover:text-red-600 transition-colors">Blog</Link></li>
                  <li><Link href="#" className="hover:text-red-600 transition-colors">Careers</Link></li>
                  <li><Link href="#" className="hover:text-red-600 transition-colors">Privacy</Link></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-white/20 pt-8 mt-8 text-center">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                &copy; 2024 GoRedShirt Platform. All rights reserved. Empowering athletic excellence.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
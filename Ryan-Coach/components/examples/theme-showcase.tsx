'use client'

import { useState } from 'react'
import { 
  ThemeCard, 
  ThemeButton, 
  ThemeIcon, 
  ProgressCircle,
  staggeredDelay,
  textGradient,
  glassmorphism,
  shadows 
} from '@/components/ui/theme-system'
import { UltimateBackground } from '@/components/ui/ultimate-background'
import { 
  Trophy, 
  Star, 
  Activity, 
  TrendingUp, 
  Heart, 
  Zap,
  Target,
  Award,
  BarChart3,
  ArrowUpRight
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// Example showcase component demonstrating the theme system
export function ThemeShowcase() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  
  const showcaseItems = [
    {
      id: 'performance',
      title: 'Performance Score',
      value: '95',
      subtitle: 'Excellent',
      icon: Trophy,
      trend: '+12 points',
      isPrimary: true
    },
    {
      id: 'activity',
      title: 'Activity Level',
      value: '8.2',
      subtitle: 'Daily average',
      icon: Activity,
      trend: '+0.5 increase'
    },
    {
      id: 'goals',
      title: 'Goals Met',
      value: '7/10',
      subtitle: 'This month',
      icon: Target,
      trend: '+2 this week'
    },
    {
      id: 'streak',
      title: 'Training Streak',
      value: '14',
      subtitle: 'Days consecutive',
      icon: Zap,
      trend: 'Personal best!'
    }
  ]
  
  const quickActions = [
    {
      title: 'Track Performance',
      description: 'Log your latest metrics and achievements',
      icon: BarChart3,
      isPrimary: true
    },
    {
      title: 'View Progress',
      description: 'Analyze your training data and trends',
      icon: TrendingUp,
      isPrimary: false
    },
    {
      title: 'Set Goals',
      description: 'Create new performance targets',
      icon: Target,
      isPrimary: false
    },
    {
      title: 'Achievements',
      description: 'View badges and milestones',
      icon: Award,
      isPrimary: false
    }
  ]
  
  return (
    <div className="relative min-h-screen">
      {/* UltimateBackground System */}
      <UltimateBackground className="fixed inset-0" />
      
      <div className="relative z-10 p-6 space-y-8">
        {/* Header Section */}
        <div className={`${glassmorphism.card} rounded-2xl border border-white/20 p-8 animate-fade-in-up`}>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className={`text-4xl font-bold ${textGradient('primary')}`}>
                GoRedShirt Theme System
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
                Ultra-comprehensive design framework showcase
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="bg-white/80 dark:bg-black/80 backdrop-blur-sm">
                Live Demo
              </Badge>
              
              <ThemeButton 
                variant="primary" 
                size="lg"
                className="group"
              >
                <BarChart3 className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                Get Started
                <ArrowUpRight className="ml-2 h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </ThemeButton>
            </div>
          </div>
        </div>

        {/* Theme Component Examples */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Button Variants */}
          <ThemeCard variant="glass" className="animate-fade-in-up" style={staggeredDelay(0)}>
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Button Variants
            </h3>
            <div className="space-y-4">
              <ThemeButton variant="primary" className="w-full">
                Primary Button
              </ThemeButton>
              <ThemeButton variant="foundation" className="w-full">
                Foundation Button
              </ThemeButton>
              <ThemeButton variant="secondary" className="w-full">
                Secondary Button
              </ThemeButton>
              <ThemeButton variant="ghost" className="w-full">
                Ghost Button
              </ThemeButton>
              <ThemeButton variant="achievement" className="w-full">
                🏆 Achievement Button
              </ThemeButton>
            </div>
          </ThemeCard>

          {/* Icon Variants */}
          <ThemeCard variant="glass" className="animate-fade-in-up" style={staggeredDelay(1)}>
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Animated Icons
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <ThemeIcon variant="primary" hover="scaleRotate">
                <Trophy className="h-5 w-5" />
              </ThemeIcon>
              <ThemeIcon variant="foundation" hover="scaleRotateStrong">
                <Star className="h-5 w-5" />
              </ThemeIcon>
              <ThemeIcon variant="glass" hover="iconRotate">
                <Activity className="h-5 w-5" />
              </ThemeIcon>
              <ThemeIcon variant="primary" hover="scaleRotate">
                <Heart className="h-5 w-5" />
              </ThemeIcon>
              <ThemeIcon variant="foundation" hover="scaleRotateStrong">
                <Zap className="h-5 w-5" />
              </ThemeIcon>
              <ThemeIcon variant="glass" hover="iconRotate">
                <Award className="h-5 w-5" />
              </ThemeIcon>
            </div>
          </ThemeCard>

          {/* Progress Circle */}
          <ThemeCard variant="glass" className="animate-fade-in-up" style={staggeredDelay(2)}>
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white text-center">
              Progress Circle
            </h3>
            <div className="flex justify-center">
              <ProgressCircle 
                value={78} 
                size="sm" 
                label="Complete"
                className="mx-auto"
              />
            </div>
          </ThemeCard>
        </div>

        {/* Interactive Stats Cards */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Interactive Stats Cards
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {showcaseItems.map((item, index) => (
              <Card 
                key={item.id}
                className="relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer hover:-translate-y-2 hover:scale-[1.02] bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl animate-fade-in-up"
                style={staggeredDelay(index)}
                onMouseEnter={() => setHoveredCard(item.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br opacity-5 ${
                  item.isPrimary 
                    ? 'from-red-600/8 to-red-700/8' 
                    : 'from-slate-600/5 to-slate-700/5'
                }`} />
                
                {/* Animated hover gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500 ${
                  item.isPrimary 
                    ? 'from-red-600 to-red-700' 
                    : 'from-slate-600 to-slate-700'
                } ${hoveredCard === item.id && "opacity-10"}`} />

                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {item.title}
                  </CardTitle>
                  <div className={`p-2 rounded-xl bg-gradient-to-br text-white transition-transform duration-300 ${
                    item.isPrimary 
                      ? 'from-red-600 to-red-700' 
                      : 'from-slate-600 to-slate-700'
                  } ${hoveredCard === item.id && "scale-110 rotate-12"}`}>
                    <item.icon className="h-4 w-4" />
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-1">
                    <div className={`text-3xl font-bold ${textGradient('foundation')}`}>
                      {item.value}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {item.subtitle}
                    </p>
                    <div className="flex items-center gap-1 pt-2">
                      <TrendingUp className="h-3 w-3 text-green-500" />
                      <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                        {item.trend}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Quick Actions
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action, index) => (
              <ThemeCard
                key={action.title}
                variant="hover"
                className="group cursor-pointer animate-fade-in-up"
                style={staggeredDelay(index)}
              >
                <div className="p-6">
                  <ThemeIcon 
                    variant={action.isPrimary ? "primary" : "foundation"}
                    hover="scaleRotate"
                    className="mb-4"
                  >
                    <action.icon className="h-6 w-6" />
                  </ThemeIcon>
                  
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {action.description}
                  </p>
                  
                  <ArrowUpRight className="h-4 w-4 text-gray-400 mt-3 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
                </div>
              </ThemeCard>
            ))}
          </div>
        </div>

        {/* Achievement Banner */}
        <Card className="border-0 shadow-xl bg-gradient-to-r from-red-600 to-red-700 text-white relative overflow-hidden animate-fade-in-up animation-delay-800">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
          <CardContent className="relative p-8">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Star className="h-6 w-6 animate-pulse" />
                  <h3 className="text-2xl font-bold">Theme System Complete! 🚀</h3>
                </div>
                <p className="text-white/90">
                  Ultra-comprehensive design framework ready for implementation across the entire platform.
                </p>
                
                <div className="flex gap-3 mt-4">
                  <ThemeButton 
                    variant="secondary"
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                  >
                    View Documentation
                  </ThemeButton>
                  
                  <ThemeButton 
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                  >
                    Copy Components
                  </ThemeButton>
                </div>
              </div>
              
              <div className="hidden md:block">
                <Trophy className="h-24 w-24 text-white/20 animate-float" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
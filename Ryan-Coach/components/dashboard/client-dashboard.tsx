'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { UltimateBackground } from '@/components/ui/ultimate-background'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  RadialBarChart,
  RadialBar,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { ProgressCircle } from '@/components/ui/theme-system'
import { 
  Calendar, 
  TrendingUp, 
  Users, 
  Target, 
  Award,
  ChevronRight,
  ArrowUpRight,
  Clock,
  Activity,
  Zap,
  Heart,
  Trophy,
  Star,
  Sparkles,
  Timer,
  BarChart3,
  UserCheck,
  CalendarCheck,
  MessageCircle,
  Play,
  CheckCircle2
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function ClientDashboard() {
  const [activeGoals, setActiveGoals] = useState(3)
  const [progressValue, setProgressValue] = useState(0)
  const [streakDays, setStreakDays] = useState(7)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  // Animate progress on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgressValue(75)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const stats = [
    {
      id: 'sports',
      title: 'Sports Played',
      value: '2',
      subtitle: 'Football, Basketball',
      icon: Activity,
      trend: '+1 this season',
      trendUp: true,
      gradient: 'from-slate-600 to-slate-700',
      bgGradient: 'from-slate-600/5 to-slate-700/5',
    },
    {
      id: 'performance',
      title: 'Performance Score',
      value: '92',
      subtitle: 'Above average',
      icon: Trophy,
      trend: '+8 points',
      trendUp: true,
      gradient: 'from-red-600 to-red-700', // Only red accent
      bgGradient: 'from-red-600/8 to-red-700/8',
    },
    {
      id: 'recruiters',
      title: 'Recruiter Views',
      value: '24',
      subtitle: 'This month',
      icon: Users,
      trend: '+12 this week',
      trendUp: true,
      gradient: 'from-slate-600 to-slate-700',
      bgGradient: 'from-slate-600/5 to-slate-700/5',
    },
    {
      id: 'metrics',
      title: 'Metrics Tracked',
      value: '18',
      subtitle: 'Personal records',
      icon: BarChart3,
      trend: '+3 new PRs',
      trendUp: true,
      gradient: 'from-slate-600 to-slate-700',
      bgGradient: 'from-slate-600/5 to-slate-700/5',
    }
  ]

  const upcomingSessions = [
    {
      id: 1,
      coach: 'Coach Sarah Johnson',
      type: 'Football Skills Training',
      time: '10:00 AM',
      date: 'Today',
      duration: '90 min',
      status: 'confirmed'
    },
    {
      id: 2,
      coach: 'Coach Mike Chen',
      type: 'Combine Prep Session',
      time: '2:00 PM',
      date: 'Tomorrow',
      duration: '120 min',
      status: 'confirmed'
    }
  ]

  const quickActions = [
    {
      title: 'Track Performance',
      description: 'Log your latest metrics',
      icon: BarChart3,
      color: 'bg-gradient-to-br from-red-600 to-red-700', // Primary red action
      href: '/dashboard/client/sports-performance'
    },
    {
      title: 'Messages',
      description: 'Connect with coaches & recruiters',
      icon: MessageCircle,
      color: 'bg-gradient-to-br from-red-600 to-red-700', // Secondary red action for communication
      href: '/messages'
    },
    {
      title: 'Upload Video',
      description: 'Add highlights to your profile',
      icon: Play,
      color: 'bg-gradient-to-br from-slate-600 to-slate-700',
      href: '/profile/media'
    },
    {
      title: 'Find Coaches',
      description: 'Get expert training',
      icon: UserCheck,
      color: 'bg-gradient-to-br from-slate-600 to-slate-700',
      href: '/coaches'
    },
    {
      title: 'Discover Athletes',
      description: 'Network with other athletes',
      icon: Users,
      color: 'bg-gradient-to-br from-slate-600 to-slate-700',
      href: '/discovery'
    },
    {
      title: 'View Profile',
      description: 'See what recruiters see',
      icon: Target,
      color: 'bg-gradient-to-br from-slate-600 to-slate-700',
      href: '/athlete/profile'
    }
  ]

  // Performance Chart Data
  const performanceData = [
    { month: 'Jan', speed: 85, strength: 78, endurance: 82, overall: 82 },
    { month: 'Feb', speed: 88, strength: 82, endurance: 85, overall: 85 },
    { month: 'Mar', speed: 92, strength: 85, endurance: 88, overall: 88 },
    { month: 'Apr', speed: 95, strength: 88, endurance: 90, overall: 91 },
    { month: 'May', speed: 98, strength: 92, endurance: 94, overall: 95 },
    { month: 'Jun', speed: 96, strength: 95, endurance: 96, overall: 96 },
  ]

  // Training Distribution Data
  const trainingData = [
    { name: 'Speed', value: 35, color: '#dc2626' },
    { name: 'Strength', value: 28, color: '#7c2d12' },
    { name: 'Endurance', value: 22, color: '#991b1b' },
    { name: 'Skills', value: 15, color: '#b91c1c' },
  ]

  // Weekly Activity Data
  const weeklyData = [
    { day: 'Mon', hours: 2.5, intensity: 85 },
    { day: 'Tue', hours: 3.2, intensity: 92 },
    { day: 'Wed', hours: 1.8, intensity: 78 },
    { day: 'Thu', hours: 3.5, intensity: 95 },
    { day: 'Fri', hours: 2.0, intensity: 82 },
    { day: 'Sat', hours: 4.2, intensity: 88 },
    { day: 'Sun', hours: 1.5, intensity: 70 },
  ]

  // Achievement Progress Data
  const achievements = [
    { name: 'Speed Demon', progress: 85, total: 100, icon: '⚡', color: 'from-yellow-500 to-orange-600' },
    { name: 'Iron Will', progress: 72, total: 100, icon: '💪', color: 'from-gray-600 to-gray-800' },
    { name: 'Endurance Beast', progress: 94, total: 100, icon: '🏃', color: 'from-green-500 to-emerald-600' },
    { name: 'Team Player', progress: 58, total: 100, icon: '🤝', color: 'from-blue-500 to-indigo-600' },
  ]

  return (
    <div className="min-h-screen relative">
      {/* Ultimate Background System */}
      <UltimateBackground interactive />

      <div className="relative space-y-8 p-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-fade-in-up">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-red-600 bg-clip-text text-transparent dark:from-white dark:to-red-400">
              Welcome to GoRedShirt! 💪
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Your athletic journey starts here. Track performance, connect with coaches, and get discovered by recruiters.
            </p>
          </div>
          <Button 
            size="lg" 
            className="group bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl hover:shadow-red-500/25 transition-all duration-300 hover:-translate-y-0.5"
          >
            <BarChart3 className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
            Track Performance
            <ArrowUpRight className="ml-2 h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card 
              key={stat.id}
              className={cn(
                "relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer",
                "hover:-translate-y-2 hover:scale-[1.02]",
                "bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl",
                "animate-fade-in-up"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
              onMouseEnter={() => setHoveredCard(stat.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Gradient background */}
              <div className={cn(
                "absolute inset-0 bg-gradient-to-br opacity-5",
                stat.bgGradient
              )} />
              
              {/* Animated gradient border */}
              <div className={cn(
                "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500",
                stat.gradient,
                hoveredCard === stat.id && "opacity-10"
              )} />

              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.title}
                </CardTitle>
                <div className={cn(
                  "p-2 rounded-xl bg-gradient-to-br text-white transition-transform duration-300",
                  stat.gradient,
                  hoveredCard === stat.id && "scale-110 rotate-12"
                )}>
                  <stat.icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <div className="text-3xl font-bold bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {stat.subtitle}
                  </p>
                  <div className="flex items-center gap-1 pt-2">
                    {stat.trendUp && (
                      <TrendingUp className="h-3 w-3 text-green-500" />
                    )}
                    <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                      {stat.trend}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Metrics Banner */}
        <Card className="border-0 shadow-xl bg-gradient-to-r from-red-600 to-red-700 text-white relative overflow-hidden animate-fade-in-up animation-delay-500">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full" />
          <CardContent className="relative p-8">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-6 w-6 animate-pulse" />
                  <h3 className="text-2xl font-bold">Performance Snapshot 📊</h3>
                </div>
                <p className="text-white/90">
                  Your athletic journey at a glance - keep pushing those limits!
                </p>
              </div>
              
              <div className="grid grid-cols-3 gap-8 text-center">
                <div className="space-y-1">
                  <div className="text-3xl font-bold animate-pulse">2.4s</div>
                  <div className="text-sm text-white/80">40-Yard Dash</div>
                </div>
                <div className="space-y-1">
                  <div className="text-3xl font-bold animate-pulse">315</div>
                  <div className="text-sm text-white/80">Bench Press</div>
                </div>
                <div className="space-y-1">
                  <div className="text-3xl font-bold animate-pulse">96%</div>
                  <div className="text-sm text-white/80">Overall Score</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Analytics Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Performance Trend Chart */}
          <Card className="lg:col-span-2 border-0 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl animate-fade-in-up animation-delay-600">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-red-600 to-red-700 text-white">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Performance Trends</CardTitle>
                    <CardDescription>6-month progress overview</CardDescription>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="group">
                  View Details
                  <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData}>
                    <defs>
                      <linearGradient id="overallGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#dc2626" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#dc2626" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="speedGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7c2d12" stopOpacity={0.6}/>
                        <stop offset="95%" stopColor="#7c2d12" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" className="text-gray-600 dark:text-gray-400" />
                    <YAxis className="text-gray-600 dark:text-gray-400" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="overall"
                      stroke="#dc2626"
                      strokeWidth={3}
                      fill="url(#overallGradient)"
                      name="Overall Score"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Achievement Progress */}
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl animate-fade-in-up animation-delay-700">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 text-white">
                  <Trophy className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-xl">Achievements</CardTitle>
                  <CardDescription>Progress tracking</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {achievements.map((achievement, index) => (
                <div key={achievement.name} className="group space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{achievement.icon}</span>
                      <span className="font-medium text-sm">{achievement.name}</span>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {achievement.progress}%
                    </span>
                  </div>
                  <div className="relative">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`bg-gradient-to-r ${achievement.color} h-2 rounded-full transition-all duration-1000 ease-out`}
                        style={{ 
                          width: `${achievement.progress}%`,
                          animationDelay: `${index * 200}ms`
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Training Analytics */}
        <div className="grid gap-6 lg:grid-cols-4">
          {/* Weekly Activity */}
          <Card className="lg:col-span-2 border-0 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl animate-fade-in-up animation-delay-800">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-xl">Weekly Activity</CardTitle>
                  <CardDescription>Training hours and intensity</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="day" className="text-gray-600 dark:text-gray-400" />
                    <YAxis className="text-gray-600 dark:text-gray-400" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Bar dataKey="hours" fill="#dc2626" name="Hours" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Training Distribution */}
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl animate-fade-in-up animation-delay-900">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-purple-600 to-purple-700 text-white">
                  <Target className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">Training Focus</CardTitle>
                  <CardDescription>Distribution breakdown</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={trainingData}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {trainingData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-4">
                {trainingData.map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span>{item.name}</span>
                    </div>
                    <span className="font-medium">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Circles */}
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl animate-fade-in-up animation-delay-1000">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-green-600 to-green-700 text-white">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">Current Stats</CardTitle>
                  <CardDescription>Live performance</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center">
                <ProgressCircle 
                  value={96} 
                  size="sm" 
                  label="Overall"
                  className="mb-4"
                />
                <div className="grid grid-cols-2 gap-4 w-full">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">A+</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Grade</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">12</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Rank</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Upcoming Sessions */}
          <Card className="lg:col-span-2 border-0 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl animate-fade-in-up animation-delay-400">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-slate-600 text-white">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Upcoming Sessions</CardTitle>
                    <CardDescription>Your scheduled workouts</CardDescription>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="group">
                  View All
                  <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingSessions.map((session, index) => (
                <div
                  key={session.id}
                  className={cn(
                    "group relative p-4 rounded-xl",
                    "bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-750",
                    "hover:from-red-50/50 hover:to-red-100/50 dark:hover:from-red-950/20 dark:hover:to-red-900/20",
                    "transition-all duration-300 cursor-pointer",
                    "hover:shadow-lg hover:-translate-y-1"
                  )}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-white font-bold">
                          {session.coach.split(' ').map(n => n[0]).join('')}
                        </div>
                        {session.status === 'confirmed' && (
                          <CheckCircle2 className="absolute -bottom-1 -right-1 h-4 w-4 text-green-500 bg-white dark:bg-gray-900 rounded-full" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {session.type}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          with {session.coach}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {session.time}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {session.date} · {session.duration}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" variant="ghost" className="group/btn">
                      <Play className="h-3 w-3 mr-1 group-hover/btn:scale-125 transition-transform" />
                      Join
                    </Button>
                    <Button size="sm" variant="ghost">
                      Reschedule
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Progress Overview */}
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl animate-fade-in-up animation-delay-600">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-slate-600 text-white">
                  <Trophy className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-xl">Your Progress</CardTitle>
                  <CardDescription>Keep up the momentum!</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Circular Progress */}
              <div className="relative mx-auto w-48 h-48">
                <svg className="w-48 h-48 transform -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    className="text-gray-200 dark:text-gray-700"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="url(#gradient)"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 88}`}
                    strokeDashoffset={`${2 * Math.PI * 88 * (1 - progressValue / 100)}`}
                    className="transition-all duration-1000 ease-out"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#475569" />
                      <stop offset="100%" stopColor="#334155" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-slate-700 dark:text-slate-300">
                    {progressValue}%
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Complete</span>
                </div>
              </div>

              {/* Goals List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50/50 dark:bg-gray-800/30">
                  <div className="flex items-center gap-2">
                    <Timer className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                    <span className="text-sm font-medium">Sub 4.5s 40-yard dash</span>
                  </div>
                  <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">85%</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50/50 dark:bg-gray-800/30">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                    <span className="text-sm font-medium">35" vertical jump</span>
                  </div>
                  <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">70%</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50/50 dark:bg-gray-800/30">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                    <span className="text-sm font-medium">20+ bench press reps</span>
                  </div>
                  <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">60%</span>
                </div>
              </div>

              <Button className="w-full bg-slate-600 hover:bg-slate-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                <Award className="mr-2 h-4 w-4" />
                View All Goals
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            Quick Actions
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {quickActions.map((action, index) => (
              <Link key={action.title} href={action.href}>
                <Card
                  className={cn(
                    "group cursor-pointer border-0 shadow-lg",
                    "hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02]",
                    "transition-all duration-300",
                    "bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl",
                    "animate-fade-in-up"
                  )}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                <CardContent className="p-6">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center text-white mb-4",
                    "group-hover:scale-110 group-hover:rotate-6 transition-all duration-300",
                    action.color
                  )}>
                    <action.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {action.description}
                  </p>
                  <ChevronRight className="h-4 w-4 text-gray-400 mt-3 group-hover:translate-x-2 transition-transform" />
                </CardContent>
              </Card>
              </Link>
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
                  <h3 className="text-2xl font-bold">You're gaining momentum! 🚀</h3>
                </div>
                <p className="text-white/90">
                  {streakDays} day performance tracking streak! Recruiters love consistent athletes.
                </p>
                <div className="flex gap-3 mt-4">
                  <Button 
                    variant="secondary" 
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                  >
                    View Profile
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="text-white hover:bg-white/20"
                  >
                    Share Progress
                  </Button>
                </div>
              </div>
              <div className="hidden md:block">
                <Trophy className="h-24 w-24 text-white/20" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
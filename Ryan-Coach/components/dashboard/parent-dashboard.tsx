'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { UltimateBackground } from '@/components/ui/ultimate-background'
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  Shield,
  Heart,
  Activity,
  Clock,
  Award,
  BookOpen,
  Target,
  MessageSquare,
  Bell,
  Eye,
  UserCheck,
  Star,
  Trophy,
  AlertCircle,
  CheckCircle2,
  DollarSign
} from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts'

// Mock data for parent analytics
const childProgress = [
  { month: 'Jan', performance: 72, training: 65, academic: 85 },
  { month: 'Feb', performance: 76, training: 68, academic: 88 },
  { month: 'Mar', performance: 74, training: 70, academic: 87 },
  { month: 'Apr', performance: 82, training: 75, academic: 89 },
  { month: 'May', performance: 85, training: 78, academic: 91 },
  { month: 'Jun', performance: 89, training: 82, academic: 93 }
]

const activityBreakdown = [
  { activity: 'Training', hours: 45, color: '#dc2626' },
  { activity: 'Games', hours: 12, color: '#b91c1c' },
  { activity: 'Academic', hours: 25, color: '#991b1b' },
  { activity: 'Recovery', hours: 8, color: '#7f1d1d' }
]

const expenses = [
  { category: 'Coaching', amount: 450 },
  { category: 'Equipment', amount: 280 },
  { category: 'Travel', amount: 320 },
  { category: 'Training', amount: 190 }
]

const recentActivities = [
  { type: 'training', message: 'Alex completed strength training session', time: '2 hours ago', status: 'completed' },
  { type: 'academic', message: 'Report card available for review', time: '1 day ago', status: 'new' },
  { type: 'payment', message: 'Coach payment processed - $150', time: '2 days ago', status: 'completed' },
  { type: 'message', message: 'New message from Coach Martinez', time: '3 days ago', status: 'unread' },
  { type: 'achievement', message: 'Alex achieved new personal best!', time: '1 week ago', status: 'celebration' }
]

const upcomingEvents = [
  { title: 'Parent-Coach Meeting', date: 'Today, 4:00 PM', type: 'meeting' },
  { title: 'Championship Game', date: 'Saturday, 10:00 AM', type: 'game' },
  { title: 'Performance Review', date: 'Next Monday, 6:00 PM', type: 'review' },
  { title: 'Training Camp Payment Due', date: 'Next Friday', type: 'payment' }
]

export function ParentDashboard() {
  const [selectedChild] = useState('Alex Thompson')
  
  return (
    <div className="relative min-h-screen">
      <UltimateBackground className="fixed inset-0" />
      
      <div className="relative z-10 p-6 space-y-8">
        {/* Header Section */}
        <div className="backdrop-blur-sm bg-white/10 dark:bg-black/10 rounded-2xl border border-white/20 p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 via-red-500 to-red-700 bg-clip-text text-transparent">
                Family Athletic Journey
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
                Supporting {selectedChild}'s athletic development
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="bg-white/80 dark:bg-black/80 backdrop-blur-sm">
                Active Consent Valid
              </Badge>
              <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800">
                <MessageSquare className="h-4 w-4 mr-2" />
                Contact Coach
              </Button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="backdrop-blur-sm bg-white/10 dark:bg-black/10 border-white/20 hover:bg-white/20 dark:hover:bg-black/20 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Overall Progress</p>
                  <p className="text-3xl font-bold text-red-600">89%</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +7% this month
                  </p>
                </div>
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                  <Target className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/10 dark:bg-black/10 border-white/20 hover:bg-white/20 dark:hover:bg-black/20 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Training Sessions</p>
                  <p className="text-3xl font-bold text-red-600">24</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    This month
                  </p>
                </div>
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                  <Activity className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/10 dark:bg-black/10 border-white/20 hover:bg-white/20 dark:hover:bg-black/20 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Academic Performance</p>
                  <p className="text-3xl font-bold text-red-600">3.8</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <Trophy className="h-3 w-3 mr-1" />
                    Dean's List
                  </p>
                </div>
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                  <BookOpen className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/10 dark:bg-black/10 border-white/20 hover:bg-white/20 dark:hover:bg-black/20 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Investment</p>
                  <p className="text-3xl font-bold text-red-600">$1,240</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Coaching & Development
                  </p>
                </div>
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                  <DollarSign className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Progress Tracking Chart */}
          <Card className="backdrop-blur-sm bg-white/10 dark:bg-black/10 border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <TrendingUp className="h-5 w-5 text-red-600" />
                Development Progress Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={childProgress}>
                  <defs>
                    <linearGradient id="performanceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#dc2626" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#dc2626" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="trainingGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#b91c1c" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#b91c1c" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="academicGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#991b1b" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#991b1b" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Area
                    type="monotone"
                    dataKey="performance"
                    stroke="#dc2626"
                    fillOpacity={1}
                    fill="url(#performanceGradient)"
                    name="Performance"
                  />
                  <Area
                    type="monotone"
                    dataKey="academic"
                    stroke="#991b1b"
                    fillOpacity={1}
                    fill="url(#academicGradient)"
                    name="Academic"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Activity Time Distribution */}
          <Card className="backdrop-blur-sm bg-white/10 dark:bg-black/10 border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <Clock className="h-5 w-5 text-red-600" />
                Weekly Time Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={activityBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="hours"
                  >
                    {activityBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {activityBreakdown.map((activity, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: activity.color }}
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {activity.activity}: {activity.hours}h
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upcoming Events */}
          <Card className="backdrop-blur-sm bg-white/10 dark:bg-black/10 border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <Calendar className="h-5 w-5 text-red-600" />
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-white/5 dark:bg-black/20 hover:bg-white/10 dark:hover:bg-black/30 transition-colors">
                  <div className={`p-2 rounded-full ${
                    event.type === 'game' ? 'bg-green-100 dark:bg-green-900/30' :
                    event.type === 'payment' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                    'bg-red-100 dark:bg-red-900/30'
                  }`}>
                    {event.type === 'game' ? <Trophy className="h-4 w-4 text-green-600" /> :
                     event.type === 'payment' ? <DollarSign className="h-4 w-4 text-yellow-600" /> :
                     event.type === 'review' ? <Eye className="h-4 w-4 text-red-600" /> :
                     <Users className="h-4 w-4 text-red-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm text-gray-900 dark:text-white">{event.title}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{event.date}</p>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-4">
                <Calendar className="h-4 w-4 mr-2" />
                View Full Calendar
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card className="backdrop-blur-sm bg-white/10 dark:bg-black/10 border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <Bell className="h-5 w-5 text-red-600" />
                Recent Activities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-white/5 dark:bg-black/20">
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    activity.status === 'completed' ? 'bg-green-500' :
                    activity.status === 'new' || activity.status === 'unread' ? 'bg-red-500' :
                    activity.status === 'celebration' ? 'bg-yellow-500' : 'bg-gray-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 dark:text-white font-medium">
                      {activity.message}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-4">
                <Activity className="h-4 w-4 mr-2" />
                View All Activity
              </Button>
            </CardContent>
          </Card>

          {/* Investment Tracking */}
          <Card className="backdrop-blur-sm bg-white/10 dark:bg-black/10 border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <DollarSign className="h-5 w-5 text-red-600" />
                Investment Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {expenses.map((expense, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/5 dark:bg-black/20">
                    <span className="font-medium text-gray-900 dark:text-white text-sm">
                      {expense.category}
                    </span>
                    <span className="font-bold text-red-600">${expense.amount}</span>
                  </div>
                ))}
                <div className="border-t border-white/10 pt-4 mt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900 dark:text-white">Total Monthly</span>
                    <span className="font-bold text-red-600 text-lg">
                      ${expenses.reduce((sum, exp) => sum + exp.amount, 0)}
                    </span>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">
                <Eye className="h-4 w-4 mr-2" />
                Detailed Reports
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Parental Controls & Consent Management */}
        <Card className="backdrop-blur-sm bg-white/10 dark:bg-black/10 border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <Shield className="h-5 w-5 text-red-600" />
              Parental Controls & Privacy Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 rounded-lg bg-white/5 dark:bg-black/20">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="font-medium text-gray-900 dark:text-white">Profile Visibility</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Control what information recruiters can see
                </p>
                <Button size="sm" variant="outline">Manage Settings</Button>
              </div>
              
              <div className="p-4 rounded-lg bg-white/5 dark:bg-black/20">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="font-medium text-gray-900 dark:text-white">Communication</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Monitor all coach and recruiter interactions
                </p>
                <Button size="sm" variant="outline">View Messages</Button>
              </div>
              
              <div className="p-4 rounded-lg bg-white/5 dark:bg-black/20">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="font-medium text-gray-900 dark:text-white">Consent Status</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  All permissions current and valid
                </p>
                <Button size="sm" variant="outline">Update Consent</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
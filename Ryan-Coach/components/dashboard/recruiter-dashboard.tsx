'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { UltimateBackground } from '@/components/ui/ultimate-background'
import { 
  Users, 
  Search, 
  Star, 
  TrendingUp, 
  Calendar,
  MapPin,
  Trophy,
  Filter,
  Bookmark,
  MessageSquare,
  Target,
  Award,
  Activity,
  UserCheck,
  Bell,
  Eye
} from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar } from 'recharts'

// Mock data for recruiter analytics
const searchTrends = [
  { month: 'Jan', searches: 45, discoveries: 12, contacts: 8 },
  { month: 'Feb', searches: 52, discoveries: 18, contacts: 14 },
  { month: 'Mar', searches: 38, discoveries: 15, contacts: 11 },
  { month: 'Apr', searches: 61, discoveries: 22, contacts: 18 },
  { month: 'May', searches: 55, discoveries: 19, contacts: 15 },
  { month: 'Jun', searches: 67, discoveries: 28, contacts: 23 }
]

const athletePositions = [
  { position: 'QB', count: 15, color: '#dc2626' },
  { position: 'RB', count: 28, color: '#b91c1c' },
  { position: 'WR', count: 45, color: '#991b1b' },
  { position: 'TE', count: 22, color: '#7f1d1d' },
  { position: 'OL', count: 35, color: '#450a0a' },
  { position: 'DL', count: 30, color: '#dc2626' }
]

const regionPerformance = [
  { region: 'West Coast', athletes: 85, quality: 90, competition: 95 },
  { region: 'East Coast', athletes: 75, quality: 85, competition: 88 },
  { region: 'Midwest', athletes: 65, quality: 80, competition: 75 },
  { region: 'South', athletes: 95, quality: 88, competition: 92 },
  { region: 'Southwest', athletes: 70, quality: 82, competition: 80 }
]

const topAthletes = [
  { name: 'Marcus Johnson', position: 'QB', rating: 98, school: 'Lincoln High', grad: 2025 },
  { name: 'Sarah Williams', position: 'WR', rating: 95, school: 'Central Academy', grad: 2024 },
  { name: 'David Chen', position: 'RB', rating: 93, school: 'Oak Valley High', grad: 2025 },
  { name: 'Emily Rodriguez', position: 'TE', rating: 91, school: 'Mountain View', grad: 2024 },
  { name: 'Alex Thompson', position: 'OL', rating: 89, school: 'Riverside Prep', grad: 2026 }
]

const recentActivity = [
  { action: 'Saved athlete profile', athlete: 'Marcus Johnson', time: '2 hours ago' },
  { action: 'Sent message', athlete: 'Sarah Williams', time: '4 hours ago' },
  { action: 'Updated search filter', detail: 'QB, Class of 2025', time: '6 hours ago' },
  { action: 'Viewed highlight reel', athlete: 'David Chen', time: '1 day ago' },
  { action: 'Added to watch list', athlete: 'Emily Rodriguez', time: '2 days ago' }
]

export function RecruiterDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="relative min-h-screen">
      <UltimateBackground className="fixed inset-0" />
      
      <div className="relative z-10 p-6 space-y-8">
        {/* Header Section */}
        <div className="backdrop-blur-sm bg-white/10 dark:bg-black/10 rounded-2xl border border-white/20 p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 via-red-500 to-red-700 bg-clip-text text-transparent">
                Recruiting Command Center
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
                Discover, analyze, and recruit top athletic talent
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search athletes, schools, positions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-80 backdrop-blur-sm bg-white/80 dark:bg-black/80"
                />
              </div>
              <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800">
                <Filter className="h-4 w-4 mr-2" />
                Advanced Search
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
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Prospects</p>
                  <p className="text-3xl font-bold text-red-600">127</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +12% this month
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
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">This Month Contacts</p>
                  <p className="text-3xl font-bold text-red-600">23</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +8% vs last month
                  </p>
                </div>
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                  <MessageSquare className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/10 dark:bg-black/10 border-white/20 hover:bg-white/20 dark:hover:bg-black/20 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Response Rate</p>
                  <p className="text-3xl font-bold text-red-600">74%</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +5% improvement
                  </p>
                </div>
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                  <UserCheck className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/10 dark:bg-black/10 border-white/20 hover:bg-white/20 dark:hover:bg-black/20 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Commits This Year</p>
                  <p className="text-3xl font-bold text-red-600">8</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <Trophy className="h-3 w-3 mr-1" />
                    Above target
                  </p>
                </div>
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                  <Award className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recruiting Activity Chart */}
          <Card className="backdrop-blur-sm bg-white/10 dark:bg-black/10 border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <Activity className="h-5 w-5 text-red-600" />
                Recruiting Activity Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={searchTrends}>
                  <defs>
                    <linearGradient id="searchGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#dc2626" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#dc2626" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="discoveryGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#b91c1c" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#b91c1c" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Area
                    type="monotone"
                    dataKey="searches"
                    stroke="#dc2626"
                    fillOpacity={1}
                    fill="url(#searchGradient)"
                    name="Searches"
                  />
                  <Area
                    type="monotone"
                    dataKey="discoveries"
                    stroke="#b91c1c"
                    fillOpacity={1}
                    fill="url(#discoveryGradient)"
                    name="Discoveries"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Position Distribution */}
          <Card className="backdrop-blur-sm bg-white/10 dark:bg-black/10 border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <Users className="h-5 w-5 text-red-600" />
                Prospect Position Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={athletePositions}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="count"
                  >
                    {athletePositions.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {athletePositions.map((position, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: position.color }}
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {position.position}: {position.count}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Regional Performance Radar */}
          <Card className="backdrop-blur-sm bg-white/10 dark:bg-black/10 border-white/20 lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <MapPin className="h-5 w-5 text-red-600" />
                Regional Recruiting Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={regionPerformance}>
                  <PolarGrid stroke="rgba(255,255,255,0.2)" />
                  <PolarAngleAxis dataKey="region" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                  <PolarRadiusAxis 
                    angle={90} 
                    domain={[0, 100]} 
                    tick={{ fill: '#9CA3AF', fontSize: 10 }}
                  />
                  <Radar
                    name="Athletes"
                    dataKey="athletes"
                    stroke="#dc2626"
                    fill="#dc2626"
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                  <Radar
                    name="Quality"
                    dataKey="quality"
                    stroke="#b91c1c"
                    fill="#b91c1c"
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                  <Radar
                    name="Competition"
                    dataKey="competition"
                    stroke="#991b1b"
                    fill="#991b1b"
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Prospects */}
          <Card className="backdrop-blur-sm bg-white/10 dark:bg-black/10 border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <Star className="h-5 w-5 text-red-600" />
                Top Prospects
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {topAthletes.map((athlete, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/5 dark:bg-black/20 hover:bg-white/10 dark:hover:bg-black/30 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {athlete.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">{athlete.name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{athlete.school} • Class of {athlete.grad}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs">
                      {athlete.position}
                    </Badge>
                    <p className="text-sm font-bold text-red-600 mt-1">{athlete.rating}</p>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-4">
                <Eye className="h-4 w-4 mr-2" />
                View All Prospects
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity Feed */}
        <Card className="backdrop-blur-sm bg-white/10 dark:bg-black/10 border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <Bell className="h-5 w-5 text-red-600" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-white/5 dark:bg-black/20 hover:bg-white/10 dark:hover:bg-black/30 transition-colors">
                  <div className="w-2 h-2 bg-red-600 rounded-full flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 dark:text-white">
                      <span className="font-medium">{activity.action}</span>
                      {activity.athlete && (
                        <>
                          {' '}for{' '}
                          <span className="font-medium text-red-600">{activity.athlete}</span>
                        </>
                      )}
                      {activity.detail && (
                        <>
                          {': '}
                          <span className="text-gray-600 dark:text-gray-400">{activity.detail}</span>
                        </>
                      )}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
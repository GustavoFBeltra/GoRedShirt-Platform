'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { UltimateBackground } from '@/components/ui/ultimate-background'
import Link from 'next/link'
import { 
  Users, 
  DollarSign, 
  Calendar, 
  Shield, 
  TrendingUp, 
  AlertTriangle,
  Activity,
  Settings,
  Database,
  ChevronRight,
  Eye,
  UserCheck,
  CreditCard,
  BarChart3,
  Globe,
  Zap,
  Award,
  MessageSquare,
  FileText,
  Clock,
  CheckCircle2,
  Star
} from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import { useAuth } from '@/lib/auth/context'
import { createClient } from '@/lib/supabase/client'

// Platform overview data
const platformGrowthData = [
  { month: 'Jan', users: 1240, coaches: 89, revenue: 45000, sessions: 1850 },
  { month: 'Feb', users: 1480, coaches: 102, revenue: 52000, sessions: 2100 },
  { month: 'Mar', users: 1720, coaches: 118, revenue: 58000, sessions: 2350 },
  { month: 'Apr', users: 2100, coaches: 134, revenue: 67000, sessions: 2800 },
  { month: 'May', users: 2580, coaches: 156, revenue: 78000, sessions: 3200 },
  { month: 'Jun', users: 3200, coaches: 180, revenue: 92000, sessions: 3800 },
]

// User distribution data
const userTypeData = [
  { name: 'Athletes', value: 65, color: '#dc2626' },
  { name: 'Coaches', value: 20, color: '#059669' },
  { name: 'Recruiters', value: 12, color: '#2563eb' },
  { name: 'Parents', value: 3, color: '#7c3aed' },
]

// Platform health metrics
const platformHealthData = [
  { metric: 'Performance', score: 95, benchmark: 90 },
  { metric: 'Security', score: 98, benchmark: 95 },
  { metric: 'User Satisfaction', score: 92, benchmark: 85 },
  { metric: 'Platform Stability', score: 97, benchmark: 92 },
  { metric: 'Data Quality', score: 89, benchmark: 88 },
]

// Recent admin activities
const recentActivities = [
  { id: 1, action: 'User verification approved', user: 'Sarah Johnson', time: '10 minutes ago', type: 'success' },
  { id: 2, action: 'Payment dispute resolved', user: 'Mike Davis', time: '25 minutes ago', type: 'info' },
  { id: 3, action: 'Coach profile suspended', user: 'Alex Turner', time: '1 hour ago', type: 'warning' },
  { id: 4, action: 'System backup completed', user: 'System', time: '2 hours ago', type: 'success' },
  { id: 5, action: 'New feature deployed', user: 'Dev Team', time: '3 hours ago', type: 'info' },
]

// Top performing coaches
const topCoaches = [
  { id: 1, name: 'Jennifer Smith', rating: 4.9, clients: 28, revenue: 8400 },
  { id: 2, name: 'Marcus Johnson', rating: 4.8, clients: 24, revenue: 7200 },
  { id: 3, name: 'Emily Davis', rating: 4.9, clients: 22, revenue: 6800 },
]

export function AdminDashboard() {
  const { user } = useAuth()
  const [platformStats, setPlatformStats] = useState({
    totalUsers: 3200,
    totalCoaches: 180,
    totalRevenue: 92000,
    monthlyGrowth: 18.5,
    activeSession: 45,
    systemHealth: 97
  })
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const currentMonth = platformGrowthData[platformGrowthData.length - 1]

  return (
    <>
      <UltimateBackground />
      <div className="relative z-10 space-y-8 p-8 min-h-screen">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-red-600 dark:from-gray-100 dark:to-red-400 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Platform overview and management controls
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <FileText className="h-4 w-4" />
              Reports
            </Button>
            <Button variant="outline" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Support
              <Badge variant="destructive" className="ml-1">12</Badge>
            </Button>
            <Button className="gap-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>

        {/* Key Platform Metrics */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
              <Users className="h-5 w-5 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{platformStats.totalUsers.toLocaleString()}</div>
              <div className="flex items-center gap-2 mt-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <p className="text-xs text-green-600 font-medium">+{platformStats.monthlyGrowth}% this month</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Platform Revenue</CardTitle>
              <DollarSign className="h-5 w-5 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">${(platformStats.totalRevenue).toLocaleString()}</div>
              <div className="flex items-center gap-2 mt-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <p className="text-xs text-green-600 font-medium">+22% from last month</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Sessions</CardTitle>
              <Activity className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{platformStats.activeSession}</div>
              <div className="flex items-center gap-2 mt-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <p className="text-xs text-muted-foreground">Live now</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">System Health</CardTitle>
              <Shield className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{platformStats.systemHealth}%</div>
              <Progress value={platformStats.systemHealth} className="mt-3 h-2" />
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Platform Growth Chart */}
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Platform Growth</CardTitle>
                <Button variant="ghost" size="sm" className="gap-1">
                  View Details
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>User acquisition and revenue growth over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={platformGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                      border: 'none', 
                      borderRadius: '8px',
                      color: 'white'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="users" 
                    stroke="#dc2626" 
                    fill="url(#colorUsers)" 
                    strokeWidth={2}
                  />
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#dc2626" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* User Distribution */}
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>User Distribution</CardTitle>
                <Badge variant="secondary">Live Data</Badge>
              </div>
              <CardDescription>Breakdown of platform users by type</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={userTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {userTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                      border: 'none', 
                      borderRadius: '8px',
                      color: 'white'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {userTypeData.map((type) => (
                  <div key={type.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: type.color }} />
                    <span className="text-sm text-muted-foreground">{type.name}</span>
                    <span className="text-sm font-bold ml-auto">{type.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Management Sections */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent Admin Activities */}
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-red-600" />
                  Recent Activities
                </CardTitle>
                <Button variant="ghost" size="sm">View All</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50/50 dark:bg-gray-800/50 hover:bg-gray-100/50 dark:hover:bg-gray-800 transition-colors">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'success' ? 'bg-green-500' :
                    activity.type === 'info' ? 'bg-blue-500' :
                    activity.type === 'warning' ? 'bg-amber-500' : 'bg-gray-400'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium">{activity.action}</span>
                      {activity.user !== 'System' && activity.user !== 'Dev Team' && (
                        <span className="text-muted-foreground"> - {activity.user}</span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Top Performing Coaches */}
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-500" />
                Top Coaches
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {topCoaches.map((coach, index) => (
                <div key={coach.id} className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-red-600 text-white text-sm font-bold">
                    {index + 1}
                  </div>
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-gradient-to-br from-gray-500 to-gray-600 text-white">
                      {coach.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{coach.name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                        <span>{coach.rating}</span>
                      </div>
                      <span>•</span>
                      <span>{coach.clients} clients</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">${coach.revenue.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">monthly</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Platform Health Radar */}
        <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Platform Health Metrics</CardTitle>
                <CardDescription>System performance and quality indicators</CardDescription>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-600" />
                  <span className="text-sm">Current</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-400" />
                  <span className="text-sm">Benchmark</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={platformHealthData}>
                <PolarGrid strokeDasharray="3 3" />
                <PolarAngleAxis dataKey="metric" className="text-xs" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar name="Current" dataKey="score" stroke="#dc2626" fill="#dc2626" fillOpacity={0.3} />
                <Radar name="Benchmark" dataKey="benchmark" stroke="#9ca3af" fill="#9ca3af" fillOpacity={0.3} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Quick Admin Actions */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <UserCheck className="h-8 w-8 text-blue-500 group-hover:scale-110 transition-transform" />
                <Badge variant="destructive">8 Pending</Badge>
              </div>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Approve accounts and manage user roles</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Review Pending
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CreditCard className="h-8 w-8 text-emerald-500 group-hover:scale-110 transition-transform" />
                <Badge variant="secondary">$12K</Badge>
              </div>
              <CardTitle>Payment Processing</CardTitle>
              <CardDescription>Monitor transactions and resolve disputes</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                View Transactions
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Database className="h-8 w-8 text-purple-500 group-hover:scale-110 transition-transform" />
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="text-xs text-green-600">Healthy</span>
                </div>
              </div>
              <CardTitle>System Monitor</CardTitle>
              <CardDescription>Server performance and database health</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                View Metrics
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <BarChart3 className="h-8 w-8 text-amber-500 group-hover:scale-110 transition-transform" />
                <Badge variant="outline">New</Badge>
              </div>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>Generate reports and insights</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Create Report
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
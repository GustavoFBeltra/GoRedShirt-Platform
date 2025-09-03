'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'
import { 
  Users, 
  DollarSign, 
  Calendar, 
  Star, 
  TrendingUp, 
  Clock,
  Activity,
  Target,
  Award,
  ChevronRight,
  MessageSquare,
  Video,
  BarChart3,
  Zap
} from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import { useAuth } from '@/lib/auth/context'
import { createClient } from '@/lib/supabase/client'

// Mock data for revenue chart
const revenueData = [
  { month: 'Jan', revenue: 2400, clients: 8 },
  { month: 'Feb', revenue: 3200, clients: 10 },
  { month: 'Mar', revenue: 2800, clients: 9 },
  { month: 'Apr', revenue: 3600, clients: 12 },
  { month: 'May', revenue: 4200, clients: 14 },
  { month: 'Jun', revenue: 4800, clients: 16 },
]

// Mock data for session distribution
const sessionTypeData = [
  { name: 'Strength Training', value: 35, color: '#dc2626' },
  { name: 'Sports Performance', value: 30, color: '#059669' },
  { name: 'Rehabilitation', value: 20, color: '#2563eb' },
  { name: 'Nutrition', value: 15, color: '#7c3aed' },
]

// Mock data for client progress
const clientProgressData = [
  { metric: 'Strength', coach: 85, average: 70 },
  { metric: 'Endurance', coach: 78, average: 65 },
  { metric: 'Flexibility', coach: 72, average: 60 },
  { metric: 'Speed', coach: 80, average: 68 },
  { metric: 'Recovery', coach: 88, average: 72 },
]

// Mock upcoming sessions
const upcomingSessions = [
  { id: 1, client: 'Sarah Johnson', time: '9:00 AM', type: 'Strength Training', duration: '60 min' },
  { id: 2, client: 'Mike Davis', time: '10:30 AM', type: 'Sports Performance', duration: '45 min' },
  { id: 3, client: 'Emma Wilson', time: '2:00 PM', type: 'Rehabilitation', duration: '60 min' },
]

// Mock recent client activity
const recentActivity = [
  { id: 1, client: 'Sarah Johnson', action: 'Completed workout', time: '2 hours ago', type: 'success' },
  { id: 2, client: 'Mike Davis', action: 'Submitted progress photos', time: '4 hours ago', type: 'info' },
  { id: 3, client: 'Emma Wilson', action: 'Scheduled next session', time: '6 hours ago', type: 'default' },
  { id: 4, client: 'John Smith', action: 'Achieved PR in deadlift', time: '1 day ago', type: 'success' },
]

export function CoachDashboard() {
  const { user } = useAuth()
  const [coachProfile, setCoachProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchCoachProfile = async () => {
      if (!user?.id) return

      try {
        const { data, error } = await supabase
          .from('coach_profiles')
          .select('*, users(name, email)')
          .eq('user_id', user.id)
          .single()

        if (error) throw error
        setCoachProfile(data)
      } catch (error) {
        console.error('Error fetching coach profile:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCoachProfile()
  }, [user])

  const totalRevenue = revenueData.reduce((sum, month) => sum + month.revenue, 0)
  const averageRating = 4.8
  const completionRate = 92

  return (
    <div className="space-y-8 p-8 bg-gradient-to-br from-background via-background to-red-50/5 dark:to-red-950/5 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-red-600 dark:from-gray-100 dark:to-red-400 bg-clip-text text-transparent">
            Coach Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Welcome back! Here's your coaching overview
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Messages
            <Badge variant="destructive" className="ml-1">3</Badge>
          </Button>
          <Button variant="outline" className="gap-2">
            <Video className="h-4 w-4" />
            Start Session
          </Button>
          <Button className="gap-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600">
            <Calendar className="h-4 w-4" />
            Schedule Session
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Clients</CardTitle>
            <Users className="h-5 w-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">24</div>
            <div className="flex items-center gap-2 mt-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <p className="text-xs text-green-600 font-medium">+12% from last month</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-emerald-50 dark:from-gray-800 dark:to-emerald-950">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Revenue</CardTitle>
            <DollarSign className="h-5 w-5 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${coachProfile?.hourly_rate ? (coachProfile.hourly_rate * 32).toFixed(0) : '2,400'}</div>
            <div className="flex items-center gap-2 mt-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <p className="text-xs text-green-600 font-medium">+18% from last month</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-950">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completion Rate</CardTitle>
            <Target className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{completionRate}%</div>
            <Progress value={completionRate} className="mt-3 h-2" />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-amber-50 dark:from-gray-800 dark:to-amber-950">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Client Rating</CardTitle>
            <Star className="h-5 w-5 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{averageRating}</div>
            <div className="flex items-center gap-1 mt-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(averageRating) ? 'fill-amber-500 text-amber-500' : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="text-xs text-muted-foreground ml-1">(48 reviews)</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Chart */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Revenue & Client Growth</CardTitle>
              <Button variant="ghost" size="sm" className="gap-1">
                View Details
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription>Your earnings and client acquisition over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
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
                  dataKey="revenue" 
                  stroke="#dc2626" 
                  fill="url(#colorRevenue)" 
                  strokeWidth={2}
                />
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#dc2626" stopOpacity={0}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Session Types */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Session Distribution</CardTitle>
              <Badge variant="secondary">This Month</Badge>
            </div>
            <CardDescription>Breakdown of your coaching sessions by type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sessionTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {sessionTypeData.map((entry, index) => (
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
              {sessionTypeData.map((type) => (
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

      {/* Today's Schedule & Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Today's Sessions */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-red-600" />
                Today's Schedule
              </CardTitle>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingSessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-gradient-to-br from-red-500 to-red-600 text-white">
                      {session.client.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{session.client}</p>
                    <p className="text-sm text-muted-foreground">{session.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{session.time}</p>
                  <p className="text-sm text-muted-foreground">{session.duration}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600" />
                Recent Client Activity
              </CardTitle>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'success' ? 'bg-green-500' :
                  activity.type === 'info' ? 'bg-blue-500' : 'bg-gray-400'
                }`} />
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium">{activity.client}</span>
                    <span className="text-muted-foreground"> {activity.action}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Client Performance Comparison */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Client Performance Overview</CardTitle>
              <CardDescription>Average progress metrics compared to platform average</CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-600" />
                <span className="text-sm">Your Clients</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-400" />
                <span className="text-sm">Platform Average</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={clientProgressData}>
              <PolarGrid strokeDasharray="3 3" />
              <PolarAngleAxis dataKey="metric" className="text-xs" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar name="Your Clients" dataKey="coach" stroke="#dc2626" fill="#dc2626" fillOpacity={0.3} />
              <Radar name="Average" dataKey="average" stroke="#9ca3af" fill="#9ca3af" fillOpacity={0.3} />
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

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Award className="h-8 w-8 text-amber-500 group-hover:scale-110 transition-transform" />
              <Badge variant="secondary">Pro Tip</Badge>
            </div>
            <CardTitle>Complete Your Profile</CardTitle>
            <CardDescription>
              Add certifications and specializations to attract more clients
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={75} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">75% Complete</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
          <Link href="/dashboard/coach/pricing">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Zap className="h-8 w-8 text-purple-500 group-hover:scale-110 transition-transform" />
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
              <CardTitle>Optimize Pricing</CardTitle>
              <CardDescription>
                Review and adjust your session rates and packages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">${coachProfile?.hourly_rate || 75}/hour</p>
              <p className="text-xs text-muted-foreground">Current rate</p>
            </CardContent>
          </Link>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
          <Link href="/dashboard/coach/availability">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Calendar className="h-8 w-8 text-blue-500 group-hover:scale-110 transition-transform" />
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
              <CardTitle>Update Availability</CardTitle>
              <CardDescription>
                Open more time slots to increase booking opportunities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">18</p>
              <p className="text-xs text-muted-foreground">Available slots this week</p>
            </CardContent>
          </Link>
        </Card>
      </div>

      {/* Stripe Setup Reminder */}
      {!coachProfile?.stripe_onboarding_complete && (
        <Card className="border-0 shadow-lg bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-lg">
                  <DollarSign className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <CardTitle>Complete Payment Setup</CardTitle>
                  <CardDescription>
                    Set up Stripe to start receiving payments from clients
                  </CardDescription>
                </div>
              </div>
              <Link href="/dashboard/coach/stripe-onboarding">
                <Button className="bg-amber-600 hover:bg-amber-700">
                  Complete Setup
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardHeader>
        </Card>
      )}
    </div>
  )
}
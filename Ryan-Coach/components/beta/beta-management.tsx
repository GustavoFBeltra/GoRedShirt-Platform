'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Users, 
  UserPlus, 
  MessageCircle, 
  TrendingUp, 
  AlertCircle,
  CheckCircle2,
  Clock,
  Mail,
  Star,
  Trophy,
  Target,
  Send,
  Filter,
  Search,
  Download,
  RefreshCw
} from 'lucide-react'
import { format, formatDistanceToNow } from 'date-fns'

interface BetaUser {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'athlete' | 'coach' | 'recruiter' | 'parent'
  joinedAt: Date
  lastActive: Date
  onboardingCompleted: boolean
  onboardingProgress: number
  inviteStatus: 'pending' | 'accepted' | 'expired'
  engagementScore: number
  sessionsCompleted: number
  messagesExchanged: number
  feedbackGiven: boolean
  issues: string[]
  notes: string
}

interface BetaFeedback {
  id: string
  userId: string
  userName: string
  userRole: string
  category: 'bug' | 'feature' | 'usability' | 'performance' | 'general'
  priority: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  status: 'open' | 'in-progress' | 'resolved' | 'closed'
  submittedAt: Date
  resolvedAt?: Date
  tags: string[]
}

interface BetaInvite {
  email: string
  role: 'athlete' | 'coach' | 'recruiter' | 'parent'
  personalMessage?: string
}

export function BetaManagement() {
  const [betaUsers, setBetaUsers] = useState<BetaUser[]>([])
  const [feedback, setFeedback] = useState<BetaFeedback[]>([])
  const [selectedTab, setSelectedTab] = useState('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRole, setFilterRole] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [loading, setLoading] = useState(true)

  // Mock data - replace with real API calls
  const mockBetaUsers: BetaUser[] = [
    {
      id: '1',
      email: 'sarah.athlete@example.com',
      firstName: 'Sarah',
      lastName: 'Johnson',
      role: 'athlete',
      joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
      lastActive: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      onboardingCompleted: true,
      onboardingProgress: 100,
      inviteStatus: 'accepted',
      engagementScore: 85,
      sessionsCompleted: 3,
      messagesExchanged: 12,
      feedbackGiven: true,
      issues: [],
      notes: 'Highly engaged user, completed onboarding quickly'
    },
    {
      id: '2',
      email: 'mike.coach@example.com',
      firstName: 'Mike',
      lastName: 'Torres',
      role: 'coach',
      joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
      lastActive: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      onboardingCompleted: false,
      onboardingProgress: 60,
      inviteStatus: 'accepted',
      engagementScore: 45,
      sessionsCompleted: 1,
      messagesExchanged: 5,
      feedbackGiven: false,
      issues: ['Unable to upload profile photo'],
      notes: 'Needs help with profile setup'
    },
    {
      id: '3',
      email: 'recruiter@stanford.edu',
      firstName: 'Jennifer',
      lastName: 'Williams',
      role: 'recruiter',
      joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 7 days ago
      lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      onboardingCompleted: true,
      onboardingProgress: 100,
      inviteStatus: 'accepted',
      engagementScore: 70,
      sessionsCompleted: 0,
      messagesExchanged: 8,
      feedbackGiven: true,
      issues: [],
      notes: 'Active in messaging, looking for football prospects'
    }
  ]

  const mockFeedback: BetaFeedback[] = [
    {
      id: '1',
      userId: '1',
      userName: 'Sarah Johnson',
      userRole: 'athlete',
      category: 'usability',
      priority: 'medium',
      title: 'Message interface could be more intuitive',
      description: 'The messaging interface is a bit confusing when switching between conversations. Maybe add better visual indicators for unread messages.',
      status: 'in-progress',
      submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      tags: ['messaging', 'ui/ux']
    },
    {
      id: '2',
      userId: '2',
      userName: 'Mike Torres',
      userRole: 'coach',
      category: 'bug',
      priority: 'high',
      title: 'Profile photo upload fails',
      description: 'When trying to upload a profile photo, I get an error message and the upload doesn\'t work. Tried with both JPG and PNG files.',
      status: 'open',
      submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
      tags: ['profile', 'upload', 'bug']
    },
    {
      id: '3',
      userId: '3',
      userName: 'Jennifer Williams',
      userRole: 'recruiter',
      category: 'feature',
      priority: 'medium',
      title: 'Advanced search filters needed',
      description: 'Would love to have more advanced search filters for finding athletes, such as GPA, SAT scores, and specific athletic achievements.',
      status: 'open',
      submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
      tags: ['search', 'recruiting', 'enhancement']
    }
  ]

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setBetaUsers(mockBetaUsers)
      setFeedback(mockFeedback)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredUsers = betaUsers.filter(user => {
    const matchesSearch = searchQuery === '' || 
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesRole = filterRole === 'all' || user.role === filterRole
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'active' && user.onboardingCompleted) ||
      (filterStatus === 'onboarding' && !user.onboardingCompleted) ||
      (filterStatus === 'issues' && user.issues.length > 0)
    
    return matchesSearch && matchesRole && matchesStatus
  })

  const stats = {
    totalUsers: betaUsers.length,
    activeUsers: betaUsers.filter(u => u.onboardingCompleted).length,
    pendingOnboarding: betaUsers.filter(u => !u.onboardingCompleted).length,
    avgEngagement: betaUsers.length > 0 ? Math.round(betaUsers.reduce((sum, u) => sum + u.engagementScore, 0) / betaUsers.length) : 0,
    totalFeedback: feedback.length,
    openIssues: feedback.filter(f => f.status === 'open').length,
    criticalIssues: feedback.filter(f => f.priority === 'critical').length
  }

  const getEngagementColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800'
      case 'in-progress': return 'bg-blue-100 text-blue-800'
      case 'resolved': return 'bg-green-100 text-green-800'
      case 'closed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Beta User Management</h1>
        <p className="text-muted-foreground">
          Monitor and support your beta testing community
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-blue-600">{stats.totalUsers}</p>
                <p className="text-sm text-muted-foreground">Total Beta Users</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-600">{stats.activeUsers}</p>
                <p className="text-sm text-muted-foreground">Active Users</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-yellow-600">{stats.avgEngagement}%</p>
                <p className="text-sm text-muted-foreground">Avg Engagement</p>
              </div>
              <TrendingUp className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-red-600">{stats.openIssues}</p>
                <p className="text-sm text-muted-foreground">Open Issues</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users">Beta Users</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
          <TabsTrigger value="invites">Send Invites</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="all">All Roles</option>
              <option value="athlete">Athletes</option>
              <option value="coach">Coaches</option>
              <option value="recruiter">Recruiters</option>
              <option value="parent">Parents</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="onboarding">Onboarding</option>
              <option value="issues">Has Issues</option>
            </select>
          </div>

          {/* Users List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredUsers.map((user) => (
              <Card key={user.id}>
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <Avatar>
                      <AvatarFallback>{user.firstName[0]}{user.lastName[0]}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{user.firstName} {user.lastName}</h3>
                        <Badge variant="outline" className="capitalize">
                          {user.role}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>Onboarding Progress:</span>
                          <span>{user.onboardingProgress}%</span>
                        </div>
                        <Progress value={user.onboardingProgress} className="h-2" />
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span>Engagement Score:</span>
                        <span className={`font-semibold ${getEngagementColor(user.engagementScore)}`}>
                          {user.engagementScore}%
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center">
                          <div className="font-semibold">{user.sessionsCompleted}</div>
                          <div className="text-muted-foreground">Sessions</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold">{user.messagesExchanged}</div>
                          <div className="text-muted-foreground">Messages</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold">{user.issues.length}</div>
                          <div className="text-muted-foreground">Issues</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Joined {formatDistanceToNow(user.joinedAt, { addSuffix: true })}</span>
                        <span>Active {formatDistanceToNow(user.lastActive, { addSuffix: true })}</span>
                      </div>
                      
                      {user.issues.length > 0 && (
                        <div className="mt-2">
                          <div className="text-xs font-medium text-red-600 mb-1">Active Issues:</div>
                          <div className="space-y-1">
                            {user.issues.map((issue, index) => (
                              <div key={index} className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded">
                                {issue}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {user.notes && (
                        <div className="mt-2">
                          <div className="text-xs font-medium text-gray-600 mb-1">Notes:</div>
                          <div className="text-xs bg-gray-50 text-gray-700 px-2 py-1 rounded">
                            {user.notes}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-4">
          <div className="space-y-4">
            {feedback.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="font-semibold">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          by {item.userName} ({item.userRole}) • {formatDistanceToNow(item.submittedAt, { addSuffix: true })}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getPriorityColor(item.priority)}>
                          {item.priority}
                        </Badge>
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-sm">{item.description}</p>
                    
                    <div className="flex flex-wrap gap-1">
                      {item.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="invites" className="space-y-4">
          <InviteForm />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <BetaAnalytics users={betaUsers} feedback={feedback} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Invite Form Component
function InviteForm() {
  const [invites, setInvites] = useState<BetaInvite[]>([
    { email: '', role: 'athlete' }
  ])
  const [personalMessage, setPersonalMessage] = useState('')

  const addInvite = () => {
    setInvites([...invites, { email: '', role: 'athlete' }])
  }

  const updateInvite = (index: number, field: keyof BetaInvite, value: string) => {
    const updated = [...invites]
    updated[index] = { ...updated[index], [field]: value }
    setInvites(updated)
  }

  const removeInvite = (index: number) => {
    setInvites(invites.filter((_, i) => i !== index))
  }

  const sendInvites = () => {
    console.log('Sending invites:', invites, personalMessage)
    // Implement actual invite sending logic
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send Beta Invitations</CardTitle>
        <CardDescription>
          Invite new users to join the GoRedShirt beta program
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {invites.map((invite, index) => (
            <div key={index} className="flex items-center space-x-3">
              <Input
                placeholder="Email address"
                value={invite.email}
                onChange={(e) => updateInvite(index, 'email', e.target.value)}
                className="flex-1"
              />
              <select
                value={invite.role}
                onChange={(e) => updateInvite(index, 'role', e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="athlete">Athlete</option>
                <option value="coach">Coach</option>
                <option value="recruiter">Recruiter</option>
                <option value="parent">Parent</option>
              </select>
              {invites.length > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeInvite(index)}
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
        </div>
        
        <div className="flex justify-between">
          <Button variant="outline" onClick={addInvite}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Another
          </Button>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Personal Message (Optional)
          </label>
          <Textarea
            value={personalMessage}
            onChange={(e) => setPersonalMessage(e.target.value)}
            placeholder="Add a personal message to your invitation..."
            rows={4}
          />
        </div>
        
        <Button onClick={sendInvites} className="w-full">
          <Send className="h-4 w-4 mr-2" />
          Send Invitations
        </Button>
      </CardContent>
    </Card>
  )
}

// Analytics Component
function BetaAnalytics({ users, feedback }: { users: BetaUser[], feedback: BetaFeedback[] }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Onboarding</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Completed Onboarding</span>
                  <span>{users.filter(u => u.onboardingCompleted).length}/{users.length}</span>
                </div>
                <Progress value={(users.filter(u => u.onboardingCompleted).length / users.length) * 100} />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Average Progress</span>
                  <span>{Math.round(users.reduce((sum, u) => sum + u.onboardingProgress, 0) / users.length)}%</span>
                </div>
                <Progress value={users.reduce((sum, u) => sum + u.onboardingProgress, 0) / users.length} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Feedback Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Total Feedback</span>
                <Badge>{feedback.length}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Open Issues</span>
                <Badge variant="outline">{feedback.filter(f => f.status === 'open').length}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Critical Issues</span>
                <Badge className="bg-red-100 text-red-800">
                  {feedback.filter(f => f.priority === 'critical').length}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Feature Requests</span>
                <Badge className="bg-blue-100 text-blue-800">
                  {feedback.filter(f => f.category === 'feature').length}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
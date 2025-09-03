'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ConversationList } from '@/components/messaging/conversation-list'
import { MessageInterface } from '@/components/messaging/message-interface'
import { MessageCircle, Users, Calendar, TrendingUp, Bell } from 'lucide-react'

interface Participant {
  id: string
  firstName: string
  lastName: string
  role: 'athlete' | 'coach' | 'recruiter' | 'parent'
  avatar?: string
  sport?: string
  organization?: string
  isOnline?: boolean
}

interface Conversation {
  id: string
  title?: string
  participants: Participant[]
  lastMessage: {
    id: string
    content: string
    senderId: string
    senderName: string
    timestamp: Date
    messageType: 'text' | 'image' | 'file' | 'system'
  }
  unreadCount: number
  isGroup: boolean
  updatedAt: Date
  priority?: 'high' | 'medium' | 'low'
}

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [currentUserId] = useState('1') // Mock current user ID
  const [currentUserRole] = useState<'athlete' | 'coach' | 'recruiter' | 'parent' | 'admin'>('athlete')
  
  // Mock statistics - replace with real data
  const [stats, setStats] = useState({
    totalMessages: 47,
    unreadMessages: 5,
    activeRecruiters: 3,
    scheduledSessions: 2,
    newConnections: 8
  })

  const handleConversationSelect = (conversation: Conversation) => {
    setSelectedConversation(conversation)
  }

  const handleScheduleSession = () => {
    // Navigate to scheduling or open modal
    console.log('Schedule session clicked')
  }

  const handleViewProfile = (userId: string) => {
    // Navigate to user profile
    console.log('View profile clicked for user:', userId)
  }

  const handleNewConversation = () => {
    // Open new conversation modal or navigate to compose
    console.log('New conversation clicked')
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-muted-foreground">
            Connect with coaches, recruiters, and teammates
          </p>
        </div>
        <Button onClick={handleNewConversation}>
          <MessageCircle className="h-4 w-4 mr-2" />
          New Message
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-blue-600">{stats.totalMessages}</p>
                <p className="text-sm text-muted-foreground">Total Messages</p>
              </div>
              <MessageCircle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-red-600">{stats.unreadMessages}</p>
                <p className="text-sm text-muted-foreground">Unread</p>
              </div>
              <Bell className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-600">{stats.activeRecruiters}</p>
                <p className="text-sm text-muted-foreground">Active Recruiters</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-purple-600">{stats.scheduledSessions}</p>
                <p className="text-sm text-muted-foreground">Scheduled</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-orange-600">{stats.newConnections}</p>
                <p className="text-sm text-muted-foreground">New Connections</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Messaging Interface */}
      <Tabs defaultValue="messages" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="recruiting">Recruiting</TabsTrigger>
          <TabsTrigger value="coaching">Coaching</TabsTrigger>
        </TabsList>

        <TabsContent value="messages" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
            {/* Conversation List */}
            <div className="lg:col-span-1">
              <ConversationList
                currentUserId={currentUserId}
                currentUserRole={currentUserRole}
                selectedConversationId={selectedConversation?.id}
                onConversationSelect={handleConversationSelect}
                onNewConversation={handleNewConversation}
              />
            </div>

            {/* Message Interface */}
            <div className="lg:col-span-2">
              {selectedConversation ? (
                <MessageInterface
                  conversation={selectedConversation}
                  currentUserId={currentUserId}
                  currentUserRole={currentUserRole}
                  onScheduleSession={handleScheduleSession}
                  onViewProfile={handleViewProfile}
                />
              ) : (
                <Card className="h-full">
                  <CardContent className="h-full flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-semibold mb-2">Select a Conversation</h3>
                      <p className="text-sm">
                        Choose a conversation from the list to start messaging
                      </p>
                      <Button 
                        className="mt-4" 
                        variant="outline"
                        onClick={handleNewConversation}
                      >
                        Start New Conversation
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="recruiting" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Recruiting Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Recent recruiting messages */}
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">Stanford Athletics</p>
                      <p className="text-sm text-muted-foreground">
                        Interested in your football highlights
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-red-500">High Priority</Badge>
                    <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">UCLA Bruins</p>
                      <p className="text-sm text-muted-foreground">
                        Wants to schedule a campus visit
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline">Medium Priority</Badge>
                    <p className="text-xs text-muted-foreground mt-1">5 hours ago</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="h-2 w-2 bg-gray-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">USC Trojans</p>
                      <p className="text-sm text-muted-foreground">
                        Sent scholarship information
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline">Low Priority</Badge>
                    <p className="text-xs text-muted-foreground mt-1">1 day ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="coaching" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Coaching Communications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Recent coaching messages */}
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">Coach Mike Torres</p>
                      <p className="text-sm text-muted-foreground">
                        Training schedule for next week
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-blue-500">Training</Badge>
                    <p className="text-xs text-muted-foreground mt-1">1 hour ago</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">Team Strategy Group</p>
                      <p className="text-sm text-muted-foreground">
                        Game plan discussion for Friday
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-green-500">Strategy</Badge>
                    <p className="text-xs text-muted-foreground mt-1">3 hours ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
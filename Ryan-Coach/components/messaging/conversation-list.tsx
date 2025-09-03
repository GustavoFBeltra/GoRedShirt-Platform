'use client'

import { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Search, MessageCircle, Users } from 'lucide-react'
import { format, formatDistanceToNow } from 'date-fns'

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

interface ConversationListProps {
  currentUserId: string
  currentUserRole: 'athlete' | 'coach' | 'recruiter' | 'parent' | 'admin'
  selectedConversationId?: string
  onConversationSelect: (conversation: Conversation) => void
  onNewConversation?: () => void
}

export function ConversationList({ 
  currentUserId, 
  currentUserRole,
  selectedConversationId, 
  onConversationSelect,
  onNewConversation 
}: ConversationListProps) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'unread' | 'priority'>('all')
  const [loading, setLoading] = useState(true)

  // Mock data - replace with real API calls
  const mockConversations: Conversation[] = [
    {
      id: '1',
      participants: [
        { id: '2', firstName: 'Sarah', lastName: 'Johnson', role: 'recruiter', organization: 'Stanford Athletics', isOnline: true },
      ],
      lastMessage: {
        id: 'm1',
        content: 'Great highlight tape! Would love to discuss opportunities at Stanford.',
        senderId: '2',
        senderName: 'Sarah Johnson',
        timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
        messageType: 'text'
      },
      unreadCount: 2,
      isGroup: false,
      updatedAt: new Date(Date.now() - 1000 * 60 * 15),
      priority: 'high'
    },
    {
      id: '2',
      participants: [
        { id: '3', firstName: 'Mike', lastName: 'Torres', role: 'coach', sport: 'Football', isOnline: false },
      ],
      lastMessage: {
        id: 'm2',
        content: 'Training schedule for next week is ready. Check the attachment.',
        senderId: '3',
        senderName: 'Mike Torres',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        messageType: 'file'
      },
      unreadCount: 0,
      isGroup: false,
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2)
    },
    {
      id: '3',
      title: 'Team Strategy Discussion',
      participants: [
        { id: '3', firstName: 'Mike', lastName: 'Torres', role: 'coach', sport: 'Football' },
        { id: '4', firstName: 'James', lastName: 'Wilson', role: 'athlete', sport: 'Football' },
        { id: '5', firstName: 'David', lastName: 'Brown', role: 'athlete', sport: 'Football' },
      ],
      lastMessage: {
        id: 'm3',
        content: 'Everyone needs to focus on the new playbook changes for Friday\'s game.',
        senderId: '3',
        senderName: 'Mike Torres',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
        messageType: 'text'
      },
      unreadCount: 1,
      isGroup: true,
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 4)
    }
  ]

  useEffect(() => {
    // Simulate loading conversations
    setTimeout(() => {
      setConversations(mockConversations)
      setFilteredConversations(mockConversations)
      setLoading(false)
    }, 500)
  }, [])

  useEffect(() => {
    let filtered = conversations

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(conv => {
        const searchLower = searchQuery.toLowerCase()
        return (
          conv.title?.toLowerCase().includes(searchLower) ||
          conv.participants.some(p => 
            `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchLower) ||
            p.organization?.toLowerCase().includes(searchLower)
          ) ||
          conv.lastMessage.content.toLowerCase().includes(searchLower)
        )
      })
    }

    // Apply status filter
    if (filter === 'unread') {
      filtered = filtered.filter(conv => conv.unreadCount > 0)
    } else if (filter === 'priority') {
      filtered = filtered.filter(conv => conv.priority === 'high')
    }

    // Sort by last message timestamp
    filtered.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())

    setFilteredConversations(filtered)
  }, [conversations, searchQuery, filter])

  const getConversationTitle = (conversation: Conversation) => {
    if (conversation.title) return conversation.title
    
    const otherParticipants = conversation.participants.filter(p => p.id !== currentUserId)
    if (otherParticipants.length === 1) {
      const participant = otherParticipants[0]
      return `${participant.firstName} ${participant.lastName}`
    }
    
    return otherParticipants.map(p => p.firstName).join(', ')
  }

  const getConversationSubtitle = (conversation: Conversation) => {
    if (conversation.isGroup) {
      return `${conversation.participants.length} participants`
    }
    
    const otherParticipant = conversation.participants.find(p => p.id !== currentUserId)
    if (otherParticipant) {
      const roleLabel = otherParticipant.role === 'recruiter' ? 'Recruiter' : 
                       otherParticipant.role === 'coach' ? 'Coach' : 
                       otherParticipant.role === 'athlete' ? 'Athlete' : 'Parent'
      
      return otherParticipant.organization || otherParticipant.sport || roleLabel
    }
    
    return ''
  }

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return ''
    }
  }

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Messages
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Messages
          </CardTitle>
          {onNewConversation && (
            <Button size="sm" onClick={onNewConversation}>
              New
            </Button>
          )}
        </div>
        
        {/* Search and Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            <Button
              variant={filter === 'unread' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('unread')}
            >
              Unread
            </Button>
            <Button
              variant={filter === 'priority' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('priority')}
            >
              Priority
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          {filteredConversations.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No conversations found</p>
              {searchQuery && (
                <p className="text-sm">Try adjusting your search terms</p>
              )}
            </div>
          ) : (
            <div className="space-y-1">
              {filteredConversations.map((conversation) => {
                const isSelected = selectedConversationId === conversation.id
                const otherParticipants = conversation.participants.filter(p => p.id !== currentUserId)
                const displayParticipant = otherParticipants[0]
                
                return (
                  <div
                    key={conversation.id}
                    className={`p-3 cursor-pointer transition-colors hover:bg-gray-50 border-l-4 ${
                      isSelected ? 'bg-blue-50 border-l-blue-500' : 'border-l-transparent'
                    }`}
                    onClick={() => onConversationSelect(conversation)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={displayParticipant?.avatar} />
                          <AvatarFallback>
                            {conversation.isGroup ? (
                              <Users className="h-4 w-4" />
                            ) : (
                              displayParticipant ? 
                                `${displayParticipant.firstName[0]}${displayParticipant.lastName[0]}` :
                                '?'
                            )}
                          </AvatarFallback>
                        </Avatar>
                        {!conversation.isGroup && displayParticipant?.isOnline && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium text-sm truncate">
                            {getConversationTitle(conversation)}
                          </h3>
                          <div className="flex items-center gap-2">
                            {conversation.priority && (
                              <Badge variant="outline" className={`text-xs ${getPriorityColor(conversation.priority)}`}>
                                {conversation.priority}
                              </Badge>
                            )}
                            {conversation.unreadCount > 0 && (
                              <Badge className="bg-red-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full">
                                {conversation.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-xs text-muted-foreground mb-1">
                          {getConversationSubtitle(conversation)}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground truncate flex-1">
                            {conversation.lastMessage.messageType === 'file' && '📎 '}
                            {conversation.lastMessage.messageType === 'image' && '🖼️ '}
                            {conversation.lastMessage.senderId !== currentUserId && `${conversation.lastMessage.senderName}: `}
                            {conversation.lastMessage.content}
                          </p>
                          <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                            {formatDistanceToNow(conversation.lastMessage.timestamp, { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
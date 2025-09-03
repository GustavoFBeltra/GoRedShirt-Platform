'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { realtimeService, useRealtimeMessages, type RealtimeMessage } from '@/lib/supabase/realtime'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import { 
  Send, 
  Paperclip, 
  Image as ImageIcon, 
  MoreVertical, 
  Phone, 
  Video, 
  Info,
  Smile,
  Calendar
} from 'lucide-react'
import { format, isToday, isYesterday } from 'date-fns'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Message {
  id: string
  senderId: string
  senderName: string
  senderAvatar?: string
  content: string
  timestamp: Date
  messageType: 'text' | 'image' | 'file' | 'system' | 'booking_request'
  attachments?: {
    id: string
    fileName: string
    fileSize: number
    fileType: string
    url: string
  }[]
  isEdited?: boolean
  reactions?: {
    emoji: string
    userIds: string[]
  }[]
  replyTo?: {
    messageId: string
    content: string
    senderName: string
  }
}

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
  isGroup: boolean
}

interface MessageInterfaceProps {
  conversation: Conversation
  currentUserId: string
  currentUserRole: 'athlete' | 'coach' | 'recruiter' | 'parent' | 'admin'
  onScheduleSession?: () => void
  onViewProfile?: (userId: string) => void
}

export function MessageInterface({ 
  conversation, 
  currentUserId, 
  currentUserRole,
  onScheduleSession,
  onViewProfile
}: MessageInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [isTyping, setIsTyping] = useState<string[]>([])
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Mock messages - replace with real API calls
  const mockMessages: Message[] = [
    {
      id: 'm1',
      senderId: '2',
      senderName: 'Sarah Johnson',
      senderAvatar: '',
      content: 'Hi! I saw your highlight tape and I\'m really impressed with your performance this season.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      messageType: 'text'
    },
    {
      id: 'm2',
      senderId: currentUserId,
      senderName: 'You',
      content: 'Thank you! I\'ve been working really hard to improve my game.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2 + 300000),
      messageType: 'text'
    },
    {
      id: 'm3',
      senderId: '2',
      senderName: 'Sarah Johnson',
      content: 'Great highlight tape! Would love to discuss opportunities at Stanford.',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      messageType: 'text',
      attachments: [
        {
          id: 'a1',
          fileName: 'Stanford_Football_Opportunities_2024.pdf',
          fileSize: 1200000,
          fileType: 'application/pdf',
          url: '/documents/stanford_opportunities.pdf'
        }
      ]
    },
    {
      id: 'm4',
      senderId: '2',
      senderName: 'Sarah Johnson',
      content: 'I\'d love to schedule a call to discuss this further. Are you available this week?',
      timestamp: new Date(Date.now() - 1000 * 60 * 10),
      messageType: 'booking_request'
    }
  ]

  useEffect(() => {
    // Simulate loading messages
    setTimeout(() => {
      setMessages(mockMessages)
      setLoading(false)
      scrollToBottom()
    }, 300)
  }, [conversation.id])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Real-time message callbacks
  const handleNewMessage = useCallback((message: RealtimeMessage) => {
    const newMsg: Message = {
      id: message.id,
      senderId: message.sender_id,
      senderName: message.sender_id === currentUserId ? 'You' : 
        conversation.participants.find(p => p.id === message.sender_id)?.firstName || 'Unknown',
      content: message.content,
      timestamp: new Date(message.created_at),
      messageType: message.message_type as 'text' | 'image' | 'file' | 'system' | 'booking_request',
      attachments: message.attachments
    }
    
    setMessages(prev => {
      // Avoid duplicates
      if (prev.find(m => m.id === newMsg.id)) {
        return prev
      }
      return [...prev, newMsg]
    })
  }, [conversation.participants, currentUserId])

  const handleTypingStart = useCallback((userId: string) => {
    if (userId !== currentUserId) {
      setIsTyping(prev => [...prev.filter(id => id !== userId), userId])
    }
  }, [currentUserId])

  const handleTypingStop = useCallback((userId: string) => {
    setIsTyping(prev => prev.filter(id => id !== userId))
  }, [])

  // Use real-time messaging hook
  useRealtimeMessages(conversation.id, {
    onNewMessage: handleNewMessage,
    onTypingStart: handleTypingStart,
    onTypingStop: handleTypingStop
  })

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || sending) return

    setSending(true)
    const messageContent = newMessage.trim()
    setNewMessage('')

    try {
      // Send message through realtime service
      const sentMessage = await realtimeService.sendMessage(
        conversation.id,
        currentUserId,
        messageContent,
        'text'
      )

      if (!sentMessage) {
        // If sending failed, restore message text
        setNewMessage(messageContent)
        console.error('Failed to send message')
      }

      // Stop typing indicator
      await realtimeService.sendTypingIndicator(conversation.id, currentUserId, false)
    } catch (error) {
      console.error('Error sending message:', error)
      setNewMessage(messageContent)
    } finally {
      setSending(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleInputChange = (value: string) => {
    setNewMessage(value)
    
    // Send typing indicator
    if (value.trim() && !typingTimeout) {
      realtimeService.sendTypingIndicator(conversation.id, currentUserId, true)
    }

    // Clear existing timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout)
    }

    // Set new timeout to stop typing indicator
    const timeout = setTimeout(() => {
      realtimeService.sendTypingIndicator(conversation.id, currentUserId, false)
      setTypingTimeout(null)
    }, 1000)

    setTypingTimeout(timeout)
  }

  // Cleanup typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout)
        realtimeService.sendTypingIndicator(conversation.id, currentUserId, false)
      }
    }
  }, [typingTimeout, conversation.id, currentUserId])

  const formatMessageTime = (timestamp: Date) => {
    if (isToday(timestamp)) {
      return format(timestamp, 'HH:mm')
    } else if (isYesterday(timestamp)) {
      return `Yesterday ${format(timestamp, 'HH:mm')}`
    } else {
      return format(timestamp, 'MMM d, HH:mm')
    }
  }

  const getConversationTitle = () => {
    if (conversation.title) return conversation.title
    
    const otherParticipants = conversation.participants.filter(p => p.id !== currentUserId)
    if (otherParticipants.length === 1) {
      const participant = otherParticipants[0]
      return `${participant.firstName} ${participant.lastName}`
    }
    
    return otherParticipants.map(p => p.firstName).join(', ')
  }

  const getConversationSubtitle = () => {
    if (conversation.isGroup) {
      return `${conversation.participants.length} participants`
    }
    
    const otherParticipant = conversation.participants.find(p => p.id !== currentUserId)
    if (otherParticipant) {
      const roleLabel = otherParticipant.role === 'recruiter' ? 'Recruiter' : 
                       otherParticipant.role === 'coach' ? 'Coach' : 
                       otherParticipant.role === 'athlete' ? 'Athlete' : 'Parent'
      
      const status = otherParticipant.isOnline ? 'Online' : 'Offline'
      const org = otherParticipant.organization || otherParticipant.sport
      
      return org ? `${roleLabel} at ${org} • ${status}` : `${roleLabel} • ${status}`
    }
    
    return ''
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const renderMessage = (message: Message, index: number) => {
    const isOwn = message.senderId === currentUserId
    const showAvatar = !isOwn && (index === 0 || messages[index - 1].senderId !== message.senderId)
    const participant = conversation.participants.find(p => p.id === message.senderId)

    if (message.messageType === 'system') {
      return (
        <div key={message.id} className="flex justify-center py-2">
          <Badge variant="outline" className="text-xs">
            {message.content}
          </Badge>
        </div>
      )
    }

    if (message.messageType === 'booking_request') {
      return (
        <div key={message.id} className="flex justify-center py-4">
          <Card className="max-w-sm">
            <CardContent className="p-4 text-center">
              <Calendar className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <p className="text-sm mb-3">{message.content}</p>
              {!isOwn && onScheduleSession && (
                <Button size="sm" onClick={onScheduleSession}>
                  Schedule Session
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      )
    }

    return (
      <div key={message.id} className={`flex gap-3 mb-4 ${isOwn ? 'flex-row-reverse' : ''}`}>
        <div className="flex-shrink-0">
          {showAvatar && !isOwn && (
            <Avatar 
              className="h-8 w-8 cursor-pointer" 
              onClick={() => participant && onViewProfile?.(participant.id)}
            >
              <AvatarImage src={participant?.avatar} />
              <AvatarFallback>
                {participant ? `${participant.firstName[0]}${participant.lastName[0]}` : '?'}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
        
        <div className={`flex flex-col max-w-[70%] ${isOwn ? 'items-end' : 'items-start'}`}>
          {!isOwn && showAvatar && (
            <span className="text-xs text-muted-foreground mb-1">
              {message.senderName}
            </span>
          )}
          
          <div className={`rounded-lg px-3 py-2 ${
            isOwn 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-100 text-gray-900'
          }`}>
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            
            {message.attachments && message.attachments.length > 0 && (
              <div className="mt-2 space-y-2">
                {message.attachments.map(attachment => (
                  <div 
                    key={attachment.id} 
                    className={`flex items-center gap-2 p-2 rounded border ${
                      isOwn ? 'bg-blue-600 border-blue-400' : 'bg-white border-gray-200'
                    }`}
                  >
                    <Paperclip className="h-4 w-4" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{attachment.fileName}</p>
                      <p className="text-xs opacity-70">{formatFileSize(attachment.fileSize)}</p>
                    </div>
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 17a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" />
                      </svg>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-muted-foreground">
              {formatMessageTime(message.timestamp)}
            </span>
            {message.isEdited && (
              <span className="text-xs text-muted-foreground">edited</span>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
            <div>
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-1 w-32" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-24" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
                <div className="flex-1">
                  <div className="h-16 bg-gray-200 rounded-lg animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-4 border-b">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={conversation.participants.find(p => p.id !== currentUserId)?.avatar} />
            <AvatarFallback>
              {conversation.isGroup ? '👥' : 
               conversation.participants.find(p => p.id !== currentUserId)?.firstName[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{getConversationTitle()}</h3>
            <p className="text-sm text-muted-foreground">{getConversationSubtitle()}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {currentUserRole === 'athlete' && onScheduleSession && (
            <Button size="sm" variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule
            </Button>
          )}
          <Button size="sm" variant="outline">
            <Phone className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline">
            <Video className="h-4 w-4" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Info className="h-4 w-4 mr-2" />
                Conversation Info
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                View Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                Block User
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea ref={scrollAreaRef} className="h-[400px] p-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <p>No messages yet</p>
              <p className="text-sm">Start the conversation!</p>
            </div>
          ) : (
            <>
              {messages.map((message, index) => renderMessage(message, index))}
              {isTyping.length > 0 && (
                <div className="flex gap-3 mb-4">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>...</AvatarFallback>
                  </Avatar>
                  <div className="bg-gray-100 rounded-lg px-3 py-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </ScrollArea>
      </CardContent>

      <div className="border-t p-4">
        <div className="flex items-end space-x-2">
          <div className="flex-1">
            <Textarea
              ref={textareaRef}
              value={newMessage}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="min-h-[40px] max-h-[120px] resize-none"
              rows={1}
            />
          </div>
          
          <div className="flex items-center space-x-1">
            <Button size="sm" variant="outline" className="h-10 w-10 p-0">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" className="h-10 w-10 p-0">
              <ImageIcon className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" className="h-10 w-10 p-0">
              <Smile className="h-4 w-4" />
            </Button>
            <Button 
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || sending}
              className="h-10 w-10 p-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import { 
  MessageCircle, 
  Send, 
  X, 
  Minimize2, 
  Maximize2,
  Bot,
  User,
  HelpCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Phone,
  Mail
} from 'lucide-react'

interface SupportMessage {
  id: string
  content: string
  sender: 'user' | 'support' | 'bot'
  timestamp: Date
  type?: 'text' | 'image' | 'file'
  metadata?: {
    agentName?: string
    automated?: boolean
    ticketId?: string
  }
}

interface SupportTicket {
  id: string
  subject: string
  status: 'open' | 'pending' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  category: 'technical' | 'billing' | 'account' | 'general'
  createdAt: Date
  updatedAt: Date
  messages: SupportMessage[]
}

export function SupportChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [currentTicket, setCurrentTicket] = useState<SupportTicket | null>(null)
  const [messages, setMessages] = useState<SupportMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [supportStatus, setSupportStatus] = useState<'online' | 'away' | 'offline'>('online')
  const [queuePosition, setQueuePosition] = useState<number | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && !currentTicket) {
      // Initialize chat with welcome message
      const welcomeMessage: SupportMessage = {
        id: 'welcome',
        content: "Hi! I'm here to help. What can I assist you with today?",
        sender: 'bot',
        timestamp: new Date(),
        metadata: { automated: true }
      }
      setMessages([welcomeMessage])
    }
  }, [isOpen, currentTicket])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const quickActions = [
    { id: 'billing', label: 'Billing Questions', icon: FileText },
    { id: 'technical', label: 'Technical Support', icon: AlertCircle },
    { id: 'account', label: 'Account Issues', icon: User },
    { id: 'general', label: 'General Help', icon: HelpCircle }
  ]

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    const userMessage: SupportMessage = {
      id: `msg_${Date.now()}`,
      content: newMessage,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setNewMessage('')
    setIsTyping(true)

    // Simulate response delay
    setTimeout(() => {
      const botResponse = getBotResponse(newMessage)
      setMessages(prev => [...prev, botResponse])
      setIsTyping(false)
    }, 1500)
  }

  const getBotResponse = (userMessage: string): SupportMessage => {
    const lowerMessage = userMessage.toLowerCase()
    
    let response = "I understand you need help. Let me connect you with a support agent who can assist you better."
    
    if (lowerMessage.includes('billing') || lowerMessage.includes('payment')) {
      response = "I can help with billing questions! For payment issues, please check your billing section in settings. If you need further assistance, I'll connect you with our billing team."
    } else if (lowerMessage.includes('password') || lowerMessage.includes('login')) {
      response = "For login issues, try using the 'Forgot Password' link on the login page. If you're still having trouble, I can help you reset your account."
    } else if (lowerMessage.includes('coach') || lowerMessage.includes('athlete')) {
      response = "I can help with questions about coaches and athletes! What specifically would you like to know about our coaching platform?"
    }

    return {
      id: `bot_${Date.now()}`,
      content: response,
      sender: 'bot',
      timestamp: new Date(),
      metadata: { automated: true }
    }
  }

  const handleQuickAction = (actionId: string) => {
    const action = quickActions.find(a => a.id === actionId)
    if (action) {
      setNewMessage(`I need help with ${action.label.toLowerCase()}`)
    }
  }

  const createTicket = () => {
    const ticket: SupportTicket = {
      id: `ticket_${Date.now()}`,
      subject: 'Support Request',
      status: 'open',
      priority: 'medium',
      category: 'general',
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: [...messages]
    }
    
    setCurrentTicket(ticket)
    setQueuePosition(3) // Simulate queue position
  }

  const SupportStatusIndicator = () => (
    <div className="flex items-center space-x-2 text-xs">
      <div className={`w-2 h-2 rounded-full ${
        supportStatus === 'online' ? 'bg-green-400' : 
        supportStatus === 'away' ? 'bg-yellow-400' : 'bg-red-400'
      }`} />
      <span className="capitalize text-muted-foreground">{supportStatus}</span>
      {queuePosition && (
        <Badge variant="outline" className="text-xs">
          Queue: {queuePosition}
        </Badge>
      )}
    </div>
  )

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 rounded-full w-14 h-14 shadow-lg bg-red-600 hover:bg-red-700 text-white"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    )
  }

  return (
    <Card 
      className={`fixed bottom-6 right-6 z-50 shadow-2xl border-red-200 dark:border-red-800 transition-all duration-300 ${
        isMinimized ? 'w-80 h-16' : 'w-96 h-[500px]'
      }`}
    >
      {/* Header */}
      <CardHeader className="pb-3 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-600 rounded-full">
              <MessageCircle className="w-4 h-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-sm">Support Chat</CardTitle>
              <SupportStatusIndicator />
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="w-8 h-8 p-0"
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* Content */}
      {!isMinimized && (
        <CardContent className="p-0 flex flex-col h-[420px]">
          
          {/* Quick Actions */}
          {messages.length <= 1 && (
            <div className="p-4 border-b bg-gray-50 dark:bg-gray-900/50">
              <p className="text-sm text-muted-foreground mb-3">Quick help with:</p>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action) => {
                  const Icon = action.icon
                  return (
                    <Button
                      key={action.id}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAction(action.id)}
                      className="justify-start text-xs"
                    >
                      <Icon className="w-3 h-3 mr-2" />
                      {action.label}
                    </Button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                      message.sender === 'user'
                        ? 'bg-red-600 text-white'
                        : message.sender === 'bot'
                        ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                    }`}
                  >
                    {message.sender !== 'user' && (
                      <div className="flex items-center space-x-2 mb-1">
                        {message.sender === 'bot' ? (
                          <Bot className="w-3 h-3" />
                        ) : (
                          <User className="w-3 h-3" />
                        )}
                        <span className="text-xs font-medium">
                          {message.metadata?.agentName || (message.sender === 'bot' ? 'Assistant' : 'Support')}
                        </span>
                      </div>
                    )}
                    <p>{message.content}</p>
                    <p className={`text-xs mt-1 opacity-70`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2 text-sm">
                    <div className="flex items-center space-x-1">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-xs text-muted-foreground ml-2">Typing...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="p-4 border-t bg-gray-50 dark:bg-gray-900/50">
            <div className="flex space-x-2 items-end">
              <Textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="min-h-[40px] max-h-24 resize-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || isTyping}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            
            {!currentTicket && messages.length > 3 && (
              <div className="mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={createTicket}
                  className="w-full text-xs"
                >
                  Create Support Ticket
                </Button>
              </div>
            )}
            
            {currentTicket && (
              <div className="mt-2 flex items-center space-x-2 text-xs text-muted-foreground">
                <CheckCircle2 className="w-3 h-3 text-green-600" />
                <span>Ticket #{currentTicket.id.slice(-6)} created</span>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  )
}
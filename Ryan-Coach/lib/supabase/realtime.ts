import { createClient } from './client'
import type { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js'

const supabase = createClient()

export interface RealtimeMessage {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  message_type: 'text' | 'image' | 'file' | 'system' | 'booking_request'
  attachments?: any[]
  created_at: string
  updated_at: string
}

export interface RealtimeConversation {
  id: string
  title?: string
  is_group: boolean
  last_message_id?: string
  created_at: string
  updated_at: string
}

export interface MessageSubscriptionCallbacks {
  onNewMessage?: (message: RealtimeMessage) => void
  onMessageUpdate?: (message: RealtimeMessage) => void
  onMessageDelete?: (messageId: string) => void
  onTypingStart?: (userId: string, conversationId: string) => void
  onTypingStop?: (userId: string, conversationId: string) => void
  onUserOnline?: (userId: string) => void
  onUserOffline?: (userId: string) => void
}

class RealtimeService {
  private channels: Map<string, RealtimeChannel> = new Map()
  private typingTimeouts: Map<string, NodeJS.Timeout> = new Map()

  /**
   * Subscribe to messages in a specific conversation
   */
  subscribeToConversation(
    conversationId: string,
    callbacks: MessageSubscriptionCallbacks
  ): RealtimeChannel {
    const channelName = `conversation:${conversationId}`
    
    // Remove existing subscription if any
    this.unsubscribeFromConversation(conversationId)

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload: RealtimePostgresChangesPayload<RealtimeMessage>) => {
          if (callbacks.onNewMessage && payload.new) {
            callbacks.onNewMessage(payload.new)
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload: RealtimePostgresChangesPayload<RealtimeMessage>) => {
          if (callbacks.onMessageUpdate && payload.new) {
            callbacks.onMessageUpdate(payload.new)
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload: RealtimePostgresChangesPayload<RealtimeMessage>) => {
          if (callbacks.onMessageDelete && payload.old) {
            callbacks.onMessageDelete(payload.old.id)
          }
        }
      )
      .on(
        'broadcast',
        { event: 'typing_start' },
        ({ payload }) => {
          if (callbacks.onTypingStart && payload.conversation_id === conversationId) {
            callbacks.onTypingStart(payload.user_id, payload.conversation_id)
          }
        }
      )
      .on(
        'broadcast',
        { event: 'typing_stop' },
        ({ payload }) => {
          if (callbacks.onTypingStop && payload.conversation_id === conversationId) {
            callbacks.onTypingStop(payload.user_id, payload.conversation_id)
          }
        }
      )
      .subscribe()

    this.channels.set(conversationId, channel)
    return channel
  }

  /**
   * Subscribe to user presence (online/offline status)
   */
  subscribeToUserPresence(
    userId: string,
    callbacks: Pick<MessageSubscriptionCallbacks, 'onUserOnline' | 'onUserOffline'>
  ): RealtimeChannel {
    const channelName = `user_presence:${userId}`
    
    // Remove existing subscription if any
    if (this.channels.has(`presence_${userId}`)) {
      this.channels.get(`presence_${userId}`)?.unsubscribe()
    }

    const channel = supabase
      .channel(channelName, {
        config: {
          presence: {
            key: userId,
          },
        },
      })
      .on('presence', { event: 'sync' }, () => {
        const onlineUsers = channel.presenceState()
        Object.keys(onlineUsers).forEach((key) => {
          if (callbacks.onUserOnline) {
            callbacks.onUserOnline(key)
          }
        })
      })
      .on('presence', { event: 'join' }, ({ key }) => {
        if (callbacks.onUserOnline) {
          callbacks.onUserOnline(key)
        }
      })
      .on('presence', { event: 'leave' }, ({ key }) => {
        if (callbacks.onUserOffline) {
          callbacks.onUserOffline(key)
        }
      })
      .subscribe()

    this.channels.set(`presence_${userId}`, channel)
    return channel
  }

  /**
   * Track user presence (call when user comes online)
   */
  async trackPresence(userId: string, metadata?: Record<string, any>) {
    const channel = this.channels.get(`presence_${userId}`)
    if (channel) {
      await channel.track({
        user_id: userId,
        online_at: new Date().toISOString(),
        ...metadata,
      })
    }
  }

  /**
   * Stop tracking user presence (call when user goes offline)
   */
  async untrackPresence(userId: string) {
    const channel = this.channels.get(`presence_${userId}`)
    if (channel) {
      await channel.untrack()
    }
  }

  /**
   * Send typing indicator
   */
  async sendTypingIndicator(conversationId: string, userId: string, isTyping: boolean) {
    const channel = this.channels.get(conversationId)
    if (!channel) return

    const eventType = isTyping ? 'typing_start' : 'typing_stop'
    
    await channel.send({
      type: 'broadcast',
      event: eventType,
      payload: {
        user_id: userId,
        conversation_id: conversationId,
        timestamp: new Date().toISOString(),
      },
    })

    // Auto-stop typing after 3 seconds of inactivity
    if (isTyping) {
      const timeoutKey = `${userId}_${conversationId}`
      
      // Clear existing timeout
      if (this.typingTimeouts.has(timeoutKey)) {
        clearTimeout(this.typingTimeouts.get(timeoutKey)!)
        this.typingTimeouts.delete(timeoutKey)
      }

      // Set new timeout
      const timeout = setTimeout(() => {
        this.sendTypingIndicator(conversationId, userId, false)
        this.typingTimeouts.delete(timeoutKey)
      }, 3000)

      this.typingTimeouts.set(timeoutKey, timeout)
    }
  }

  /**
   * Subscribe to all conversations for a user
   */
  subscribeToUserConversations(
    userId: string,
    callbacks: MessageSubscriptionCallbacks
  ): RealtimeChannel {
    const channelName = `user_messages:${userId}`
    
    // Remove existing subscription if any
    if (this.channels.has(`user_${userId}`)) {
      this.channels.get(`user_${userId}`)?.unsubscribe()
    }

    // Subscribe to conversation_participants to get user's conversations
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          // This will get all messages, but we'll filter on the client side
        },
        async (payload: RealtimePostgresChangesPayload<RealtimeMessage>) => {
          if (payload.new) {
            // Check if user is part of this conversation
            const { data: isParticipant } = await supabase
              .from('conversation_participants')
              .select('id')
              .eq('conversation_id', payload.new.conversation_id)
              .eq('user_id', userId)
              .single()

            if (isParticipant && callbacks.onNewMessage) {
              callbacks.onNewMessage(payload.new)
            }
          }
        }
      )
      .subscribe()

    this.channels.set(`user_${userId}`, channel)
    return channel
  }

  /**
   * Unsubscribe from a conversation
   */
  unsubscribeFromConversation(conversationId: string) {
    const channel = this.channels.get(conversationId)
    if (channel) {
      channel.unsubscribe()
      this.channels.delete(conversationId)
    }
  }

  /**
   * Unsubscribe from user presence
   */
  unsubscribeFromUserPresence(userId: string) {
    const channel = this.channels.get(`presence_${userId}`)
    if (channel) {
      channel.unsubscribe()
      this.channels.delete(`presence_${userId}`)
    }
  }

  /**
   * Unsubscribe from all user conversations
   */
  unsubscribeFromUserConversations(userId: string) {
    const channel = this.channels.get(`user_${userId}`)
    if (channel) {
      channel.unsubscribe()
      this.channels.delete(`user_${userId}`)
    }
  }

  /**
   * Unsubscribe from all channels and clean up
   */
  cleanup() {
    // Clear all typing timeouts
    this.typingTimeouts.forEach((timeout) => {
      clearTimeout(timeout)
    })
    this.typingTimeouts.clear()

    // Unsubscribe from all channels
    this.channels.forEach((channel) => {
      channel.unsubscribe()
    })
    this.channels.clear()
  }

  /**
   * Get list of online users in a conversation
   */
  getOnlineUsers(conversationId: string): string[] {
    const channel = this.channels.get(conversationId)
    if (!channel) return []

    const presenceState = channel.presenceState()
    return Object.keys(presenceState)
  }

  /**
   * Send a message to a conversation
   */
  async sendMessage(
    conversationId: string,
    senderId: string,
    content: string,
    messageType: 'text' | 'image' | 'file' | 'system' | 'booking_request' = 'text',
    attachments?: any[]
  ): Promise<RealtimeMessage | null> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: senderId,
          content,
          message_type: messageType,
          attachments: attachments || [],
        })
        .select()
        .single()

      if (error) {
        console.error('Error sending message:', error)
        return null
      }

      return data as RealtimeMessage
    } catch (error) {
      console.error('Error sending message:', error)
      return null
    }
  }

  /**
   * Mark messages as read
   */
  async markMessagesAsRead(conversationId: string, userId: string): Promise<boolean> {
    try {
      // Update or insert read receipt
      const { error } = await supabase
        .from('message_read_receipts')
        .upsert({
          conversation_id: conversationId,
          user_id: userId,
          last_read_at: new Date().toISOString(),
        })

      if (error) {
        console.error('Error marking messages as read:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error marking messages as read:', error)
      return false
    }
  }
}

// Export singleton instance
export const realtimeService = new RealtimeService()

// Export hook for React components
export function useRealtimeMessages(
  conversationId: string | null,
  callbacks: MessageSubscriptionCallbacks
) {
  const { useEffect, useRef } = require('react')
  const callbacksRef = useRef(callbacks)
  callbacksRef.current = callbacks

  useEffect(() => {
    if (!conversationId) return

    const channel = realtimeService.subscribeToConversation(
      conversationId,
      callbacksRef.current
    )

    return () => {
      realtimeService.unsubscribeFromConversation(conversationId)
    }
  }, [conversationId])
}

// Export hook for user presence
export function useUserPresence(
  userId: string | null,
  callbacks: Pick<MessageSubscriptionCallbacks, 'onUserOnline' | 'onUserOffline'>
) {
  const { useEffect, useRef } = require('react')
  const callbacksRef = useRef(callbacks)
  callbacksRef.current = callbacks

  useEffect(() => {
    if (!userId) return

    const channel = realtimeService.subscribeToUserPresence(
      userId,
      callbacksRef.current
    )

    // Track presence on mount
    realtimeService.trackPresence(userId)

    return () => {
      realtimeService.untrackPresence(userId)
      realtimeService.unsubscribeFromUserPresence(userId)
    }
  }, [userId])
}
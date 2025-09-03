import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

interface Alert {
  id: string
  type: 'performance' | 'error' | 'security' | 'business'
  severity: 'info' | 'warning' | 'critical'
  title: string
  message: string
  timestamp: Date
  metadata?: Record<string, any>
}

interface AlertRequest {
  alert: Alert
  channels: string[]
}

export async function POST(request: NextRequest) {
  try {
    const body: AlertRequest = await request.json()
    const { alert, channels } = body

    // Validate request
    if (!alert || !channels || channels.length === 0) {
      return NextResponse.json(
        { error: 'Invalid alert data or channels' },
        { status: 400 }
      )
    }

    // Get user context for authorization
    const supabase = createServerComponentClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const results: { channel: string; success: boolean; error?: string }[] = []

    // Send to each requested channel
    for (const channel of channels) {
      try {
        switch (channel) {
          case 'email':
            await sendEmailAlert(alert, session.user.email!)
            results.push({ channel, success: true })
            break

          case 'slack':
            await sendSlackAlert(alert)
            results.push({ channel, success: true })
            break

          case 'discord':
            await sendDiscordAlert(alert)
            results.push({ channel, success: true })
            break

          case 'webhook':
            await sendWebhookAlert(alert)
            results.push({ channel, success: true })
            break

          default:
            results.push({ 
              channel, 
              success: false, 
              error: 'Unsupported channel' 
            })
        }
      } catch (error) {
        results.push({ 
          channel, 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    // Log alert to database
    const { error: logError } = await supabase
      .from('alert_logs')
      .insert({
        alert_id: alert.id,
        type: alert.type,
        severity: alert.severity,
        title: alert.title,
        message: alert.message,
        metadata: alert.metadata,
        channels_sent: results.filter(r => r.success).map(r => r.channel),
        user_id: session.user.id
      })

    if (logError) {
      console.error('Failed to log alert:', logError)
    }

    return NextResponse.json({
      success: true,
      results,
      alert_id: alert.id
    })

  } catch (error) {
    console.error('Error sending alert:', error)
    return NextResponse.json(
      { 
        error: 'Failed to send alert',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

async function sendEmailAlert(alert: Alert, recipientEmail: string) {
  // In production, integrate with your email service (SendGrid, SES, etc.)
  console.log(`📧 Email Alert to ${recipientEmail}:`, {
    subject: `[${alert.severity.toUpperCase()}] ${alert.title}`,
    body: alert.message,
    metadata: alert.metadata
  })

  // Simulate email sending delay
  await new Promise(resolve => setTimeout(resolve, 100))
}

async function sendSlackAlert(alert: Alert) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL
  if (!webhookUrl) {
    throw new Error('Slack webhook URL not configured')
  }

  const color = alert.severity === 'critical' ? '#ff0000' : 
                alert.severity === 'warning' ? '#ffaa00' : '#00ff00'

  const payload = {
    attachments: [{
      color,
      title: alert.title,
      text: alert.message,
      fields: [
        {
          title: 'Severity',
          value: alert.severity.toUpperCase(),
          short: true
        },
        {
          title: 'Type',
          value: alert.type,
          short: true
        },
        {
          title: 'Time',
          value: alert.timestamp,
          short: false
        }
      ],
      footer: 'GoRedShirt Platform',
      ts: Math.floor(new Date(alert.timestamp).getTime() / 1000)
    }]
  }

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })

  if (!response.ok) {
    throw new Error(`Slack webhook failed: ${response.statusText}`)
  }
}

async function sendDiscordAlert(alert: Alert) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL
  if (!webhookUrl) {
    throw new Error('Discord webhook URL not configured')
  }

  const color = alert.severity === 'critical' ? 0xff0000 : 
                alert.severity === 'warning' ? 0xffaa00 : 0x00ff00

  const payload = {
    embeds: [{
      title: alert.title,
      description: alert.message,
      color,
      fields: [
        {
          name: 'Severity',
          value: alert.severity.toUpperCase(),
          inline: true
        },
        {
          name: 'Type',
          value: alert.type,
          inline: true
        }
      ],
      timestamp: alert.timestamp,
      footer: {
        text: 'GoRedShirt Platform'
      }
    }]
  }

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })

  if (!response.ok) {
    throw new Error(`Discord webhook failed: ${response.statusText}`)
  }
}

async function sendWebhookAlert(alert: Alert) {
  const webhookUrl = process.env.CUSTOM_WEBHOOK_URL
  if (!webhookUrl) {
    throw new Error('Custom webhook URL not configured')
  }

  const payload = {
    event: 'alert',
    alert,
    timestamp: new Date().toISOString(),
    source: 'goredshirt-platform'
  }

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'X-API-Key': process.env.WEBHOOK_API_KEY || ''
    },
    body: JSON.stringify(payload)
  })

  if (!response.ok) {
    throw new Error(`Custom webhook failed: ${response.statusText}`)
  }
}
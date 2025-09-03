'use client'

interface AlertThreshold {
  metric: string
  warning: number
  critical: number
  unit: string
}

interface Alert {
  id: string
  type: 'performance' | 'error' | 'security' | 'business'
  severity: 'info' | 'warning' | 'critical'
  title: string
  message: string
  timestamp: Date
  resolved: boolean
  resolvedAt?: Date
  metadata?: Record<string, any>
}

class AlertingSystem {
  private alerts: Alert[] = []
  private thresholds: AlertThreshold[] = [
    { metric: 'LCP', warning: 2500, critical: 4000, unit: 'ms' },
    { metric: 'FID', warning: 100, critical: 300, unit: 'ms' },
    { metric: 'CLS', warning: 0.1, critical: 0.25, unit: 'score' },
    { metric: 'TTFB', warning: 800, critical: 1800, unit: 'ms' },
    { metric: 'FCP', warning: 1800, critical: 3000, unit: 'ms' },
    { metric: 'error_rate', warning: 1, critical: 5, unit: '%' },
    { metric: 'response_time', warning: 1000, critical: 3000, unit: 'ms' },
    { metric: 'memory_usage', warning: 80, critical: 95, unit: '%' }
  ]

  private callbacks: {
    onAlert?: (alert: Alert) => void
    onResolve?: (alert: Alert) => void
  } = {}

  constructor() {
    if (typeof window !== 'undefined') {
      this.startMonitoring()
    }
  }

  setCallbacks(callbacks: { onAlert?: (alert: Alert) => void; onResolve?: (alert: Alert) => void }) {
    this.callbacks = callbacks
  }

  private startMonitoring() {
    // Monitor performance metrics
    setInterval(() => {
      this.checkPerformanceThresholds()
    }, 30000) // Every 30 seconds

    // Monitor error rates
    this.setupErrorMonitoring()

    // Monitor business metrics
    setInterval(() => {
      this.checkBusinessMetrics()
    }, 300000) // Every 5 minutes
  }

  private checkPerformanceThresholds() {
    if (typeof window === 'undefined') return

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    if (!navigation) return

    // Check page load time
    const loadTime = navigation.loadEventEnd - navigation.fetchStart
    this.checkThreshold('response_time', loadTime)

    // Check TTFB
    const ttfb = navigation.responseStart - navigation.fetchStart
    this.checkThreshold('TTFB', ttfb)

    // Memory usage (if available)
    if ('memory' in performance) {
      const memory = (performance as any).memory
      const memoryUsage = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
      this.checkThreshold('memory_usage', memoryUsage)
    }
  }

  private setupErrorMonitoring() {
    let errorCount = 0
    let totalPageViews = 1

    window.addEventListener('error', (event) => {
      errorCount++
      const errorRate = (errorCount / totalPageViews) * 100

      this.createAlert({
        type: 'error',
        severity: 'warning',
        title: 'JavaScript Error Detected',
        message: `${event.error?.message || event.message} at ${event.filename}:${event.lineno}`,
        metadata: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          stack: event.error?.stack,
          errorRate
        }
      })

      this.checkThreshold('error_rate', errorRate)
    })

    window.addEventListener('unhandledrejection', (event) => {
      errorCount++
      const errorRate = (errorCount / totalPageViews) * 100

      this.createAlert({
        type: 'error',
        severity: 'warning',
        title: 'Unhandled Promise Rejection',
        message: `${event.reason}`,
        metadata: {
          reason: event.reason,
          errorRate
        }
      })

      this.checkThreshold('error_rate', errorRate)
    })
  }

  private checkBusinessMetrics() {
    // Simulate business metric checks
    // In production, these would come from actual analytics
    
    // Check for unusual user activity patterns
    const now = new Date()
    const hour = now.getHours()
    
    // Alert if no activity during business hours (simulated)
    if (hour >= 9 && hour <= 17 && Math.random() < 0.1) {
      this.createAlert({
        type: 'business',
        severity: 'info',
        title: 'Low Activity Alert',
        message: 'User activity appears lower than normal during business hours',
        metadata: {
          hour,
          expectedActivity: 'normal',
          actualActivity: 'low'
        }
      })
    }
  }

  private checkThreshold(metric: string, value: number) {
    const threshold = this.thresholds.find(t => t.metric === metric)
    if (!threshold) return

    let severity: 'info' | 'warning' | 'critical' | null = null
    
    if (value >= threshold.critical) {
      severity = 'critical'
    } else if (value >= threshold.warning) {
      severity = 'warning'
    }

    if (severity) {
      this.createAlert({
        type: 'performance',
        severity,
        title: `${metric.toUpperCase()} Threshold Exceeded`,
        message: `${metric} is ${value.toFixed(2)}${threshold.unit} (threshold: ${severity === 'critical' ? threshold.critical : threshold.warning}${threshold.unit})`,
        metadata: {
          metric,
          value,
          threshold: severity === 'critical' ? threshold.critical : threshold.warning,
          unit: threshold.unit
        }
      })
    }
  }

  createAlert(alertData: Omit<Alert, 'id' | 'timestamp' | 'resolved'>) {
    const alert: Alert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      resolved: false,
      ...alertData
    }

    this.alerts.unshift(alert)
    
    // Keep only last 100 alerts
    if (this.alerts.length > 100) {
      this.alerts = this.alerts.slice(0, 100)
    }

    // Trigger callback
    this.callbacks.onAlert?.(alert)

    // Auto-resolve low severity alerts after some time
    if (alert.severity === 'info') {
      setTimeout(() => {
        this.resolveAlert(alert.id)
      }, 300000) // 5 minutes
    }

    return alert
  }

  resolveAlert(alertId: string) {
    const alert = this.alerts.find(a => a.id === alertId)
    if (alert && !alert.resolved) {
      alert.resolved = true
      alert.resolvedAt = new Date()
      this.callbacks.onResolve?.(alert)
    }
  }

  getAlerts(filter?: {
    type?: Alert['type']
    severity?: Alert['severity']
    resolved?: boolean
    since?: Date
  }): Alert[] {
    let filtered = this.alerts

    if (filter) {
      if (filter.type) {
        filtered = filtered.filter(a => a.type === filter.type)
      }
      if (filter.severity) {
        filtered = filtered.filter(a => a.severity === filter.severity)
      }
      if (filter.resolved !== undefined) {
        filtered = filtered.filter(a => a.resolved === filter.resolved)
      }
      if (filter.since) {
        filtered = filtered.filter(a => a.timestamp >= filter.since!)
      }
    }

    return filtered
  }

  getAlertSummary() {
    const now = new Date()
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const recent = this.alerts.filter(a => a.timestamp >= last24h)
    const weekly = this.alerts.filter(a => a.timestamp >= last7d)

    return {
      total: this.alerts.length,
      unresolved: this.alerts.filter(a => !a.resolved).length,
      last24h: {
        total: recent.length,
        critical: recent.filter(a => a.severity === 'critical').length,
        warning: recent.filter(a => a.severity === 'warning').length,
        info: recent.filter(a => a.severity === 'info').length
      },
      last7d: {
        total: weekly.length,
        byType: {
          performance: weekly.filter(a => a.type === 'performance').length,
          error: weekly.filter(a => a.type === 'error').length,
          security: weekly.filter(a => a.type === 'security').length,
          business: weekly.filter(a => a.type === 'business').length
        }
      }
    }
  }

  // Method to send alerts to external services (Slack, email, etc.)
  async sendExternalAlert(alert: Alert, channels: string[] = ['email']) {
    if (typeof window === 'undefined') return

    try {
      const response = await fetch('/api/alerts/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          alert,
          channels
        })
      })

      if (!response.ok) {
        console.error('Failed to send external alert:', response.statusText)
      }
    } catch (error) {
      console.error('Error sending external alert:', error)
    }
  }
}

// Export singleton instance
export const alertingSystem = new AlertingSystem()
export type { Alert, AlertThreshold }
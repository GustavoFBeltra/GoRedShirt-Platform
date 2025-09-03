'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { alertingSystem, Alert } from '@/lib/monitoring/alerts'
import { 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Activity,
  Shield,
  Zap,
  BarChart3
} from 'lucide-react'

export function AlertDashboard() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [summary, setSummary] = useState(alertingSystem.getAlertSummary())
  const [filter, setFilter] = useState<{
    type?: Alert['type']
    severity?: Alert['severity']
    resolved?: boolean
  }>({})

  useEffect(() => {
    // Set up alert callbacks
    alertingSystem.setCallbacks({
      onAlert: (alert) => {
        setAlerts(prev => [alert, ...prev])
        setSummary(alertingSystem.getAlertSummary())
      },
      onResolve: () => {
        setSummary(alertingSystem.getAlertSummary())
      }
    })

    // Initial load
    setAlerts(alertingSystem.getAlerts())
    
    // Refresh data periodically
    const interval = setInterval(() => {
      setAlerts(alertingSystem.getAlerts(filter))
      setSummary(alertingSystem.getAlertSummary())
    }, 5000)

    return () => clearInterval(interval)
  }, [filter])

  const getSeverityIcon = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-600" />
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-600" />
      case 'info': return <Info className="w-4 h-4 text-blue-600" />
    }
  }

  const getTypeIcon = (type: Alert['type']) => {
    switch (type) {
      case 'performance': return <Zap className="w-4 h-4" />
      case 'error': return <AlertTriangle className="w-4 h-4" />
      case 'security': return <Shield className="w-4 h-4" />
      case 'business': return <BarChart3 className="w-4 h-4" />
    }
  }

  const getSeverityColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'warning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'info': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
    }
  }

  const handleResolveAlert = (alertId: string) => {
    alertingSystem.resolveAlert(alertId)
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, resolved: true, resolvedAt: new Date() }
        : alert
    ))
  }

  const filteredAlerts = alerts.filter(alert => {
    if (filter.type && alert.type !== filter.type) return false
    if (filter.severity && alert.severity !== filter.severity) return false
    if (filter.resolved !== undefined && alert.resolved !== filter.resolved) return false
    return true
  })

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
            <Activity className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.total}</div>
            <p className="text-xs text-muted-foreground">
              {summary.unresolved} unresolved
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last 24h</CardTitle>
            <Clock className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.last24h.total}</div>
            <div className="flex space-x-1 text-xs">
              <span className="text-red-600">{summary.last24h.critical}C</span>
              <span className="text-yellow-600">{summary.last24h.warning}W</span>
              <span className="text-blue-600">{summary.last24h.info}I</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.last7d.byType.performance}</div>
            <p className="text-xs text-muted-foreground">
              Last 7 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Errors</CardTitle>
            <AlertTriangle className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.last7d.byType.error}</div>
            <p className="text-xs text-muted-foreground">
              Last 7 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alert Management */}
      <Card>
        <CardHeader>
          <CardTitle>Alert Management</CardTitle>
          <CardDescription>
            Monitor and manage system alerts across all categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger 
                  value="all" 
                  onClick={() => setFilter({})}
                >
                  All ({alerts.length})
                </TabsTrigger>
                <TabsTrigger 
                  value="unresolved"
                  onClick={() => setFilter({ resolved: false })}
                >
                  Unresolved ({alerts.filter(a => !a.resolved).length})
                </TabsTrigger>
                <TabsTrigger 
                  value="critical"
                  onClick={() => setFilter({ severity: 'critical' })}
                >
                  Critical ({alerts.filter(a => a.severity === 'critical').length})
                </TabsTrigger>
              </TabsList>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFilter({ type: 'performance' })}
                >
                  <Zap className="w-4 h-4 mr-1" />
                  Performance
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFilter({ type: 'error' })}
                >
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  Errors
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFilter({ type: 'security' })}
                >
                  <Shield className="w-4 h-4 mr-1" />
                  Security
                </Button>
              </div>
            </div>

            <TabsContent value="all" className="space-y-4">
              <ScrollArea className="h-96">
                <div className="space-y-2">
                  {filteredAlerts.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                      <p>No alerts found</p>
                    </div>
                  ) : (
                    filteredAlerts.map((alert) => (
                      <Card key={alert.id} className={`${alert.resolved ? 'opacity-60' : ''}`}>
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3 flex-1">
                              <div className="flex items-center space-x-2">
                                {getSeverityIcon(alert.severity)}
                                {getTypeIcon(alert.type)}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <h4 className="font-medium">{alert.title}</h4>
                                  <Badge 
                                    variant="outline" 
                                    className={getSeverityColor(alert.severity)}
                                  >
                                    {alert.severity}
                                  </Badge>
                                  <Badge variant="outline">
                                    {alert.type}
                                  </Badge>
                                  {alert.resolved && (
                                    <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                                      <CheckCircle className="w-3 h-3 mr-1" />
                                      Resolved
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">
                                  {alert.message}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {alert.timestamp.toLocaleString()}
                                  {alert.resolvedAt && (
                                    <span className="ml-2">
                                      • Resolved at {alert.resolvedAt.toLocaleString()}
                                    </span>
                                  )}
                                </p>
                                {alert.metadata && (
                                  <details className="mt-2">
                                    <summary className="text-xs cursor-pointer text-muted-foreground hover:text-foreground">
                                      Show metadata
                                    </summary>
                                    <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-x-auto">
                                      {JSON.stringify(alert.metadata, null, 2)}
                                    </pre>
                                  </details>
                                )}
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              {!alert.resolved && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleResolveAlert(alert.id)}
                                >
                                  Resolve
                                </Button>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => alertingSystem.sendExternalAlert(alert, ['email'])}
                              >
                                Notify
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
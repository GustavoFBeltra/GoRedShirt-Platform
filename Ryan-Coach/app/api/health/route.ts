import { NextResponse } from 'next/server'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

interface HealthCheck {
  service: string
  status: 'healthy' | 'degraded' | 'down'
  responseTime?: number
  error?: string
}

export async function GET() {
  const startTime = performance.now()
  const checks: HealthCheck[] = []
  let overallStatus: 'healthy' | 'degraded' | 'down' = 'healthy'

  // Database connectivity check
  try {
    const dbStartTime = performance.now()
    const supabase = createServerComponentClient({ cookies })
    
    const { error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1)
    
    const dbResponseTime = performance.now() - dbStartTime
    
    if (error) {
      checks.push({
        service: 'database',
        status: 'down',
        error: error.message
      })
      overallStatus = 'down'
    } else {
      checks.push({
        service: 'database',
        status: dbResponseTime > 1000 ? 'degraded' : 'healthy',
        responseTime: Math.round(dbResponseTime)
      })
      if (dbResponseTime > 1000 && overallStatus === 'healthy') {
        overallStatus = 'degraded'
      }
    }
  } catch (error) {
    checks.push({
      service: 'database',
      status: 'down',
      error: error instanceof Error ? error.message : 'Unknown database error'
    })
    overallStatus = 'down'
  }

  // External service checks
  const externalServices = [
    {
      name: 'stripe',
      url: 'https://api.stripe.com/v1',
      headers: { 'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}` }
    }
  ]

  for (const service of externalServices) {
    try {
      const serviceStartTime = performance.now()
      const response = await fetch(service.url, {
        method: 'GET',
        headers: service.headers,
        signal: AbortSignal.timeout(5000) // 5s timeout
      })
      
      const serviceResponseTime = performance.now() - serviceStartTime
      
      if (response.ok) {
        checks.push({
          service: service.name,
          status: serviceResponseTime > 2000 ? 'degraded' : 'healthy',
          responseTime: Math.round(serviceResponseTime)
        })
        if (serviceResponseTime > 2000 && overallStatus === 'healthy') {
          overallStatus = 'degraded'
        }
      } else {
        checks.push({
          service: service.name,
          status: 'down',
          error: `HTTP ${response.status}`
        })
        if (overallStatus !== 'down') {
          overallStatus = 'degraded'
        }
      }
    } catch (error) {
      checks.push({
        service: service.name,
        status: 'down',
        error: error instanceof Error ? error.message : 'Service unreachable'
      })
      if (overallStatus !== 'down') {
        overallStatus = 'degraded'
      }
    }
  }

  // Environment checks
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'STRIPE_SECRET_KEY',
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'
  ]

  const missingEnvVars = requiredEnvVars.filter(
    envVar => !process.env[envVar]
  )

  if (missingEnvVars.length > 0) {
    checks.push({
      service: 'environment',
      status: 'down',
      error: `Missing environment variables: ${missingEnvVars.join(', ')}`
    })
    overallStatus = 'down'
  } else {
    checks.push({
      service: 'environment',
      status: 'healthy'
    })
  }

  const totalResponseTime = Math.round(performance.now() - startTime)
  
  const healthData = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
    responseTime: totalResponseTime,
    checks
  }

  // Return appropriate status code
  const statusCode = overallStatus === 'healthy' ? 200 : 
                    overallStatus === 'degraded' ? 200 : 503

  return NextResponse.json(healthData, { status: statusCode })
}
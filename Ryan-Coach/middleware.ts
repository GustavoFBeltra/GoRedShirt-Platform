import { updateSession } from '@/lib/supabase/middleware'
import { NextRequest, NextResponse } from 'next/server'

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// Security headers configuration
const securityHeaders = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://checkout.stripe.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://*.supabase.co https://api.stripe.com https://checkout.stripe.com wss://*.supabase.co",
    "frame-src 'self' https://js.stripe.com https://hooks.stripe.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; ')
}

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // requests per window
  skipSuccessfulRequests: false,
  skipFailedRequests: false
}

function getRateLimitKey(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : request.ip || 'unknown'
  return ip
}

function isRateLimited(key: string): boolean {
  const now = Date.now()
  const record = rateLimitStore.get(key)

  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + RATE_LIMIT_CONFIG.windowMs
    })
    return false
  }

  if (record.count >= RATE_LIMIT_CONFIG.max) {
    return true
  }

  record.count++
  return false
}

function validateRequest(request: NextRequest): { valid: boolean; reason?: string } {
  const userAgent = request.headers.get('user-agent') || ''
  
  // Block suspicious user agents
  const suspiciousUserAgents = [
    'sqlmap', 'nikto', 'nessus', 'masscan', 'nmap', 'gobuster', 'dirb'
  ]

  if (suspiciousUserAgents.some(agent => userAgent.toLowerCase().includes(agent))) {
    return { valid: false, reason: 'Suspicious user agent' }
  }

  // Check for injection patterns in URL
  const url = request.url.toLowerCase()
  const maliciousPatterns = [
    'union select', 'drop table', 'insert into', 'delete from',
    '1=1', "' or '1'='1", 'exec(', 'script>', '<script', 'javascript:'
  ]

  if (maliciousPatterns.some(pattern => url.includes(pattern))) {
    return { valid: false, reason: 'Potential injection attack' }
  }

  // Check request size (10MB limit)
  const contentLength = request.headers.get('content-length')
  if (contentLength && parseInt(contentLength) > 10 * 1024 * 1024) {
    return { valid: false, reason: 'Request too large' }
  }

  return { valid: true }
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Rate limiting check
  const rateLimitKey = getRateLimitKey(request)
  if (isRateLimited(rateLimitKey)) {
    return new NextResponse('Too Many Requests', {
      status: 429,
      headers: {
        'Retry-After': '900',
        ...Object.fromEntries(Object.entries(securityHeaders))
      }
    })
  }

  // Request validation
  const validation = validateRequest(request)
  if (!validation.valid) {
    console.warn('Blocked suspicious request', {
      reason: validation.reason,
      ip: rateLimitKey,
      userAgent: request.headers.get('user-agent'),
      url: request.url
    })
    
    return new NextResponse('Forbidden', {
      status: 403,
      headers: Object.fromEntries(Object.entries(securityHeaders))
    })
  }

  // Apply Supabase auth middleware
  const response = await updateSession(request)
  
  // Add security headers to all responses
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  // Handle API routes
  if (pathname.startsWith('/api/')) {
    return response
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
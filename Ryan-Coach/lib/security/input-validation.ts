import { z } from 'zod'

// Common validation schemas
export const emailSchema = z.string().email('Invalid email address').toLowerCase()

export const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character')

export const phoneSchema = z.string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format')
  .optional()
  .or(z.literal(''))

export const nameSchema = z.string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must be less than 50 characters')
  .regex(/^[a-zA-Z\s\-']+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes')

export const usernameSchema = z.string()
  .min(3, 'Username must be at least 3 characters')
  .max(20, 'Username must be less than 20 characters')
  .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens')

// User profile validation
export const profileSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  location: z.string().max(100, 'Location must be less than 100 characters').optional(),
})

// Authentication schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
})

export const registerSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  role: z.enum(['athlete', 'coach', 'parent', 'recruiter'], {
    message: 'Please select a valid role'
  }),
  terms: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions'
  })
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
})

// Message validation
export const messageSchema = z.object({
  content: z.string()
    .min(1, 'Message cannot be empty')
    .max(2000, 'Message must be less than 2000 characters'),
  type: z.enum(['text', 'image', 'file']).default('text'),
  recipientId: z.string().uuid('Invalid recipient ID'),
})

// Session booking validation
export const sessionBookingSchema = z.object({
  coachId: z.string().uuid('Invalid coach ID'),
  sessionType: z.enum(['individual', 'group', 'assessment']),
  date: z.string().datetime('Invalid date format'),
  duration: z.number().min(30, 'Session must be at least 30 minutes').max(180, 'Session cannot exceed 3 hours'),
  notes: z.string().max(500, 'Notes must be less than 500 characters').optional(),
  location: z.string().max(200, 'Location must be less than 200 characters').optional(),
})

// Payment validation
export const paymentSchema = z.object({
  amount: z.number().positive('Amount must be positive').max(10000, 'Amount cannot exceed $10,000'),
  currency: z.string().length(3, 'Currency must be 3 characters').default('USD'),
  description: z.string().max(200, 'Description must be less than 200 characters').optional(),
})

// File upload validation
export const fileUploadSchema = z.object({
  fileName: z.string()
    .min(1, 'File name is required')
    .max(255, 'File name must be less than 255 characters')
    .regex(/^[^<>:"/\\|?*]+$/, 'File name contains invalid characters'),
  fileSize: z.number()
    .positive('File size must be positive')
    .max(50 * 1024 * 1024, 'File size cannot exceed 50MB'), // 50MB limit
  mimeType: z.string().refine(type => {
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'video/mp4',
      'video/webm',
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
    return allowedTypes.includes(type)
  }, 'File type not supported')
})

// Search and filter validation
export const searchSchema = z.object({
  query: z.string()
    .min(1, 'Search query is required')
    .max(100, 'Search query must be less than 100 characters')
    .regex(/^[^<>]*$/, 'Search query contains invalid characters'),
  filters: z.object({
    location: z.string().max(100).optional(),
    sport: z.string().max(50).optional(),
    experience: z.enum(['beginner', 'intermediate', 'advanced', 'professional']).optional(),
    priceRange: z.object({
      min: z.number().min(0).optional(),
      max: z.number().max(1000).optional(),
    }).optional(),
  }).optional(),
  sortBy: z.enum(['relevance', 'price', 'rating', 'distance']).default('relevance'),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
})

// Admin operations validation
export const adminUserUpdateSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  role: z.enum(['athlete', 'coach', 'admin', 'parent', 'recruiter']).optional(),
  status: z.enum(['active', 'suspended', 'banned']).optional(),
  verified: z.boolean().optional(),
  notes: z.string().max(1000, 'Notes must be less than 1000 characters').optional(),
})

// Input sanitization functions
export function sanitizeHtml(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

export function sanitizeFileName(fileName: string): string {
  return fileName
    .replace(/[<>:"/\\|?*]/g, '_')
    .replace(/\s+/g, '_')
    .replace(/_+/g, '_')
    .trim()
}

export function validateAndSanitizeInput<T>(
  schema: z.ZodSchema<T>,
  input: unknown,
  sanitize = true
): { success: true; data: T } | { success: false; errors: string[] } {
  try {
    const validated = schema.parse(input)
    
    if (sanitize && typeof validated === 'object' && validated !== null) {
      // Recursively sanitize string values
      const sanitized = JSON.parse(JSON.stringify(validated, (key, value) => {
        if (typeof value === 'string') {
          return sanitizeHtml(value)
        }
        return value
      }))
      
      return { success: true, data: sanitized }
    }
    
    return { success: true, data: validated }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.issues.map(err => `${err.path.join('.')}: ${err.message}`)
      }
    }
    
    return {
      success: false,
      errors: ['Invalid input format']
    }
  }
}

// Rate limiting helpers
export function createRateLimiter(windowMs: number, maxRequests: number) {
  const requests = new Map<string, number[]>()

  return {
    isAllowed: (identifier: string): boolean => {
      const now = Date.now()
      const windowStart = now - windowMs
      
      const userRequests = requests.get(identifier) || []
      const validRequests = userRequests.filter(timestamp => timestamp > windowStart)
      
      if (validRequests.length >= maxRequests) {
        return false
      }
      
      validRequests.push(now)
      requests.set(identifier, validRequests)
      
      return true
    },
    
    getRemainingRequests: (identifier: string): number => {
      const now = Date.now()
      const windowStart = now - windowMs
      
      const userRequests = requests.get(identifier) || []
      const validRequests = userRequests.filter(timestamp => timestamp > windowStart)
      
      return Math.max(0, maxRequests - validRequests.length)
    }
  }
}

// Content filtering
export function containsProfanity(text: string): boolean {
  const profanityList = [
    // Add your profanity filters here - keeping minimal for example
    'spam', 'scam', 'fake'
  ]
  
  const lowerText = text.toLowerCase()
  return profanityList.some(word => lowerText.includes(word))
}

export function detectSpam(text: string): boolean {
  // Simple spam detection rules
  const spamIndicators = [
    /https?:\/\//gi, // URLs
    /\b\d{10,}\b/g,  // Long numbers (phone numbers, etc.)
    /(.)\1{4,}/g,    // Repeated characters
    /[A-Z]{3,}/g     // All caps words
  ]
  
  let score = 0
  spamIndicators.forEach(regex => {
    const matches = text.match(regex)
    if (matches) score += matches.length
  })
  
  // Consider spam if score is too high or text is too repetitive
  return score > 3 || text.length > 0 && (text.match(/(.+?)\1+/g) || []).length > text.length * 0.3
}

// Export all schemas for use in API routes and forms
export const validationSchemas = {
  email: emailSchema,
  password: passwordSchema,
  phone: phoneSchema,
  name: nameSchema,
  username: usernameSchema,
  profile: profileSchema,
  login: loginSchema,
  register: registerSchema,
  message: messageSchema,
  sessionBooking: sessionBookingSchema,
  payment: paymentSchema,
  fileUpload: fileUploadSchema,
  search: searchSchema,
  adminUserUpdate: adminUserUpdateSchema,
}
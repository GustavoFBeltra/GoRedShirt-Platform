'use client'

import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

// ========================================
// GOREDSHIRT ULTRA THEME SYSTEM
// ========================================

// Color Palette - Strategic Red with Professional Foundation
export const theme = {
  colors: {
    // Primary Brand Colors
    primary: {
      red: {
        50: '#fef2f2',
        100: '#fee2e2', 
        200: '#fecaca',
        300: '#fca5a5',
        400: '#f87171',
        500: '#ef4444', // Base red
        600: '#dc2626', // Primary red
        700: '#b91c1c', // Darker red
        800: '#991b1b',
        900: '#7f1d1d'
      }
    },
    
    // Professional Foundation
    foundation: {
      slate: {
        50: '#f8fafc',
        100: '#f1f5f9',
        200: '#e2e8f0',
        300: '#cbd5e1',
        400: '#94a3b8',
        500: '#64748b',
        600: '#475569', // Primary foundation
        700: '#334155', // Secondary foundation
        800: '#1e293b',
        900: '#0f172a'
      }
    },

    // Status Colors
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6'
  },

  // Gradient Definitions
  gradients: {
    // Primary gradients
    primary: 'from-red-600 to-red-700',
    primaryHover: 'from-red-700 to-red-800',
    primarySoft: 'from-red-600/8 to-red-700/8',
    
    // Foundation gradients
    foundation: 'from-slate-600 to-slate-700',
    foundationSoft: 'from-slate-600/5 to-slate-700/5',
    
    // Text gradients
    textPrimary: 'from-gray-900 to-red-600 dark:from-white dark:to-red-400',
    textFoundation: 'from-gray-900 to-gray-700 dark:from-white dark:to-gray-300',
    
    // Background gradients
    cardGradient: 'from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-750',
    hoverGradient: 'from-red-50/50 to-red-100/50 dark:from-red-950/20 dark:to-red-900/20',
    
    // Achievement gradients
    achievement: 'from-red-600 to-red-700',
    achievementSoft: 'from-white/10 to-white/5'
  }
} as const

// ========================================
// ANIMATION SYSTEM
// ========================================

// Entrance Animations
export const animations = {
  // Fade in with upward motion
  fadeInUp: 'animate-fade-in-up',
  
  // Staggered entrance delays (use with style prop)
  staggerDelay: (index: number, baseDelay: number = 100) => ({
    animationDelay: `${index * baseDelay}ms`
  }),
  
  // Hover transforms
  hover: {
    // Lift and scale
    liftScale: 'hover:-translate-y-2 hover:scale-[1.02]',
    
    // Gentle lift
    lift: 'hover:-translate-y-1',
    
    // Strong lift
    strongLift: 'hover:-translate-y-2',
    
    // Icon rotations
    iconRotate: 'group-hover:rotate-12',
    iconRotateLarge: 'group-hover:rotate-6',
    
    // Icon translations
    iconTranslateX: 'group-hover:translate-x-1',
    iconTranslateY: 'group-hover:-translate-y-1',
    iconTranslateXY: 'group-hover:translate-x-1 group-hover:-translate-y-1',
    
    // Scale effects
    scaleSmall: 'group-hover:scale-110',
    scaleMedium: 'group-hover:scale-125',
    
    // Combined effects
    scaleRotate: 'group-hover:scale-110 group-hover:rotate-6',
    scaleRotateStrong: 'group-hover:scale-110 group-hover:rotate-12'
  },
  
  // Transition classes
  transition: {
    default: 'transition-all duration-300',
    smooth: 'transition-all duration-500',
    fast: 'transition-all duration-200',
    slow: 'transition-all duration-700',
    
    // Specific transitions
    transform: 'transition-transform duration-300',
    colors: 'transition-colors duration-300',
    shadow: 'transition-shadow duration-300',
    opacity: 'transition-opacity duration-500'
  }
} as const

// ========================================
// GLASSMORPHISM SYSTEM
// ========================================

export const glassmorphism = {
  // Standard glass effects
  card: 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl',
  cardStrong: 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl',
  cardSoft: 'bg-white/60 dark:bg-gray-900/60 backdrop-blur-lg',
  
  // Overlay effects
  overlay: 'bg-white/10 backdrop-blur-sm',
  overlayStrong: 'bg-white/20 backdrop-blur-md',
  
  // Navigation specific
  nav: 'bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg border-white/20',
  
  // Modal/popup effects
  modal: 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl'
} as const

// ========================================
// SHADOW SYSTEM
// ========================================

export const shadows = {
  // Standard shadows
  sm: 'shadow-sm',
  default: 'shadow-lg',
  strong: 'shadow-xl',
  ultra: 'shadow-2xl',
  
  // Hover shadows
  hoverDefault: 'hover:shadow-xl',
  hoverStrong: 'hover:shadow-2xl',
  
  // Colored shadows
  primaryShadow: 'shadow-lg hover:shadow-xl hover:shadow-red-500/25',
  foundationShadow: 'shadow-lg hover:shadow-xl hover:shadow-slate-500/25',
  
  // Glow effects
  redGlow: 'shadow-lg shadow-red-500/20',
  slateGlow: 'shadow-lg shadow-slate-500/20'
} as const

// ========================================
// COMPONENT VARIANTS
// ========================================

// Card Variants
interface CardVariantProps {
  variant?: 'default' | 'glass' | 'hover' | 'interactive'
  size?: 'sm' | 'default' | 'lg'
  children: ReactNode
  className?: string
  onClick?: () => void
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  style?: React.CSSProperties
}

export function ThemeCard({ 
  variant = 'default', 
  size = 'default', 
  children, 
  className,
  onClick,
  onMouseEnter,
  onMouseLeave,
  style 
}: CardVariantProps) {
  const variants = {
    default: 'rounded-xl border-0 shadow-lg bg-white dark:bg-gray-900',
    glass: cn(glassmorphism.card, 'rounded-xl border-0', shadows.default),
    hover: cn(
      glassmorphism.card, 
      'rounded-xl border-0', 
      shadows.default,
      shadows.hoverStrong,
      animations.hover.liftScale,
      animations.transition.default,
      'cursor-pointer'
    ),
    interactive: cn(
      glassmorphism.card,
      'rounded-xl border-0',
      shadows.primaryShadow,
      animations.hover.liftScale,
      animations.transition.default,
      'cursor-pointer relative overflow-hidden'
    )
  }
  
  const sizes = {
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8'
  }
  
  return (
    <div 
      className={cn(variants[variant], sizes[size], className)}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={style}
    >
      {children}
    </div>
  )
}

// Button Variants
interface ButtonVariantProps {
  variant?: 'primary' | 'secondary' | 'foundation' | 'ghost' | 'achievement'
  size?: 'sm' | 'default' | 'lg'
  children: ReactNode
  className?: string
  onClick?: () => void
  disabled?: boolean
}

export function ThemeButton({ 
  variant = 'primary', 
  size = 'default', 
  children, 
  className,
  onClick,
  disabled 
}: ButtonVariantProps) {
  const variants = {
    primary: cn(
      'bg-gradient-to-r', theme.gradients.primary,
      'hover:from-red-700 hover:to-red-800',
      'text-white',
      shadows.primaryShadow,
      animations.hover.lift,
      animations.transition.default
    ),
    secondary: cn(
      'bg-white dark:bg-gray-800',
      'border-2 border-red-600',
      'text-red-600 hover:text-white',
      'hover:bg-red-600',
      animations.transition.default
    ),
    foundation: cn(
      'bg-gradient-to-r', theme.gradients.foundation,
      'hover:from-slate-700 hover:to-slate-800',
      'text-white',
      shadows.foundationShadow,
      animations.hover.lift,
      animations.transition.default
    ),
    ghost: cn(
      'bg-transparent',
      'hover:bg-gray-100 dark:hover:bg-gray-800',
      'text-gray-700 dark:text-gray-300',
      animations.transition.default
    ),
    achievement: cn(
      'bg-gradient-to-r', theme.gradients.achievement,
      'text-white',
      'shadow-lg shadow-red-500/30',
      'hover:shadow-xl hover:shadow-red-500/40',
      animations.hover.strongLift,
      animations.transition.default,
      'relative overflow-hidden'
    )
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    default: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  }
  
  return (
    <button 
      className={cn(
        'rounded-lg font-medium flex items-center justify-center',
        'focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2',
        variants[variant], 
        sizes[size], 
        className,
        disabled && 'opacity-50 cursor-not-allowed'
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

// Icon Container with Hover Effects
interface ThemeIconProps {
  children: ReactNode
  variant?: 'primary' | 'foundation' | 'glass'
  hover?: keyof typeof animations.hover
  className?: string
}

export function ThemeIcon({ 
  children, 
  variant = 'foundation', 
  hover = 'scaleRotate',
  className 
}: ThemeIconProps) {
  const variants = {
    primary: cn('p-1 rounded bg-gradient-to-br', theme.gradients.primary, 'text-white'),
    foundation: cn('p-1 rounded bg-gradient-to-br', theme.gradients.foundation, 'text-white'),
    glass: cn('p-1 rounded', glassmorphism.overlay, 'text-gray-700 dark:text-gray-300')
  }
  
  return (
    <div className={cn(
      variants[variant],
      animations.hover[hover],
      animations.transition.transform,
      className
    )}>
      {children}
    </div>
  )
}

// Progress Circle Component
interface ProgressCircleProps {
  value: number
  size?: 'sm' | 'default' | 'lg'
  gradient?: keyof typeof theme.gradients
  label?: string
  className?: string
}

export function ProgressCircle({ 
  value, 
  size = 'default', 
  gradient = 'foundation',
  label,
  className 
}: ProgressCircleProps) {
  const sizes = {
    sm: { width: 96, height: 96, radius: 40, stroke: 8 },
    default: { width: 192, height: 192, radius: 88, stroke: 12 },
    lg: { width: 256, height: 256, radius: 116, stroke: 16 }
  }
  
  const { width, height, radius, stroke } = sizes[size]
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - value / 100)
  
  return (
    <div className={cn('relative', className)} style={{ width, height }}>
      <svg width={width} height={height} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={width / 2}
          cy={height / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={stroke}
          fill="none"
          className="text-gray-200 dark:text-gray-700"
        />
        
        {/* Progress circle */}
        <circle
          cx={width / 2}
          cy={height / 2}
          r={radius}
          stroke="url(#progressGradient)"
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
          strokeLinecap="round"
        />
        
        {/* Gradient definition */}
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#475569" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-slate-700 dark:text-slate-300">
          {value}%
        </span>
        {label && (
          <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
        )}
      </div>
    </div>
  )
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Generate staggered animation delays
export function staggeredDelay(index: number, baseDelay: number = 100) {
  return { animationDelay: `${index * baseDelay}ms` }
}

// Create hover card with background effects
export function createHoverCard(gradientSoft: string, gradient: string, hoveredId: string | null, cardId: string) {
  return {
    backgroundGradient: cn(
      "absolute inset-0 bg-gradient-to-br opacity-5",
      gradientSoft
    ),
    hoverGradient: cn(
      "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500",
      gradient,
      hoveredId === cardId && "opacity-10"
    )
  }
}

// Generate theme-consistent text gradients
export function textGradient(type: 'primary' | 'foundation' = 'foundation') {
  return cn(
    'bg-gradient-to-br bg-clip-text text-transparent',
    type === 'primary' ? theme.gradients.textPrimary : theme.gradients.textFoundation
  )
}


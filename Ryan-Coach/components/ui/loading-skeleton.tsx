'use client'

import { cn } from '@/lib/utils'
import { glassmorphism, shadows } from './theme-system'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'card' | 'circle' | 'button'
  width?: string | number
  height?: string | number
  count?: number
}

export function Skeleton({ 
  className, 
  variant = 'text',
  width,
  height,
  count = 1
}: SkeletonProps) {
  const baseClass = cn(
    "animate-pulse bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600",
    "relative overflow-hidden",
    {
      'h-4 rounded': variant === 'text',
      'h-32 rounded-lg': variant === 'card',
      'rounded-full': variant === 'circle',
      'h-10 rounded-md': variant === 'button',
    },
    className
  )

  const shimmer = (
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
  )

  const elements = Array.from({ length: count }, (_, i) => (
    <div
      key={i}
      className={baseClass}
      style={{
        width: width || (variant === 'circle' ? 40 : variant === 'button' ? 100 : '100%'),
        height: height || (variant === 'circle' ? 40 : undefined),
      }}
    >
      {shimmer}
    </div>
  ))

  return count > 1 ? <div className="space-y-2">{elements}</div> : elements[0]
}

export function CardSkeleton() {
  return (
    <div className={cn("p-6 rounded-lg", glassmorphism.card, shadows.default, "animate-fade-in-up")}>
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <Skeleton variant="circle" width={48} height={48} />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" className="h-5 w-1/3" />
            <Skeleton variant="text" className="h-4 w-1/2" />
          </div>
        </div>
        <Skeleton variant="text" count={3} />
        <div className="flex space-x-2">
          <Skeleton variant="button" />
          <Skeleton variant="button" />
        </div>
      </div>
    </div>
  )
}

export function ListSkeleton({ items = 5 }: { items?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: items }, (_, i) => (
        <div key={i} className={cn("p-4 rounded-lg", glassmorphism.card, shadows.default, "animate-fade-in-up")} style={{ animationDelay: `${i * 100}ms` }}>
          <div className="flex items-center space-x-4">
            <Skeleton variant="circle" width={40} height={40} />
            <div className="flex-1 space-y-2">
              <Skeleton variant="text" className="h-5 w-2/3" />
              <Skeleton variant="text" className="h-4 w-1/2" />
            </div>
            <Skeleton variant="button" width={80} />
          </div>
        </div>
      ))}
    </div>
  )
}

export function LoadingSpinner({ size = 'default', className }: { size?: 'small' | 'default' | 'large', className?: string }) {
  const sizeClasses = {
    small: 'h-4 w-4 border-2',
    default: 'h-8 w-8 border-3',
    large: 'h-12 w-12 border-4'
  }

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className={cn(
        "animate-spin rounded-full border-gray-300 dark:border-gray-600 border-t-red-600 dark:border-t-red-500",
        sizeClasses[size]
      )} />
    </div>
  )
}

export function PageLoader({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
      <div className={cn("p-8 rounded-lg", glassmorphism.card, shadows.strong, "animate-scale-in")}>
        <LoadingSpinner size="large" className="mb-4" />
        <p className="text-center text-gray-600 dark:text-gray-400 animate-pulse">{message}</p>
      </div>
    </div>
  )
}
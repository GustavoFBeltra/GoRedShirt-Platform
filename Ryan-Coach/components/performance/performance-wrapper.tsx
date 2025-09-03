'use client'

import { useEffect, useRef, useState, ReactNode } from 'react'
import { performanceMonitor, usePerformanceTimer } from '@/lib/performance/monitoring'

interface PerformanceWrapperProps {
  children: ReactNode
  componentName: string
  trackRender?: boolean
  trackInteractions?: boolean
}

export function PerformanceWrapper({
  children,
  componentName,
  trackRender = true,
  trackInteractions = false
}: PerformanceWrapperProps) {
  const renderCountRef = useRef(0)
  const { logMetric } = usePerformanceTimer(componentName)

  useEffect(() => {
    if (trackRender) {
      renderCountRef.current += 1
      logMetric('render_count', renderCountRef.current)
    }
  })

  useEffect(() => {
    if (trackInteractions) {
      const handleClick = () => {
        logMetric('user_interaction', performance.now())
      }

      const handleKeyDown = () => {
        logMetric('keyboard_interaction', performance.now())
      }

      document.addEventListener('click', handleClick)
      document.addEventListener('keydown', handleKeyDown)

      return () => {
        document.removeEventListener('click', handleClick)
        document.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [trackInteractions, logMetric])

  return <>{children}</>
}

// HOC for automatic performance monitoring
export function withPerformanceMonitoring<P extends object>(
  Component: React.ComponentType<P>,
  componentName?: string
) {
  const WrappedComponent = (props: P) => {
    const name = componentName || Component.displayName || Component.name || 'UnknownComponent'
    
    return (
      <PerformanceWrapper componentName={name} trackRender trackInteractions>
        <Component {...props} />
      </PerformanceWrapper>
    )
  }

  WrappedComponent.displayName = `withPerformanceMonitoring(${Component.displayName || Component.name})`
  
  return WrappedComponent
}

// Performance-optimized image component
interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  loading?: 'lazy' | 'eager'
  quality?: number
  onLoad?: () => void
  onError?: () => void
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  loading = 'lazy',
  quality = 75,
  onLoad,
  onError
}: OptimizedImageProps) {
  const imgRef = useRef<HTMLImageElement>(null)
  const loadStartTime = useRef<number>(0)

  useEffect(() => {
    const img = imgRef.current
    if (!img) return

    const handleLoadStart = () => {
      loadStartTime.current = performance.now()
    }

    const handleLoad = () => {
      const loadTime = performance.now() - loadStartTime.current
      performanceMonitor.logCustomMetric('image_load_time', loadTime, {
        src,
        width,
        height,
        size: img.naturalWidth * img.naturalHeight
      })
      onLoad?.()
    }

    const handleError = () => {
      performanceMonitor.logCustomMetric('image_load_error', 1, { src })
      onError?.()
    }

    img.addEventListener('loadstart', handleLoadStart)
    img.addEventListener('load', handleLoad)
    img.addEventListener('error', handleError)

    return () => {
      img.removeEventListener('loadstart', handleLoadStart)
      img.removeEventListener('load', handleLoad)
      img.removeEventListener('error', handleError)
    }
  }, [src, onLoad, onError, width, height])

  // In a real app, integrate with an image optimization service
  const optimizedSrc = src // TODO: Add actual image optimization

  return (
    <img
      ref={imgRef}
      src={optimizedSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading={loading}
      style={{
        width: width ? `${width}px` : undefined,
        height: height ? `${height}px` : undefined,
      }}
    />
  )
}

// Lazy loading wrapper with intersection observer
interface LazyWrapperProps {
  children: ReactNode
  fallback?: ReactNode
  rootMargin?: string
  threshold?: number
  onVisible?: () => void
}

export function LazyWrapper({
  children,
  fallback = <div>Loading...</div>,
  rootMargin = '50px',
  threshold = 0.1,
  onVisible
}: LazyWrapperProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element || typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsVisible(true)
      return
    }

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          onVisible?.()
          performanceMonitor.logCustomMetric('lazy_load_visible', performance.now())
          observerRef.current?.disconnect()
        }
      },
      {
        rootMargin,
        threshold
      }
    )

    observerRef.current.observe(element)

    return () => {
      observerRef.current?.disconnect()
    }
  }, [rootMargin, threshold, onVisible])

  return (
    <div ref={elementRef}>
      {isVisible ? children : fallback}
    </div>
  )
}

// Performance metrics display component (for development/debugging)
export function PerformanceMetrics() {
  const [metrics, setMetrics] = useState(performanceMonitor.getMetrics())
  const [summary, setSummary] = useState(performanceMonitor.getPerformanceSummary())

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(performanceMonitor.getMetrics())
      setSummary(performanceMonitor.getPerformanceSummary())
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-sm opacity-75 z-50">
      <h3 className="font-bold mb-2">Performance Metrics</h3>
      
      <div className="space-y-1">
        {Object.entries(summary.webVitals).map(([name, data]) => {
          const values = (data as any).values
          const avg = values.length > 0 ? values.reduce((a: number, b: number) => a + b, 0) / values.length : 0
          
          return (
            <div key={name} className="flex justify-between">
              <span>{name}:</span>
              <span className={`${(data as any).rating === 'good' ? 'text-green-400' : (data as any).rating === 'needs-improvement' ? 'text-yellow-400' : 'text-red-400'}`}>
                {Math.round(avg)} {name === 'CLS' ? '' : 'ms'}
              </span>
            </div>
          )
        })}
        
        <div className="flex justify-between">
          <span>Avg Page Load:</span>
          <span>{Math.round(summary.pageLoads.average)}ms</span>
        </div>
      </div>

      <div className="mt-2 pt-2 border-t border-gray-600">
        <div className="text-xs opacity-75">
          Total Metrics: {metrics.length}
        </div>
      </div>
    </div>
  )
}
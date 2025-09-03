// Performance monitoring utilities for GoRedShirt platform
import { onCLS, onINP, onFCP, onLCP, onTTFB } from 'web-vitals'

export interface PerformanceMetric {
  name: string
  value: number
  delta: number
  id: string
  rating: 'good' | 'needs-improvement' | 'poor'
  timestamp: number
  url: string
  userAgent: string
}

export interface PageLoadMetrics {
  url: string
  timestamp: number
  loadTime: number
  domContentLoaded: number
  firstContentfulPaint?: number
  largestContentfulPaint?: number
  cumulativeLayoutShift?: number
  firstInputDelay?: number
  timeToFirstByte?: number
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = []
  private pageMetrics: PageLoadMetrics[] = []
  private isEnabled: boolean = false

  constructor() {
    if (typeof window !== 'undefined') {
      this.isEnabled = true
      this.initializeWebVitals()
      this.initializePageMetrics()
      this.initializeResourceMonitoring()
    }
  }

  private initializeWebVitals() {
    // Core Web Vitals
    onCLS(this.onWebVital.bind(this))
    onINP(this.onWebVital.bind(this))
    onFCP(this.onWebVital.bind(this))
    onLCP(this.onWebVital.bind(this))
    onTTFB(this.onWebVital.bind(this))
  }

  private onWebVital(metric: any) {
    const performanceMetric: PerformanceMetric = {
      name: metric.name,
      value: metric.value,
      delta: metric.delta,
      id: metric.id,
      rating: metric.rating,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent
    }

    this.metrics.push(performanceMetric)
    this.sendMetricToAnalytics(performanceMetric)

    // Log performance issues
    if (performanceMetric.rating === 'poor') {
      console.warn(`Poor ${performanceMetric.name} performance:`, performanceMetric.value)
    }
  }

  private initializePageMetrics() {
    // Monitor page load performance
    if ('performance' in window) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
          
          if (perfData) {
            const pageMetric: PageLoadMetrics = {
              url: window.location.href,
              timestamp: Date.now(),
              loadTime: perfData.loadEventEnd - perfData.navigationStart,
              domContentLoaded: perfData.domContentLoadedEventEnd - perfData.navigationStart
            }

            this.pageMetrics.push(pageMetric)
            this.sendPageMetricToAnalytics(pageMetric)
          }
        }, 0)
      })
    }
  }

  private initializeResourceMonitoring() {
    // Monitor resource loading performance
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'resource') {
            this.analyzeResourcePerformance(entry as PerformanceResourceTiming)
          }
        })
      })

      observer.observe({ entryTypes: ['resource'] })
    }
  }

  private analyzeResourcePerformance(entry: PerformanceResourceTiming) {
    const duration = entry.responseEnd - entry.requestStart
    
    // Flag slow resources (>2 seconds)
    if (duration > 2000) {
      console.warn('Slow resource detected:', {
        name: entry.name,
        duration: Math.round(duration),
        type: entry.initiatorType,
        size: entry.transferSize
      })

      // Track specific resource types
      this.trackSlowResource({
        url: entry.name,
        duration,
        type: entry.initiatorType,
        size: entry.transferSize || 0,
        timestamp: Date.now()
      })
    }
  }

  private trackSlowResource(resource: {
    url: string
    duration: number
    type: string
    size: number
    timestamp: number
  }) {
    // Send to analytics or logging service
    if (this.shouldReportMetric()) {
      // In a real implementation, send to your analytics service
      console.log('Tracking slow resource:', resource)
    }
  }

  private sendMetricToAnalytics(metric: PerformanceMetric) {
    if (!this.shouldReportMetric()) return

    // In a real implementation, send to your analytics service (e.g., Google Analytics, PostHog)
    // Example: PostHog, Mixpanel, or custom analytics
    try {
      if (typeof window !== 'undefined' && 'gtag' in window) {
        (window as any).gtag('event', metric.name, {
          event_category: 'Web Vitals',
          value: Math.round(metric.value),
          metric_rating: metric.rating,
          custom_parameter_1: metric.id
        })
      }
    } catch (error) {
      console.error('Failed to send metric to analytics:', error)
    }
  }

  private sendPageMetricToAnalytics(metric: PageLoadMetrics) {
    if (!this.shouldReportMetric()) return

    try {
      if (typeof window !== 'undefined' && 'gtag' in window) {
        (window as any).gtag('event', 'page_load_timing', {
          event_category: 'Performance',
          value: Math.round(metric.loadTime),
          custom_parameter_1: metric.url
        })
      }
    } catch (error) {
      console.error('Failed to send page metric to analytics:', error)
    }
  }

  private shouldReportMetric(): boolean {
    // Only report in production and for a sample of users
    const isProduction = process.env.NODE_ENV === 'production'
    const sampleRate = 0.1 // 10% of users
    const shouldSample = Math.random() < sampleRate

    return isProduction && shouldSample
  }

  // Public API
  public startTimer(name: string): () => number {
    const startTime = performance.now()
    
    return () => {
      const duration = performance.now() - startTime
      this.logCustomMetric(name, duration)
      return duration
    }
  }

  public logCustomMetric(name: string, value: number, metadata?: any) {
    const metric = {
      name,
      value,
      timestamp: Date.now(),
      url: window.location.href,
      metadata
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Performance: ${name} = ${Math.round(value)}ms`, metadata)
    }

    // Send to analytics in production
    if (this.shouldReportMetric()) {
      try {
        if (typeof window !== 'undefined' && 'gtag' in window) {
          (window as any).gtag('event', 'custom_timing', {
            event_category: 'Performance',
            event_label: name,
            value: Math.round(value),
            custom_parameter_1: JSON.stringify(metadata)
          })
        }
      } catch (error) {
        console.error('Failed to send custom metric:', error)
      }
    }
  }

  public getMetrics(): PerformanceMetric[] {
    return [...this.metrics]
  }

  public getPageMetrics(): PageLoadMetrics[] {
    return [...this.pageMetrics]
  }

  public getPerformanceSummary() {
    const summary = {
      webVitals: {},
      pageLoads: {
        average: 0,
        count: 0
      },
      slowResources: 0
    }

    // Summarize web vitals
    this.metrics.forEach(metric => {
      if (!summary.webVitals[metric.name]) {
        summary.webVitals[metric.name] = {
          values: [],
          rating: metric.rating
        }
      }
      summary.webVitals[metric.name].values.push(metric.value)
    })

    // Summarize page loads
    if (this.pageMetrics.length > 0) {
      const totalLoadTime = this.pageMetrics.reduce((sum, metric) => sum + metric.loadTime, 0)
      summary.pageLoads.average = totalLoadTime / this.pageMetrics.length
      summary.pageLoads.count = this.pageMetrics.length
    }

    return summary
  }

  // Performance optimization suggestions
  public getOptimizationSuggestions(): string[] {
    const suggestions: string[] = []
    const summary = this.getPerformanceSummary()

    // Check LCP
    const lcpMetrics = summary.webVitals['LCP']?.values || []
    if (lcpMetrics.length > 0) {
      const avgLCP = lcpMetrics.reduce((a, b) => a + b, 0) / lcpMetrics.length
      if (avgLCP > 2500) {
        suggestions.push('Large Contentful Paint is slow. Consider optimizing images and reducing server response times.')
      }
    }

    // Check FID
    const fidMetrics = summary.webVitals['FID']?.values || []
    if (fidMetrics.length > 0) {
      const avgFID = fidMetrics.reduce((a, b) => a + b, 0) / fidMetrics.length
      if (avgFID > 100) {
        suggestions.push('First Input Delay is high. Consider reducing JavaScript execution time and breaking up long tasks.')
      }
    }

    // Check CLS
    const clsMetrics = summary.webVitals['CLS']?.values || []
    if (clsMetrics.length > 0) {
      const avgCLS = clsMetrics.reduce((a, b) => a + b, 0) / clsMetrics.length
      if (avgCLS > 0.1) {
        suggestions.push('Cumulative Layout Shift is high. Ensure images have explicit dimensions and avoid inserting content above existing content.')
      }
    }

    // Check page load times
    if (summary.pageLoads.average > 3000) {
      suggestions.push('Page load times are slow. Consider implementing code splitting and lazy loading.')
    }

    return suggestions
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor()

// React hook for component performance monitoring
export function usePerformanceTimer(componentName: string) {
  const { useEffect, useRef } = require('react')
  const timerRef = useRef<(() => number) | null>(null)

  useEffect(() => {
    timerRef.current = performanceMonitor.startTimer(`Component:${componentName}`)

    return () => {
      if (timerRef.current) {
        timerRef.current()
      }
    }
  }, [componentName])

  return {
    logMetric: (name: string, value: number) => {
      performanceMonitor.logCustomMetric(`${componentName}:${name}`, value)
    }
  }
}

// Performance optimization utilities
export class PerformanceOptimizer {
  // Debounce function for performance
  static debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number,
    immediate?: boolean
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null

    return function executedFunction(...args: Parameters<T>) {
      const later = () => {
        timeout = null
        if (!immediate) func(...args)
      }

      const callNow = immediate && !timeout

      if (timeout) clearTimeout(timeout)
      timeout = setTimeout(later, wait)

      if (callNow) func(...args)
    }
  }

  // Throttle function for performance
  static throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean

    return function executedFunction(...args: Parameters<T>) {
      if (!inThrottle) {
        func.apply(this, args)
        inThrottle = true
        setTimeout(() => (inThrottle = false), limit)
      }
    }
  }

  // Lazy loading utility
  static createIntersectionObserver(
    callback: IntersectionObserverCallback,
    options?: IntersectionObserverInit
  ): IntersectionObserver | null {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return null
    }

    return new IntersectionObserver(callback, {
      rootMargin: '50px',
      threshold: 0.1,
      ...options
    })
  }

  // Image optimization
  static getOptimizedImageUrl(
    src: string,
    width?: number,
    height?: number,
    quality: number = 75
  ): string {
    // If using a service like Cloudinary, Imagekit, or similar
    // For now, return the original URL
    // In production, implement actual image optimization service
    
    const url = new URL(src, window.location.origin)
    
    if (width) url.searchParams.set('w', width.toString())
    if (height) url.searchParams.set('h', height.toString())
    url.searchParams.set('q', quality.toString())
    
    return url.toString()
  }

  // Preload critical resources
  static preloadResource(href: string, as: string, type?: string) {
    if (typeof document === 'undefined') return

    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = href
    link.as = as
    if (type) link.type = type

    document.head.appendChild(link)
  }

  // Bundle size analysis
  static analyzeBundleSize() {
    if (typeof window === 'undefined') return

    const scripts = Array.from(document.scripts)
    const totalSize = scripts.reduce((size, script) => {
      if (script.src && script.src.includes('/_next/')) {
        // Estimate size - in production, use actual bundle analysis
        return size + 100000 // 100KB estimate per script
      }
      return size
    }, 0)

    performanceMonitor.logCustomMetric('bundle_size_estimate', totalSize)
    
    if (totalSize > 1000000) { // 1MB
      console.warn('Large JavaScript bundle detected. Consider code splitting.')
    }
  }
}

// Initialize performance monitoring
if (typeof window !== 'undefined') {
  // Start monitoring when the page loads
  window.addEventListener('load', () => {
    setTimeout(() => {
      PerformanceOptimizer.analyzeBundleSize()
    }, 1000)
  })
}
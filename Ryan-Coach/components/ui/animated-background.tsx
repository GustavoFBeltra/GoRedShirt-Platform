'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface AnimatedBackgroundProps {
  variant?: 'mesh' | 'aurora' | 'waves' | 'particles' | 'grid' | 'default'
  className?: string
  interactive?: boolean
}

export function AnimatedBackground({ 
  variant = 'mesh', 
  className,
  interactive = false 
}: AnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef<number>(0)
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (variant === 'mesh') {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // Set canvas size
      const resizeCanvas = () => {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      }
      resizeCanvas()

      // Color palette with higher opacity for visibility
      const colors = [
        { r: 59, g: 130, b: 246, a: 0.4 },   // Blue
        { r: 147, g: 51, b: 234, a: 0.4 },   // Purple
        { r: 236, g: 72, b: 153, a: 0.4 },   // Pink
        { r: 16, g: 185, b: 129, a: 0.4 },   // Emerald
      ]

      // Gradient blobs configuration
      const blobs = colors.map((color, i) => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: 300 + Math.random() * 200,
        color
      }))

      const animate = () => {
        // Clear canvas with slight fade effect for trails
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        
        // Update and draw each blob
        blobs.forEach((blob, i) => {
          // Update position
          blob.x += blob.vx
          blob.y += blob.vy
          
          // Add some organic movement
          blob.vx += (Math.random() - 0.5) * 0.02
          blob.vy += (Math.random() - 0.5) * 0.02
          
          // Bounce off edges
          if (blob.x < -blob.radius) blob.x = canvas.width + blob.radius
          if (blob.x > canvas.width + blob.radius) blob.x = -blob.radius
          if (blob.y < -blob.radius) blob.y = canvas.height + blob.radius
          if (blob.y > canvas.height + blob.radius) blob.y = -blob.radius
          
          // Interactive mouse effect
          if (interactive) {
            const dx = mouseRef.current.x - blob.x
            const dy = mouseRef.current.y - blob.y
            const distance = Math.sqrt(dx * dx + dy * dy)
            if (distance < 200) {
              blob.vx += dx * 0.00003
              blob.vy += dy * 0.00003
            }
          }
          
          // Limit velocity
          blob.vx = Math.max(-1, Math.min(1, blob.vx))
          blob.vy = Math.max(-1, Math.min(1, blob.vy))
          
          // Create gradient
          const gradient = ctx.createRadialGradient(
            blob.x, blob.y, 0,
            blob.x, blob.y, blob.radius
          )
          gradient.addColorStop(0, `rgba(${blob.color.r}, ${blob.color.g}, ${blob.color.b}, ${blob.color.a})`)
          gradient.addColorStop(0.5, `rgba(${blob.color.r}, ${blob.color.g}, ${blob.color.b}, ${blob.color.a * 0.5})`)
          gradient.addColorStop(1, 'transparent')
          
          ctx.fillStyle = gradient
          ctx.fillRect(0, 0, canvas.width, canvas.height)
        })
        
        frameRef.current = requestAnimationFrame(animate)
      }

      animate()

      const handleResize = () => {
        resizeCanvas()
      }

      const handleMouseMove = (e: MouseEvent) => {
        if (interactive) {
          mouseRef.current = { x: e.clientX, y: e.clientY }
        }
      }

      window.addEventListener('resize', handleResize)
      window.addEventListener('mousemove', handleMouseMove)

      return () => {
        if (frameRef.current) {
          cancelAnimationFrame(frameRef.current)
        }
        window.removeEventListener('resize', handleResize)
        window.removeEventListener('mousemove', handleMouseMove)
      }
    }
  }, [variant, interactive])

  if (variant === 'mesh') {
    return (
      <div className={cn("fixed inset-0 -z-10", className)}>
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50/50 to-pink-50 dark:from-gray-950 dark:via-purple-950/20 dark:to-gray-950" />
        
        {/* Animated canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 opacity-60 dark:opacity-40 mix-blend-multiply dark:mix-blend-screen"
        />
        
        {/* Noise texture overlay for depth */}
        <div 
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] mix-blend-soft-light"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>
    )
  }

  // Aurora variant
  if (variant === 'aurora') {
    return (
      <div className={cn("fixed inset-0 -z-10 overflow-hidden", className)}>
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-purple-900/20 to-black" />
        <div className="absolute inset-0">
          <div className="absolute top-0 -left-4 w-full h-full bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 opacity-20 blur-3xl animate-aurora" />
          <div className="absolute top-0 -right-4 w-full h-full bg-gradient-to-l from-purple-400 via-pink-500 to-cyan-400 opacity-20 blur-3xl animate-aurora animation-delay-2000" />
          <div className="absolute -bottom-8 left-0 w-full h-full bg-gradient-to-t from-indigo-500 via-purple-500 to-pink-500 opacity-20 blur-3xl animate-aurora animation-delay-4000" />
        </div>
      </div>
    )
  }

  // Waves variant
  if (variant === 'waves') {
    return (
      <div className={cn("fixed inset-0 -z-10 overflow-hidden", className)}>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 opacity-10" />
        <svg
          className="absolute bottom-0 w-full h-full opacity-20"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 24 150 40"
          preserveAspectRatio="none"
          shapeRendering="auto"
        >
          <defs>
            <path
              id="wave"
              d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
            />
          </defs>
          <g className="animate-wave">
            <use xlinkHref="#wave" x="48" y="0" fill="rgba(147, 51, 234, 0.7)" />
            <use xlinkHref="#wave" x="48" y="3" fill="rgba(147, 51, 234, 0.5)" />
            <use xlinkHref="#wave" x="48" y="5" fill="rgba(147, 51, 234, 0.3)" />
            <use xlinkHref="#wave" x="48" y="7" fill="rgba(147, 51, 234, 0.2)" />
          </g>
        </svg>
      </div>
    )
  }

  // Grid variant
  if (variant === 'grid') {
    return (
      <div className={cn("fixed inset-0 -z-10 overflow-hidden", className)}>
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>
    )
  }

  // Default gradient background
  return (
    <div className={cn("fixed inset-0 -z-10", className)}>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950" />
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" />
        <div className="absolute top-40 right-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float animation-delay-2000" />
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float animation-delay-4000" />
      </div>
    </div>
  )
}
'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface UltimateBackgroundProps {
  className?: string
  interactive?: boolean
}

export function UltimateBackground({ className, interactive = true }: UltimateBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const particlesRef = useRef<any[]>([])
  const frameRef = useRef<number>(0)
  const [scrollY, setScrollY] = useState(0)

  // Particle system
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()

    // Initialize particles - More prominent and beautiful
    const initParticles = () => {
      particlesRef.current = []
      const particleCount = Math.min(120, window.innerWidth / 12) // More particles
      
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.4, // Slightly faster
          vy: (Math.random() - 0.5) * 0.4,
          size: Math.random() * 2.5 + 1, // Bigger particles
          opacity: Math.random() * 0.6 + 0.2, // Higher opacity
          color: {
            r: Math.random() * 60 + 140,  // Red spectrum from logo colors
            g: Math.random() * 30 + 20,   // Minimal green for red tones
            b: Math.random() * 40 + 25    // Minimal blue for red tones
          },
          connections: [],
          pulse: Math.random() * Math.PI * 2
        })
      }
    }

    initParticles()

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Update and draw particles
      particlesRef.current.forEach((particle, i) => {
        // Update position
        particle.x += particle.vx
        particle.y += particle.vy
        
        // Add mouse attraction
        if (interactive) {
          const dx = mouseRef.current.x - particle.x
          const dy = mouseRef.current.y - particle.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < 100) {
            particle.vx += dx * 0.00005
            particle.vy += dy * 0.00005
          }
        }
        
        // Boundary bounce with damping
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -0.9
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -0.9
        
        // Keep in bounds
        particle.x = Math.max(0, Math.min(canvas.width, particle.x))
        particle.y = Math.max(0, Math.min(canvas.height, particle.y))
        
        // Update pulse
        particle.pulse += 0.02
        const pulseSize = particle.size + Math.sin(particle.pulse) * 0.5
        
        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, pulseSize, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, ${particle.opacity})`
        ctx.fill()
        
        // Draw beautiful connections
        particlesRef.current.forEach((otherParticle, j) => {
          if (i !== j) {
            const dx = particle.x - otherParticle.x
            const dy = particle.y - otherParticle.y
            const distance = Math.sqrt(dx * dx + dy * dy)
            
            if (distance < 120) { // Longer connections
              const opacity = (120 - distance) / 120 * 0.15 // More visible
              ctx.beginPath()
              ctx.moveTo(particle.x, particle.y)
              ctx.lineTo(otherParticle.x, otherParticle.y)
              
              // Create GoRedShirt themed gradient line
              const gradient = ctx.createLinearGradient(
                particle.x, particle.y,
                otherParticle.x, otherParticle.y
              )
              gradient.addColorStop(0, `rgba(141, 20, 28, ${opacity})`) // #8d141c
              gradient.addColorStop(0.5, `rgba(186, 31, 35, ${opacity})`) // #ba1f23
              gradient.addColorStop(1, `rgba(204, 35, 41, ${opacity})`) // #cc2329
              
              ctx.strokeStyle = gradient
              ctx.lineWidth = 1
              ctx.stroke()
            }
          }
        })
      })
      
      frameRef.current = requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      resizeCanvas()
      initParticles()
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (interactive) {
        mouseRef.current = { x: e.clientX, y: e.clientY }
      }
    }

    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('scroll', handleScroll)

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [interactive])

  return (
    <div className={cn("fixed inset-0 -z-10 overflow-hidden", className)}>
      {/* Layer 1: Base Gradient with Animation */}
      <div className="absolute inset-0">
        {/* Light Mode - Smoother gradients */}
        <div className="absolute inset-0 dark:hidden">
          <div 
            className="absolute inset-0 opacity-40 animate-gradient-x"
            style={{
              background: 'linear-gradient(120deg, #f8fafc, #f1f5f9, #e2e8f0, #f1f5f9, #f8fafc)',
              backgroundSize: '300% 300%'
            }}
          />
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              background: 'linear-gradient(-60deg, #dbeafe, transparent, #e0e7ff, transparent, #ede9fe, transparent, #dbeafe)',
              backgroundSize: '600% 600%',
              animation: 'gradient-shift 25s ease-in-out infinite'
            }}
          />
        </div>
        
        {/* Dark Mode - Smoother gradients */}
        <div className="absolute inset-0 hidden dark:block">
          <div 
            className="absolute inset-0 opacity-30 animate-gradient-x"
            style={{
              background: 'linear-gradient(120deg, #0f172a, #1e1b4b, #0f172a, #1e1b4b, #0f172a)',
              backgroundSize: '300% 300%'
            }}
          />
          <div 
            className="absolute inset-0 opacity-15"
            style={{
              background: 'linear-gradient(-60deg, #1e40af, transparent, #7c3aed, transparent, #be185d, transparent, #1e40af)',
              backgroundSize: '600% 600%',
              animation: 'gradient-shift 30s ease-in-out infinite'
            }}
          />
        </div>
      </div>

      {/* Layer 2: Removed Aurora Ribbons - They were causing screen tearing */}

      {/* Layer 3: Floating Orbs with Parallax */}
      <div 
        className="absolute inset-0"
        style={{ transform: `translateY(${scrollY * 0.5}px)` }}
      >
        {/* Light Mode Orbs - GoRedShirt Subtle */}
        <div className="absolute inset-0 dark:hidden">
          <div className="absolute top-10 left-10 w-80 h-80 bg-gradient-to-br from-red-400/8 to-red-300/6 rounded-full blur-3xl animate-float" />
          <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-br from-red-500/10 to-red-400/8 rounded-full blur-3xl animate-bounce-slow" />
          <div className="absolute bottom-10 left-1/4 w-64 h-64 bg-gradient-to-br from-red-300/6 to-red-400/8 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute top-1/3 right-1/4 w-56 h-56 bg-gradient-to-br from-red-600/5 to-red-400/4 rounded-full blur-3xl animate-float animation-delay-2000" />
          <div className="absolute bottom-1/3 right-1/3 w-48 h-48 bg-gradient-to-br from-red-500/6 to-red-600/5 rounded-full blur-3xl animate-bounce-slow animation-delay-4000" />
        </div>
        
        {/* Dark Mode Orbs - GoRedShirt Subtle */}
        <div className="absolute inset-0 hidden dark:block">
          <div className="absolute top-10 left-10 w-80 h-80 bg-gradient-to-br from-red-600/12 to-red-500/8 rounded-full blur-3xl animate-float" />
          <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-br from-red-700/15 to-red-400/10 rounded-full blur-3xl animate-bounce-slow" />
          <div className="absolute bottom-10 left-1/4 w-64 h-64 bg-gradient-to-br from-red-500/10 to-red-600/12 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute top-1/3 right-1/4 w-56 h-56 bg-gradient-to-br from-red-800/8 to-red-500/6 rounded-full blur-3xl animate-float animation-delay-2000" />
          <div className="absolute bottom-1/3 right-1/3 w-48 h-48 bg-gradient-to-br from-red-600/10 to-red-700/8 rounded-full blur-3xl animate-bounce-slow animation-delay-4000" />
        </div>
      </div>

      {/* Layer 4: Prominent Interactive Particle System */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 opacity-70 dark:opacity-60 pointer-events-none"
      />

      {/* Layer 5: Noise Texture */}
      <div 
        className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03] mix-blend-soft-light"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Layer 6: Subtle Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.01] dark:opacity-[0.02]"
        style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.2) 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, rgba(147, 51, 234, 0.2) 1px, transparent 1px),
            radial-gradient(circle at 25% 75%, rgba(16, 185, 129, 0.2) 1px, transparent 1px),
            radial-gradient(circle at 75% 25%, rgba(236, 72, 153, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px, 100px 100px, 100px 100px, 100px 100px',
          backgroundPosition: '0 0, 50px 50px, 0 50px, 50px 0'
        }}
      />

      {/* Layer 7: Spotlight Effect (follows mouse) */}
      {interactive && (
        <div 
          className="absolute pointer-events-none transition-all duration-500 ease-out"
          style={{
            left: mouseRef.current.x - 200,
            top: mouseRef.current.y - 200,
            width: 400,
            height: 400,
            background: 'radial-gradient(circle, rgba(186, 31, 35, 0.04) 0%, transparent 70%)',
            borderRadius: '50%'
          }}
        />
      )}
    </div>
  )
}
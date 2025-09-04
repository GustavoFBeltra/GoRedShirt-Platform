'use client'

import { useAuth } from '@/lib/auth/context'
import { PerformanceWrapper, PerformanceMetrics } from '@/components/performance/performance-wrapper'
import { performanceMonitor } from '@/lib/performance/monitoring'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import { glassmorphism, animations, shadows } from '@/components/ui/theme-system'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, signOut, loading } = useAuth()
  const router = useRouter()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className={cn(
          "p-8 rounded-2xl",
          glassmorphism.card,
          "animate-fade-in",
          shadows.default
        )}>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-red-600 to-red-700 animate-pulse"></div>
            <div className="text-lg font-medium text-gray-700 dark:text-gray-300">Loading...</div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    router.push('/login')
    return null
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
  }

  return (
    <PerformanceWrapper componentName="DashboardLayout" trackRender trackInteractions>
      <div className="min-h-screen relative">
      {/* Enhanced Floating Pill Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50 pt-4">
        <div className="flex justify-center">
          <nav 
            className={cn(
              "animate-fade-in-down",
              animations.transition.smooth
            )}
          >
        {/* Floating pill container */}
        <div className="relative">
          {/* Glass morphism pill with enhanced blur */}
          <div className={cn(
            glassmorphism.nav,
            "rounded-full border border-white/30 dark:border-white/15",
            shadows.ultra,
            "shadow-black/5 dark:shadow-black/20",
            "hover:shadow-red-500/10 dark:hover:shadow-red-500/20",
            animations.transition.smooth
          )}>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/5 to-transparent rounded-full"></div>
            {/* Enhanced glow effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500/10 via-transparent to-red-500/10 rounded-full blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
          
            {/* Navigation content */}
            <div className="relative px-4 sm:px-6 py-3">
              <div className="flex items-center space-x-4 sm:space-x-8">
            
                {/* Enhanced Brand Section with Magnetic Effect */}
                <Link 
                  href="/dashboard" 
                  className={cn(
                    "group flex items-center space-x-2 sm:space-x-3 relative",
                    "hover:scale-105 hover:-translate-y-0.5",
                    "hover:drop-shadow-[0_8px_16px_rgba(220,38,38,0.25)]",
                    "transform-gpu will-change-transform",
                    animations.transition.default
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg",
                    "bg-gradient-to-br from-red-500/20 to-red-600/5 dark:from-red-400/15 dark:to-red-600/5",
                    "backdrop-blur-sm flex items-center justify-center",
                    "border border-red-500/25 dark:border-red-400/15",
                    "group-hover:rotate-6 group-hover:shadow-lg group-hover:shadow-red-600/30 group-hover:border-red-500/50",
                    animations.transition.default
                  )}>
                    <span className={cn(
                      "text-red-600 dark:text-red-400 font-bold text-sm",
                      "group-hover:scale-110",
                      animations.transition.transform
                    )}>
                      GR
                    </span>
                  </div>
                  <span className="text-lg font-bold bg-gradient-to-r from-gray-900 to-red-600 bg-clip-text text-transparent dark:from-white dark:to-red-400">
                    GoRedShirt
                  </span>
                </Link>

                {/* Separator */}
                <div className="h-6 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>

                {/* Enhanced User Info */}
                <div className="flex items-center space-x-4">
                  {/* User Avatar with Status */}
                  <div className="group relative">
                    <div className="relative">
                      {/* Avatar Container with Magnetic Hover */}
                      <div className={cn(
                        "w-10 h-10 rounded-full relative overflow-hidden",
                        "bg-gradient-to-br from-red-500/20 to-red-600/5 dark:from-red-400/15 dark:to-red-600/5",
                        "backdrop-blur-sm border border-white/40 dark:border-white/20",
                        "hover:scale-110 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-500/25",
                        "transform-gpu will-change-transform cursor-pointer",
                        animations.transition.default
                      )}>
                        {/* Avatar Image or Initials */}
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                            {user.email?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        </div>
                        
                        {/* Online Status Indicator */}
                        <div className={cn(
                          "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800",
                          "bg-green-500 animate-pulse"
                        )}></div>
                      </div>

                      {/* Hover Tooltip */}
                      <div className={cn(
                        "absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2",
                        "px-2 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900",
                        "text-xs rounded-md whitespace-nowrap opacity-0 pointer-events-none",
                        "group-hover:opacity-100 transition-opacity duration-200",
                        "before:absolute before:top-full before:left-1/2 before:transform before:-translate-x-1/2",
                        "before:border-4 before:border-transparent before:border-t-gray-900 dark:before:border-t-gray-100"
                      )}>
                        Online • {user.email}
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Role Badge */}
                  <div className="group relative">
                    <div className={cn(
                      "absolute -inset-0.5 bg-gradient-to-r from-red-600/20 via-red-500/20 to-red-700/20 rounded-full blur",
                      "opacity-0 group-hover:opacity-100",
                      animations.transition.default
                    )}></div>
                    <span className={cn(
                      "relative px-3 py-1 text-sm font-medium rounded-full border backdrop-blur-sm",
                      "bg-white/30 dark:bg-gray-900/30 text-gray-700 dark:text-gray-200",
                      "border-white/40 dark:border-white/20 group-hover:border-red-500/40",
                      "group-hover:scale-105 group-hover:-translate-y-0.5",
                      "transform-gpu will-change-transform",
                      animations.transition.default
                    )}>
                      {user.email === 'coach@testplatform.com' ? 'Coach' : (user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Client')}
                      
                      {/* Role-specific notification badge */}
                      {(user.role === 'client' || !user.role) && (
                        <div className={cn(
                          "absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full",
                          "flex items-center justify-center text-[10px] text-white font-bold",
                          "animate-bounce"
                        )}>
                          2
                        </div>
                      )}
                    </span>
                  </div>

                  {/* Enhanced Action Buttons */}
                  <div className="flex items-center space-x-2">
                    {/* Enhanced Theme Toggle with Progressive Disclosure */}
                    <div className="group relative">
                      <div className={cn(
                        "relative rounded-lg backdrop-blur-sm border p-1",
                        "bg-white/30 dark:bg-gray-800/30 border-white/40 dark:border-white/20",
                        "group-hover:bg-white/50 dark:group-hover:bg-gray-700/50",
                        "hover:scale-105 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-500/10",
                        "transform-gpu will-change-transform",
                        animations.transition.default
                      )}>
                        <ThemeToggle />
                      </div>

                      {/* Progressive Disclosure - Theme Options */}
                      <div className={cn(
                        "absolute top-full left-1/2 transform -translate-x-1/2 mt-2",
                        "opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto",
                        "transition-all duration-300 delay-200",
                        glassmorphism.card,
                        "p-2 rounded-lg border border-white/20 shadow-xl"
                      )}>
                        <div className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                          Theme Settings
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Sign Out Button with Progressive Disclosure */}
                    <div className="group relative">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleSignOut}
                        className={cn(
                          "group relative overflow-hidden backdrop-blur-sm text-sm",
                          "bg-white/30 dark:bg-gray-800/30 border-white/40 dark:border-white/20",
                          "hover:bg-white/50 dark:hover:bg-gray-700/50",
                          "hover:border-red-500/40 dark:hover:border-red-400/40",
                          "hover:scale-105 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-500/20",
                          "transform-gpu will-change-transform",
                          animations.transition.default
                        )}
                      >
                      <div className={cn(
                        "absolute inset-0 bg-gradient-to-r from-red-600/8 to-red-500/8",
                        "opacity-0 group-hover:opacity-100",
                        animations.transition.default
                      )}></div>
                      <span className="relative font-medium text-gray-700 dark:text-gray-200 group-hover:text-gray-800 dark:group-hover:text-gray-100">
                        Sign Out
                      </span>
                      </Button>

                      {/* Progressive Disclosure - Sign Out Options */}
                      <div className={cn(
                        "absolute top-full right-0 mt-2 w-48",
                        "opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto",
                        "transition-all duration-300 delay-300",
                        glassmorphism.card,
                        "p-3 rounded-lg border border-white/20 shadow-xl"
                      )}>
                        <div className="space-y-2">
                          <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                            Quick Actions
                          </div>
                          <div className="flex flex-col space-y-1">
                            <button className="text-xs text-left px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-950/50 text-gray-700 dark:text-gray-300">
                              Account Settings
                            </button>
                            <button className="text-xs text-left px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-950/50 text-gray-700 dark:text-gray-300">
                              Profile
                            </button>
                            <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                            <button 
                              onClick={handleSignOut}
                              className="text-xs text-left px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-950/50 text-red-600 dark:text-red-400 font-medium"
                            >
                              Sign Out
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
          </nav>
        </div>
      </div>

      {/* Main content with proper top spacing for floating pill */}
      <main className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      
      {/* Performance metrics overlay (development only) */}
      <PerformanceMetrics />
      </div>
    </PerformanceWrapper>
  )
}
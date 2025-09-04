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
      <nav 
        className={cn(
          "fixed top-4 z-50",
          "animate-fade-in-down",
          animations.transition.smooth
        )}
        style={{
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'fit-content'
        }}
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
            
                {/* Enhanced Brand Section */}
                <Link 
                  href="/dashboard" 
                  className={cn(
                    "group flex items-center space-x-2 sm:space-x-3",
                    "hover:scale-105",
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
                      animations.transition.default
                    )}>
                      {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Client'}
                    </span>
                  </div>

                  {/* Enhanced Action Buttons */}
                  <div className="flex items-center space-x-2">
                    {/* Enhanced Theme Toggle */}
                    <div className="group relative">
                      <div className={cn(
                        "relative rounded-lg backdrop-blur-sm border p-1",
                        "bg-white/30 dark:bg-gray-800/30 border-white/40 dark:border-white/20",
                        "group-hover:bg-white/50 dark:group-hover:bg-gray-700/50",
                        animations.transition.default
                      )}>
                        <ThemeToggle />
                      </div>
                    </div>

                    {/* Enhanced Sign Out Button */}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleSignOut}
                      className={cn(
                        "group relative overflow-hidden backdrop-blur-sm text-sm",
                        "bg-white/30 dark:bg-gray-800/30 border-white/40 dark:border-white/20",
                        "hover:bg-white/50 dark:hover:bg-gray-700/50",
                        "hover:border-red-500/40 dark:hover:border-red-400/40",
                        "hover:scale-105 hover:shadow-lg hover:shadow-red-500/10",
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

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
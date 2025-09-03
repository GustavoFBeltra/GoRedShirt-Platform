import { Suspense } from 'react'
import { LoginForm } from '@/components/auth/login-form'
import { UltimateBackground } from '@/components/ui/ultimate-background'
import { glassmorphism, shadows } from '@/components/ui/theme-system'
import { cn } from '@/lib/utils'

export default function LoginPage() {
  return (
    <div className="min-h-screen relative flex items-center justify-center">
      {/* Animated Background */}
      <UltimateBackground className="fixed inset-0" />
      
      <div className="relative z-10 w-full max-w-md px-4">
        <Suspense fallback={
          <div className={cn(
            "p-8 rounded-2xl text-center",
            glassmorphism.card,
            shadows.default,
            "animate-fade-in"
          )}>
            <div className="flex items-center justify-center gap-3">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-red-600 to-red-700 animate-pulse"></div>
              <div className="text-lg font-medium text-gray-700 dark:text-gray-300">Loading...</div>
            </div>
          </div>
        }>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
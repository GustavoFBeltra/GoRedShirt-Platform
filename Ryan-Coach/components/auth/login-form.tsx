'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useAuth } from '@/lib/auth/context'
import { 
  ThemeButton, 
  glassmorphism, 
  shadows, 
  animations, 
  textGradient 
} from '@/components/ui/theme-system'
import { cn } from '@/lib/utils'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [isPasswordFocused, setIsPasswordFocused] = useState(false)
  const { signIn } = useAuth()
  const router = useRouter()

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    console.log('Login form: Starting sign in process...')
    setIsLoading(true)
    setError(null)

    try {
      console.log('Login form: Calling signIn with email:', data.email)
      const { error } = await signIn(data.email, data.password)
      console.log('Login form: signIn returned:', { error })

      if (error) {
        console.error('Login form: Sign in error:', error)
        setError(error.message || 'An error occurred during sign in')
      } else {
        console.log('Login form: Sign in successful, redirecting...')
        router.push('/dashboard')
      }
    } catch (err) {
      console.error('Login form: Unexpected error during sign in:', err)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      console.log('Login form: Setting isLoading to false')
      setIsLoading(false)
    }
  }

  return (
    <div className="animate-fade-in-up">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className={cn(
            "w-12 h-12 rounded-xl",
            "bg-gradient-to-br from-red-500/20 to-red-600/10",
            "flex items-center justify-center",
            "border border-red-500/20",
            "animate-float",
            shadows.default
          )}>
            <span className="text-red-600 dark:text-red-400 font-bold text-xl">
              GR
            </span>
          </div>
        </div>
        <h1 className={cn("text-3xl font-bold mb-2", textGradient('primary'))}>
          Welcome Back
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Sign in to continue your athletic journey
        </p>
      </div>

      <Card className={cn(
        "w-full max-w-md mx-auto border-0",
        glassmorphism.card,
        shadows.strong,
        "animate-scale-in animation-delay-200"
      )}>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Sparkles className="h-5 w-5 text-red-600" />
            Sign In
          </CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      disabled={isLoading}
                      className="transition-all duration-200 focus:scale-[1.01] focus:shadow-md"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        disabled={isLoading}
                        className="pr-10 transition-all duration-200 focus:scale-[1.01] focus:shadow-md"
                        onFocus={() => setIsPasswordFocused(true)}
                        {...field}
                        onBlur={() => {
                          setIsPasswordFocused(false)
                          field.onBlur()
                        }}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent transition-all duration-200",
                          isPasswordFocused && "scale-110"
                        )}
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-500" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-500" />
                        )}
                        <span className="sr-only">
                          {showPassword ? "Hide password" : "Show password"}
                        </span>
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {error && (
              <div className={cn(
                "text-sm text-red-600 p-3 rounded-md border animate-fade-in-up animation-delay-500",
                "bg-red-50/80 dark:bg-red-950/30 border-red-200 dark:border-red-900/50",
                glassmorphism.card,
                shadows.default
              )}>
                {error}
              </div>
            )}

            <button
              type="submit"
              className={cn(
                "w-full group animate-scale-in animation-delay-600",
                "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800",
                "text-white px-4 py-2 rounded-lg font-medium",
                "focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2",
                "hover:-translate-y-1 transition-all duration-300",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : (
                <>
                  Sign In
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </Form>

        <div className="mt-6 text-center text-sm animate-fade-in-up animation-delay-700">
          Don't have an account?{' '}
          <Link href="/register" className={cn(
            "font-medium transition-all duration-200 hover:scale-105",
            textGradient('primary'),
            "hover:drop-shadow-sm"
          )}>
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
    </div>
  )
}
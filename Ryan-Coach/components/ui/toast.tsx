'use client'

import * as React from "react"
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ToastProps {
  id: string
  title: string
  description?: string
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  onClose?: () => void
}

const toastIcons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
}

const toastStyles = {
  success: "border-green-500 bg-green-50 dark:bg-green-950/50",
  error: "border-red-500 bg-red-50 dark:bg-red-950/50",
  warning: "border-yellow-500 bg-yellow-50 dark:bg-yellow-950/50",
  info: "border-blue-500 bg-blue-50 dark:bg-blue-950/50",
}

const iconStyles = {
  success: "text-green-600 dark:text-green-400",
  error: "text-red-600 dark:text-red-400",
  warning: "text-yellow-600 dark:text-yellow-400",
  info: "text-blue-600 dark:text-blue-400",
}

export function Toast({ title, description, type = 'info', onClose }: ToastProps) {
  const Icon = toastIcons[type]
  
  return (
    <div
      className={cn(
        "pointer-events-auto relative flex w-full max-w-md items-start gap-3 rounded-lg border-2 p-4 shadow-lg transition-all",
        "animate-slide-in-right",
        toastStyles[type]
      )}
    >
      <Icon className={cn("h-5 w-5 flex-shrink-0 mt-0.5", iconStyles[type])} />
      <div className="flex-1">
        <p className="text-sm font-semibold">{title}</p>
        {description && (
          <p className="mt-1 text-sm opacity-90">{description}</p>
        )}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-2 inline-flex rounded-md p-1.5 hover:bg-black/5 dark:hover:bg-white/5"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

export function ToastContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed bottom-0 right-0 z-50 flex max-h-screen w-full flex-col-reverse gap-2 p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
      {children}
    </div>
  )
}
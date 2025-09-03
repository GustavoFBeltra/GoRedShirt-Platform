'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { 
  Check, 
  Star, 
  Crown, 
  Zap, 
  Target,
  Users,
  Sparkles,
  ArrowRight
} from 'lucide-react'

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false)

  const plans = [
    {
      name: 'Athlete',
      description: 'Perfect for individual athletes getting started',
      icon: Target,
      monthlyPrice: 29,
      annualPrice: 290,
      popular: false,
      features: [
        'Coach matching & communication',
        'Basic recruiting profile',
        'Performance tracking',
        'Video upload & sharing',
        'College search tools',
        'Basic analytics',
        'Mobile app access',
        'Email support'
      ],
      cta: 'Start Free Trial',
      color: 'blue'
    },
    {
      name: 'Elite Athlete',
      description: 'Advanced tools for serious competitors',
      icon: Star,
      monthlyPrice: 79,
      annualPrice: 790,
      popular: true,
      features: [
        'Everything in Athlete plan',
        'Premium coach network',
        'Advanced recruiting tools',
        'Video analysis & feedback',
        'Scholarship search & alerts',
        'College connection tools',
        'Priority coach matching',
        'Advanced performance metrics',
        'Recruiting timeline planning',
        'Priority support'
      ],
      cta: 'Get Elite Access',
      color: 'red'
    },
    {
      name: 'Coach',
      description: 'For coaches building their practice',
      icon: Users,
      monthlyPrice: 99,
      annualPrice: 990,
      popular: false,
      features: [
        'Unlimited athlete connections',
        'Professional coach profile',
        'Payment processing (90% revenue)',
        'Scheduling & calendar tools',
        'Video coaching platform',
        'Performance tracking tools',
        'Marketing & discovery tools',
        'Analytics dashboard',
        'Client management system',
        'Priority support'
      ],
      cta: 'Start Coaching',
      color: 'green'
    },
    {
      name: 'Elite Coach',
      description: 'Premium tools for top-tier coaches',
      icon: Crown,
      monthlyPrice: 199,
      annualPrice: 1990,
      popular: false,
      features: [
        'Everything in Coach plan',
        'Premium marketplace placement',
        'Advanced athlete analytics',
        'Group coaching tools',
        'White-label options',
        'API access',
        'Custom integrations',
        'Dedicated account manager',
        '95% revenue share',
        '24/7 priority support'
      ],
      cta: 'Go Elite',
      color: 'purple'
    }
  ]

  const getPrice = (plan: typeof plans[0]) => {
    const price = isAnnual ? plan.annualPrice : plan.monthlyPrice
    const savings = isAnnual ? Math.round(((plan.monthlyPrice * 12) - plan.annualPrice) / (plan.monthlyPrice * 12) * 100) : 0
    return { price, savings }
  }

  const getColorClasses = (color: string, popular: boolean = false) => {
    const colors = {
      blue: {
        border: 'border-blue-200 dark:border-blue-800',
        bg: 'bg-blue-50 dark:bg-blue-900/10',
        button: 'bg-blue-600 hover:bg-blue-700',
        icon: 'text-blue-600 dark:text-blue-400'
      },
      red: {
        border: 'border-red-200 dark:border-red-800',
        bg: 'bg-red-50 dark:bg-red-900/10',
        button: 'bg-red-600 hover:bg-red-700',
        icon: 'text-red-600 dark:text-red-400'
      },
      green: {
        border: 'border-green-200 dark:border-green-800',
        bg: 'bg-green-50 dark:bg-green-900/10',
        button: 'bg-green-600 hover:bg-green-700',
        icon: 'text-green-600 dark:text-green-400'
      },
      purple: {
        border: 'border-purple-200 dark:border-purple-800',
        bg: 'bg-purple-50 dark:bg-purple-900/10',
        button: 'bg-purple-600 hover:bg-purple-700',
        icon: 'text-purple-600 dark:text-purple-400'
      }
    }

    return popular 
      ? {
          border: 'border-red-300 dark:border-red-600 ring-2 ring-red-200 dark:ring-red-800',
          bg: 'bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20',
          button: 'bg-red-600 hover:bg-red-700',
          icon: 'text-red-600 dark:text-red-400'
        }
      : colors[color as keyof typeof colors]
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
      {/* Header */}
      <div className="text-center mb-12">
        <Badge variant="outline" className="mb-4 bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
          <Sparkles className="w-3 h-3 mr-1" />
          Launch Special - 50% Off First Month
        </Badge>
        
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Choose Your Path to Success
        </h2>
        
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Start free, upgrade when you're ready. All plans include our core features.
        </p>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          <span className={`text-sm font-medium ${!isAnnual ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
            Monthly
          </span>
          <Switch
            checked={isAnnual}
            onCheckedChange={setIsAnnual}
            className="data-[state=checked]:bg-red-600"
          />
          <span className={`text-sm font-medium ${isAnnual ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
            Annual
          </span>
          <Badge variant="secondary" className="ml-2">
            Save up to 17%
          </Badge>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {plans.map((plan) => {
          const { price, savings } = getPrice(plan)
          const colorClasses = getColorClasses(plan.color, plan.popular)
          const PlanIcon = plan.icon

          return (
            <Card 
              key={plan.name} 
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl ${colorClasses.border} ${
                plan.popular ? 'scale-105 shadow-lg' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-red-600 to-red-700 text-white text-center py-2">
                  <span className="text-sm font-semibold flex items-center justify-center">
                    <Crown className="w-4 h-4 mr-1" />
                    Most Popular
                  </span>
                </div>
              )}

              <CardHeader className={`pb-4 ${plan.popular ? 'pt-12' : 'pt-6'} ${colorClasses.bg}`}>
                <div className="flex items-center justify-between mb-2">
                  <PlanIcon className={`w-8 h-8 ${colorClasses.icon}`} />
                  {savings > 0 && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                      Save {savings}%
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                <CardDescription className="text-sm">{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="pt-0">
                {/* Pricing */}
                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                      ${price}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 ml-1">
                      /{isAnnual ? 'year' : 'month'}
                    </span>
                  </div>
                  {isAnnual && (
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                      Equivalent to ${Math.round(price / 12)}/month
                    </p>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="w-4 h-4 text-green-600 dark:text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button 
                  className={`w-full ${colorClasses.button} text-white font-semibold py-2 px-4 rounded-md transition-all duration-300 group`}
                >
                  {plan.cta}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>

                {/* Free Trial Note */}
                <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-3">
                  14-day free trial • Cancel anytime
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Enterprise Section */}
      <Card className="border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
        <CardContent className="p-8 text-center">
          <div className="max-w-2xl mx-auto">
            <Crown className="w-12 h-12 text-gray-600 dark:text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Enterprise Solutions
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Custom solutions for large organizations, schools, and athletic programs. 
              Get dedicated support, custom integrations, and volume pricing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="outline" 
                className="border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500"
              >
                Contact Sales
              </Button>
              <Button 
                variant="ghost" 
                className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Request Demo
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <div className="text-center mt-12">
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Questions about our pricing? 
          <Button variant="link" className="p-0 ml-1 text-red-600 hover:text-red-700">
            View FAQ
          </Button>
        </p>
        <div className="flex items-center justify-center space-x-8 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <Check className="w-4 h-4 text-green-600 mr-2" />
            No setup fees
          </div>
          <div className="flex items-center">
            <Check className="w-4 h-4 text-green-600 mr-2" />
            Cancel anytime
          </div>
          <div className="flex items-center">
            <Check className="w-4 h-4 text-green-600 mr-2" />
            30-day money back
          </div>
        </div>
      </div>
    </div>
  )
}
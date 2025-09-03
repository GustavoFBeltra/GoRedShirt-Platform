import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
      	// GoRedShirt Theme System Extensions
      	animation: {
        	// Entrance animations
        	'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        	'fade-in-down': 'fadeInDown 0.6s ease-out forwards',
        	'fade-in-left': 'fadeInLeft 0.6s ease-out forwards',
        	'fade-in-right': 'fadeInRight 0.6s ease-out forwards',
        	'fade-in': 'fadeIn 0.6s ease-out forwards',
        	'scale-in': 'scaleIn 0.5s ease-out forwards',
        
        	// Floating and movement
        	'float': 'float 3s ease-in-out infinite',
        	'float-slow': 'floatSlow 4s ease-in-out infinite',
        	'breathe': 'breathe 2s ease-in-out infinite',
        	'bounce-slow': 'bounceSlow 3s ease-in-out infinite',
        	'bounce-gentle': 'bounceGentle 2s ease-in-out infinite',
        
        	// Pulse and glow effects
        	'pulse-slow': 'pulseSlow 3s ease-in-out infinite',
        	'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        	'red-glow': 'redGlow 3s ease-in-out infinite',
        	'slate-glow': 'slateGlow 3s ease-in-out infinite',
        	'text-glow': 'textGlow 2s ease-in-out infinite',
        
        	// Gradient animations
        	'gradient-x': 'gradientX 15s ease infinite',
        	'gradient-y': 'gradientY 15s ease infinite',
        	'gradient-xy': 'gradientXY 20s ease infinite',
        	'gradient-shift': 'gradientShift 25s ease-in-out infinite',
        
        	// Rotation and transform
        	'spin-slow': 'spinSlow 3s linear infinite',
        	'wiggle': 'wiggle 1s ease-in-out',
        	'float-rotate': 'floatRotate 8s ease-in-out infinite',
        	'scale-rotate': 'scaleRotate 4s ease-in-out infinite',
        
        	// Shimmer and sparkle
        	'shimmer': 'shimmer 2s infinite',
        	'sparkle': 'sparkle 1.5s ease-in-out infinite',
        
        	// Glass and reveal
        	'glass-reveal': 'glassReveal 0.8s ease-out forwards',
        	'slide-up-reveal': 'slideUpReveal 0.5s ease-out forwards',
        	'slide-down-reveal': 'slideDownReveal 0.5s ease-out forwards',
        	
        	// Progress animations
        	'progress-fill': 'progressFill 1s ease-out forwards',
        	'count-up': 'countUp 0.8s ease-out forwards',
        
        	// Particle effects
        	'particle-float': 'particleFloat 6s ease-in-out infinite',
        	'particle-glow': 'particleGlow 3s ease-in-out infinite'
      	},
      	keyframes: {
        	fadeInUp: {
          		from: { opacity: '0', transform: 'translateY(30px)' },
          		to: { opacity: '1', transform: 'translateY(0)' }
        	},
        	fadeInDown: {
          		from: { opacity: '0', transform: 'translateY(-30px)' },
          		to: { opacity: '1', transform: 'translateY(0)' }
        	},
        	fadeInLeft: {
          		from: { opacity: '0', transform: 'translateX(-30px)' },
          		to: { opacity: '1', transform: 'translateX(0)' }
        	},
        	fadeInRight: {
          		from: { opacity: '0', transform: 'translateX(30px)' },
          		to: { opacity: '1', transform: 'translateX(0)' }
        	},
        	fadeIn: {
          		from: { opacity: '0' },
          		to: { opacity: '1' }
        	},
        	scaleIn: {
          		from: { opacity: '0', transform: 'scale(0.9)' },
          		to: { opacity: '1', transform: 'scale(1)' }
        	},
        	float: {
          		'0%, 100%': { transform: 'translateY(0px)' },
          		'50%': { transform: 'translateY(-10px)' }
        	},
        	floatSlow: {
          		'0%, 100%': { transform: 'translateY(0px)' },
          		'50%': { transform: 'translateY(-20px)' }
        	},
        	breathe: {
          		'0%, 100%': { transform: 'scale(1)' },
          		'50%': { transform: 'scale(1.05)' }
        	},
        	bounceSlow: {
          		'0%, 20%, 53%, 80%, 100%': { transform: 'translateY(0)' },
          		'40%, 43%': { transform: 'translateY(-15px)' },
          		'70%': { transform: 'translateY(-7px)' },
          		'90%': { transform: 'translateY(-3px)' }
        	},
        	bounceGentle: {
          		'0%, 20%, 53%, 80%, 100%': { transform: 'translateY(0)' },
          		'40%, 43%': { transform: 'translateY(-8px)' },
          		'70%': { transform: 'translateY(-4px)' },
          		'90%': { transform: 'translateY(-2px)' }
        	},
        	pulseSlow: {
          		'0%, 100%': { opacity: '1' },
          		'50%': { opacity: '0.7' }
        	},
        	pulseGlow: {
          		'0%, 100%': { boxShadow: '0 0 5px rgba(220, 38, 38, 0.3)' },
          		'50%': { boxShadow: '0 0 20px rgba(220, 38, 38, 0.6), 0 0 30px rgba(220, 38, 38, 0.4)' }
        	},
        	gradientX: {
          		'0%, 100%': { backgroundPosition: '0% 50%' },
          		'50%': { backgroundPosition: '100% 50%' }
        	},
        	gradientY: {
          		'0%, 100%': { backgroundPosition: '50% 0%' },
          		'50%': { backgroundPosition: '50% 100%' }
        	},
        	gradientXY: {
          		'0%, 100%': { backgroundPosition: '0% 0%' },
          		'25%': { backgroundPosition: '100% 0%' },
          		'50%': { backgroundPosition: '100% 100%' },
          		'75%': { backgroundPosition: '0% 100%' }
        	},
        	gradientShift: {
          		'0%, 100%': { backgroundPosition: '0% 50%' },
          		'25%': { backgroundPosition: '100% 50%' },
          		'50%': { backgroundPosition: '100% 0%' },
          		'75%': { backgroundPosition: '0% 0%' }
        	},
        	spinSlow: {
          		from: { transform: 'rotate(0deg)' },
          		to: { transform: 'rotate(360deg)' }
        	},
        	wiggle: {
          		'0%, 7%': { transform: 'rotateZ(0)' },
          		'15%': { transform: 'rotateZ(-15deg)' },
          		'20%': { transform: 'rotateZ(10deg)' },
          		'25%': { transform: 'rotateZ(-10deg)' },
          		'30%': { transform: 'rotateZ(6deg)' },
          		'35%': { transform: 'rotateZ(-4deg)' },
          		'40%, 100%': { transform: 'rotateZ(0)' }
        	},
        	shimmer: {
          		'0%': { backgroundPosition: '-200% 0' },
          		'100%': { backgroundPosition: '200% 0' }
        	},
        	sparkle: {
          		'0%, 100%': { opacity: '0', transform: 'scale(0)' },
          		'50%': { opacity: '1', transform: 'scale(1)' }
        	},
        	redGlow: {
          		'0%, 100%': { boxShadow: '0 0 5px rgba(220, 38, 38, 0.2)' },
          		'50%': { boxShadow: '0 0 25px rgba(220, 38, 38, 0.5), 0 0 35px rgba(220, 38, 38, 0.3)' }
        	},
        	slateGlow: {
          		'0%, 100%': { boxShadow: '0 0 5px rgba(71, 85, 105, 0.2)' },
          		'50%': { boxShadow: '0 0 25px rgba(71, 85, 105, 0.5), 0 0 35px rgba(71, 85, 105, 0.3)' }
        	},
        	textGlow: {
          		'0%, 100%': { textShadow: '0 0 5px rgba(220, 38, 38, 0.3)' },
          		'50%': { textShadow: '0 0 20px rgba(220, 38, 38, 0.8), 0 0 30px rgba(220, 38, 38, 0.6)' }
        	},
        	glassReveal: {
          		from: { backdropFilter: 'blur(0px)', background: 'rgba(255, 255, 255, 0)' },
          		to: { backdropFilter: 'blur(16px)', background: 'rgba(255, 255, 255, 0.8)' }
        	},
        	floatRotate: {
          		'0%': { transform: 'translateY(0px) rotate(0deg)' },
          		'25%': { transform: 'translateY(-10px) rotate(90deg)' },
          		'50%': { transform: 'translateY(-20px) rotate(180deg)' },
          		'75%': { transform: 'translateY(-10px) rotate(270deg)' },
          		'100%': { transform: 'translateY(0px) rotate(360deg)' }
        	},
        	scaleRotate: {
          		'0%, 100%': { transform: 'scale(1) rotate(0deg)' },
          		'50%': { transform: 'scale(1.1) rotate(180deg)' }
        	},
        	slideUpReveal: {
          		from: { transform: 'translateY(100%)', opacity: '0' },
          		to: { transform: 'translateY(0%)', opacity: '1' }
        	},
        	slideDownReveal: {
          		from: { transform: 'translateY(-100%)', opacity: '0' },
          		to: { transform: 'translateY(0%)', opacity: '1' }
        	},
        	progressFill: {
          		from: { width: '0%' },
          		to: { width: '100%' }
        	},
        	countUp: {
          		from: { transform: 'translateY(100%)' },
          		to: { transform: 'translateY(0%)' }
        	},
        	particleFloat: {
          		'0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          		'33%': { transform: 'translateY(-30px) rotate(120deg)' },
          		'66%': { transform: 'translateY(30px) rotate(240deg)' }
        	},
        	particleGlow: {
          		'0%, 100%': { filter: 'brightness(1) blur(0px)' },
          		'50%': { filter: 'brightness(1.5) blur(2px)' }
        	}
      	},
      	// Extended backdrop blur for glassmorphism
      	backdropBlur: {
        	'xs': '2px',
        	'3xl': '64px',
        	'4xl': '128px'
      	},
      	// Animation delays
      	animationDelay: {
        	'100': '100ms',
        	'200': '200ms',
        	'300': '300ms',
        	'400': '400ms',
        	'500': '500ms',
        	'600': '600ms',
        	'700': '700ms',
        	'800': '800ms',
        	'1000': '1000ms',
        	'1500': '1500ms',
        	'2000': '2000ms',
        	'3000': '3000ms',
        	'4000': '4000ms',
        	'5000': '5000ms'
      	}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
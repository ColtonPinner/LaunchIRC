/** @type {import('tailwindcss').Config} */
const { heroui } = require("@heroui/theme");

module.exports = {
    darkMode: ["class"],
    content: [
      "./index.html",
      "./src/**/*.{ts,tsx,js,jsx}",
      "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
    ],
  theme: {
	  	extend: {
		borderRadius: {
			xl: 'var(--radius)',
			lg: 'calc(var(--radius) - 2px)',
			md: 'calc(var(--radius) - 4px)',
			sm: '0.25rem',
			'2xl': '1.5rem',
			'3xl': '1.75rem'
		},
		boxShadow: {
			sm: '0 1px 2px 0 hsl(222 47% 11% / 0.05)',
			md: '0 10px 28px -24px hsl(222 47% 11% / 0.24)',
			lg: '0 18px 46px -34px hsl(222 47% 11% / 0.3)',
			xl: '0 22px 54px -38px hsl(222 47% 11% / 0.32)',
			'2xl': '0 28px 70px -44px hsl(222 47% 11% / 0.36)',
			soft: '0 10px 30px -26px hsl(222 47% 11% / 0.22)',
			elevated: '0 18px 46px -34px hsl(222 47% 11% / 0.3)'
		},
		colors: {
			gold: 'hsl(var(--gold))',
			panel: 'hsl(var(--surface-panel))',
			raised: 'hsl(var(--surface-raised))',
			outline: 'hsl(var(--outline))',
			inverse: {
				DEFAULT: 'hsl(var(--inverse-surface))',
				foreground: 'hsl(var(--inverse-foreground))'
			},
			glow: {
				coral: 'hsl(var(--glow-coral))',
				blue: 'hsl(var(--glow-blue))',
				green: 'hsl(var(--glow-green))'
			},
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
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
		fontFamily: {
			sans: ['var(--font-body)'],
  			heading: ['var(--font-heading)'],
  			body: ['var(--font-body)'],
  			display: ['var(--font-display)'],
  			mono: ['var(--font-mono)']
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
  			'fade-up': {
  				from: {
  					opacity: '0',
  					transform: 'translateY(12px)'
  				},
  				to: {
  					opacity: '1',
  					transform: 'translateY(0)'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			'fade-up': 'fade-up 0.5s ease-out both'
  		}
  	}
  },
	plugins: [require("tailwindcss-animate"), heroui()],
}

import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      fontFamily: {
        'playfair': ['"Playfair Display"', 'Georgia', 'serif'],
        'cormorant': ['"Cormorant Garamond"', 'Georgia', 'serif'],
        'dm': ['"DM Sans"', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      colors: {
        gold: {
          DEFAULT: '#D4AF37',
          light: '#E8C547',
          dark: '#B8940F',
          muted: 'rgba(212, 175, 55, 0.4)',
        },
        obsidian: {
          DEFAULT: '#0A0805',
          light: '#12100C',
        },
        mahogany: {
          DEFAULT: '#1A0F08',
          light: '#221510',
        },
        bronze: {
          DEFAULT: '#8B6914',
        },
        ivory: {
          DEFAULT: '#F5F0E6',
          muted: '#E8DCC8',
        },
        champagne: '#F7E7CE',
        border: 'rgba(212, 175, 55, 0.15)',
        input: 'rgba(26, 15, 8, 0.6)',
        ring: '#D4AF37',
        background: '#0A0805',
        foreground: '#F5F0E6',
        primary: {
          DEFAULT: '#D4AF37',
          foreground: '#0A0805',
        },
        secondary: {
          DEFAULT: '#1A0F08',
          foreground: '#C8B589',
        },
        destructive: {
          DEFAULT: '#B43030',
          foreground: '#F5F0E6',
        },
        muted: {
          DEFAULT: '#191210',
          foreground: '#8C7A65',
        },
        accent: {
          DEFAULT: '#1A0F08',
          foreground: '#D4AF37',
        },
        popover: {
          DEFAULT: '#120E09',
          foreground: '#F5F0E6',
        },
        card: {
          DEFAULT: '#0F0C09',
          foreground: '#F5F0E6',
        },
        royal: {
          50: '#fdf8e8',
          100: '#f9edb9',
          200: '#f4dc82',
          300: '#E8C547',
          400: '#D4AF37',
          500: '#C4A028',
          600: '#B8940F',
          700: '#9A7B0A',
          800: '#7D6308',
          900: '#5E4A06',
        },
        luxury: {
          950: '#0A0805',
          900: '#1A0F08',
          800: '#2A2420',
          700: '#3D3028',
          600: '#524035',
          500: '#6B5442',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background, 10 8 5))',
          foreground: '#F5F0E6',
          primary: '#D4AF37',
          'primary-foreground': '#0A0805',
          accent: '#1A0F08',
          'accent-foreground': '#D4AF37',
          border: 'rgba(212, 175, 55, 0.1)',
          ring: '#D4AF37',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      boxShadow: {
        'gold': '0 0 20px rgba(212, 175, 55, 0.25)',
        'gold-lg': '0 8px 40px rgba(212, 175, 55, 0.35)',
        'royal': '0 24px 60px rgba(0,0,0,0.6), 0 0 40px rgba(212, 175, 55, 0.06)',
        'card': '0 4px 24px rgba(0,0,0,0.4)',
        'glow': '0 0 30px rgba(212, 175, 55, 0.2)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #D4AF37 0%, #E8C547 50%, #B8940F 100%)',
        'royal-gradient': 'linear-gradient(135deg, #D4AF37 0%, #B8940F 100%)',
        'gold-shimmer': 'linear-gradient(90deg, #D4AF37 0%, #F7E7CE 50%, #D4AF37 100%)',
        'obsidian-gradient': 'linear-gradient(145deg, rgba(26, 15, 8, 0.95) 0%, rgba(15, 12, 10, 0.98) 100%)',
        'hero-overlay': 'linear-gradient(to right, rgba(10,8,5,0.82) 0%, rgba(10,8,5,0.45) 55%, rgba(10,8,5,0.2) 100%)',
        'card-shine': 'linear-gradient(145deg, rgba(212, 175, 55, 0.05) 0%, transparent 50%)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'luxury-gradient': 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #111111 100%)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-12px) rotate(1deg)' },
          '66%': { transform: 'translateY(6px) rotate(-1deg)' },
        },
        'gold-pulse': {
          '0%, 100%': { boxShadow: '0 0 15px rgba(212, 175, 55, 0.15)' },
          '50%': { boxShadow: '0 0 35px rgba(212, 175, 55, 0.35)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        'blink': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'marquee': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.7s ease-out forwards',
        'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
        'slide-up': 'slide-up 0.9s cubic-bezier(0.23, 1, 0.32, 1) forwards',
        'scale-in': 'scale-in 0.5s ease-out forwards',
        'float': 'float 4s ease-in-out infinite',
        'gold-pulse': 'gold-pulse 3s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'blink': 'blink 1.2s ease-in-out infinite',
        'spin-slow': 'spin-slow 8s linear infinite',
        'marquee': 'marquee 30s linear infinite',
      },
    }
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;

// import type { Config } from "tailwindcss";

// export default {
// 	darkMode: ["class"],
// 	content: [
// 		"./pages/**/*.{ts,tsx}",
// 		"./components/**/*.{ts,tsx}",
// 		"./app/**/*.{ts,tsx}",
// 		"./src/**/*.{ts,tsx}",
// 	],
// 	prefix: "",
// 	theme: {
// 		container: {
// 			center: true,
// 			padding: '2rem',
// 			screens: {
// 				'2xl': '1400px'
// 			}
// 		},
// 		extend: {
// 			fontFamily: {
// 				'inter': ['Inter', 'sans-serif'],
// 			},
// 			colors: {
// 				border: 'hsl(var(--border))',
// 				input: 'hsl(var(--input))',
// 				ring: 'hsl(var(--ring))',
// 				background: 'hsl(var(--background))',
// 				foreground: 'hsl(var(--foreground))',
// 				primary: {
// 					DEFAULT: 'hsl(var(--primary))',
// 					foreground: 'hsl(var(--primary-foreground))'
// 				},
// 				secondary: {
// 					DEFAULT: 'hsl(var(--secondary))',
// 					foreground: 'hsl(var(--secondary-foreground))'
// 				},
// 				destructive: {
// 					DEFAULT: 'hsl(var(--destructive))',
// 					foreground: 'hsl(var(--destructive-foreground))'
// 				},
// 				muted: {
// 					DEFAULT: 'hsl(var(--muted))',
// 					foreground: 'hsl(var(--muted-foreground))'
// 				},
// 				accent: {
// 					DEFAULT: 'hsl(var(--accent))',
// 					foreground: 'hsl(var(--accent-foreground))'
// 				},
// 				popover: {
// 					DEFAULT: 'hsl(var(--popover))',
// 					foreground: 'hsl(var(--popover-foreground))'
// 				},
// 				card: {
// 					DEFAULT: 'hsl(var(--card))',
// 					foreground: 'hsl(var(--card-foreground))'
// 				},
// 				sidebar: {
// 					DEFAULT: 'hsl(var(--sidebar-background))',
// 					foreground: 'hsl(var(--sidebar-foreground))',
// 					primary: 'hsl(var(--sidebar-primary))',
// 					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
// 					accent: 'hsl(var(--sidebar-accent))',
// 					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
// 					border: 'hsl(var(--sidebar-border))',
// 					ring: 'hsl(var(--sidebar-ring))'
// 				},
// 				// Premium brand colors
// 				royal: {
// 					50: '#f0f4ff',
// 					100: '#e0e7ff',
// 					200: '#c7d2fe',
// 					300: '#a5b4fc',
// 					400: '#818cf8',
// 					500: '#6366f1',
// 					600: '#4f46e5',
// 					700: '#4338ca',
// 					800: '#3730a3',
// 					900: '#312e81',
// 				},
// 				luxury: {
// 					950: '#0a0a0a',
// 					900: '#111111',
// 					800: '#1a1a1a',
// 					700: '#262626',
// 					600: '#404040',
// 				}
// 			},
// 			borderRadius: {
// 				lg: 'var(--radius)',
// 				md: 'calc(var(--radius) - 2px)',
// 				sm: 'calc(var(--radius) - 4px)'
// 			},
// 			keyframes: {
// 				'accordion-down': {
// 					from: {
// 						height: '0'
// 					},
// 					to: {
// 						height: 'var(--radix-accordion-content-height)'
// 					}
// 				},
// 				'accordion-up': {
// 					from: {
// 						height: 'var(--radix-accordion-content-height)'
// 					},
// 					to: {
// 						height: '0'
// 					}
// 				},
// 				'fade-in': {
// 					'0%': {
// 						opacity: '0',
// 						transform: 'translateY(20px)'
// 					},
// 					'100%': {
// 						opacity: '1',
// 						transform: 'translateY(0)'
// 					}
// 				},
// 				'slide-up': {
// 					'0%': {
// 						opacity: '0',
// 						transform: 'translateY(40px)'
// 					},
// 					'100%': {
// 						opacity: '1',
// 						transform: 'translateY(0)'
// 					}
// 				},
// 				'scale-in': {
// 					'0%': {
// 						opacity: '0',
// 						transform: 'scale(0.9)'
// 					},
// 					'100%': {
// 						opacity: '1',
// 						transform: 'scale(1)'
// 					}
// 				},
// 				'float': {
// 					'0%, 100%': { transform: 'translateY(0px)' },
// 					'50%': { transform: 'translateY(-10px)' }
// 				},
// 				'blink': {
// 					'0%, 100%': { opacity: '1' },
// 					'50%': { opacity: '0' }
// 				},
// 				'blink-fast': {
// 					'0%, 100%': { opacity: '1' },
// 					'50%': { opacity: '0' }
// 				}
// 			},
// 			animation: {
// 				'accordion-down': 'accordion-down 0.2s ease-out',
// 				'accordion-up': 'accordion-up 0.2s ease-out',
// 				'fade-in': 'fade-in 0.6s ease-out',
// 				'slide-up': 'slide-up 0.8s ease-out',
// 				'scale-in': 'scale-in 0.5s ease-out',
// 				'float': 'float 3s ease-in-out infinite',
// 				'blink': 'blink 1s ease-in-out infinite',
// 				'blink-fast': 'blink-fast 0.6s ease-in-out infinite'
// 			},
// 			backgroundImage: {
// 				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
// 				'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
// 				'luxury-gradient': 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #111111 100%)',
// 				'royal-gradient': 'linear-gradient(135deg, #312e81 0%, #4338ca 50%, #6366f1 100%)',
// 			}
// 		}
// 	},
// 	plugins: [require("tailwindcss-animate")],
// } satisfies Config;

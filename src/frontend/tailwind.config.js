/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    colors: {
      primary: {
        50: '#EFF6FF',
        100: '#DBEAFE',
        400: '#60A5FA',
        500: '#1E40AF',
        600: '#1E3A8A',
        700: '#1E3A8A',
        900: '#0C2340',
      },
      success: {
        50: '#DCFCE7',
        100: '#BBF7D0',
        500: '#10B981',
        900: '#065F46',
      },
      warning: {
        50: '#FED7AA',
        100: '#FDBA74',
        500: '#F97316',
        900: '#7C2D12',
      },
      error: {
        50: '#FEE2E2',
        100: '#FECACA',
        500: '#DC2626',
        900: '#7F1D1D',
      },
      neutral: {
        50: '#F9FAFB',
        100: '#F3F4F6',
        200: '#E5E7EB',
        400: '#9CA3AF',
        500: '#6B7280',
        600: '#4B5563',
        700: '#374151',
        900: '#1F2937',
      },
      white: '#FFFFFF',
    },
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
    },
    borderRadius: {
      DEFAULT: '6px',
      lg: '8px',
      md: '6px',
      sm: '4px',
      full: '9999px',
    },
    boxShadow: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      base: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    },
    extend: {},
  },
}

import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

const config = defineConfig({
  globalCss: {
    'html, body': {
      colorScheme: 'light',
      bg: '#faf9fb',
      color: '#28262C',
    },
  },
  theme: {
    tokens: {
      fonts: {
        heading: { value: "'Outfit', sans-serif" },
        body: { value: "'Outfit', sans-serif" },
        mono: { value: "'Outfit', sans-serif" },
      },
      colors: {
        purple: {
          50: { value: '#F9F5FF' },
          100: { value: '#EDE5FE' },
          200: { value: '#D4C2FC' },
          300: { value: '#BAA0F0' },
          400: { value: '#998FC7' },
          500: { value: '#7B6DB8' },
          600: { value: '#5A4DA0' },
          700: { value: '#3D3588' },
          800: { value: '#14248A' },
          900: { value: '#0D1870' },
          950: { value: '#080E50' },
        },
      },
      radii: {
        xs: { value: '4px' },
        sm: { value: '6px' },
        md: { value: '10px' },
        lg: { value: '14px' },
        xl: { value: '18px' },
        '2xl': { value: '22px' },
        '3xl': { value: '30px' },
      },
      spacing: {
        '1': { value: '6px' },
        '2': { value: '10px' },
        '3': { value: '14px' },
        '4': { value: '18px' },
        '5': { value: '22px' },
        '6': { value: '26px' },
        '7': { value: '30px' },
        '8': { value: '34px' },
        '9': { value: '38px' },
        '10': { value: '42px' },
        '12': { value: '52px' },
        '14': { value: '60px' },
        '16': { value: '68px' },
      },
    },
    recipes: {
      button: {
        base: {
          transition: 'background 0.18s ease, opacity 0.18s ease',
        },
        variants: {
          variant: {
            solid: {
              background: 'linear-gradient(135deg, #998FC7 0%, #14248A 100%)',
              color: 'white',
              _hover: {
                background: 'linear-gradient(135deg, #BAA0F0 0%, #3D3588 100%)',
              },
              _active: {
                background: 'linear-gradient(135deg, #7B6DB8 0%, #0D1870 100%)',
                transform: 'scale(0.97)',
              },
            },
            ghost: {
              _active: {
                opacity: 0.7,
                transform: 'scale(0.97)',
              },
            },
            outline: {
              _active: {
                opacity: 0.7,
                transform: 'scale(0.97)',
              },
            },
          },
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);

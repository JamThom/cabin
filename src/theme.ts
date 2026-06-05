import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

const config = defineConfig({
  globalCss: {
    'html, body': {
      colorScheme: 'light',
      bg: '#faf9fb',
      color: '#28262C',
    },
    '.md-content h1, .md-content h2, .md-content h3, .md-content h4': {
      fontWeight: 'semibold',
      marginTop: '1em',
      marginBottom: '0.25em',
    },
    '.md-content h1': { fontSize: '1.4em' },
    '.md-content h2': { fontSize: '1.2em' },
    '.md-content h3': { fontSize: '1.05em' },
    '.md-content p': { marginBottom: '0.75em' },
    '.md-content ul, .md-content ol': { paddingLeft: '1.5em', marginBottom: '0.75em' },
    '.md-content li': { marginBottom: '0.25em' },
    '.md-content strong': { fontWeight: 'semibold' },
    '.md-content em': { fontStyle: 'italic' },
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
    slotRecipes: {
      tabs: {
        slots: ['trigger', 'list'],
        base: {
          list: {
            borderBottom: '2px solid',
            borderColor: 'border',
            mx: '-30px',
            px: '30px',
          },
          trigger: {
            minWidth: 'fit-content',
            flex: '1',
            justifyContent: 'center',
            border: '0',
            borderBottom: '2px solid transparent',
            borderRadius: '0',
            marginBottom: '-2px',
            _selected: {
              borderBottomColor: 'colorPalette.500',
              color: 'colorPalette.600',
            },
          },
        },
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
            inline: {
              background: 'transparent',
              borderWidth: '0',
              padding: '0',
              minW: 'auto',
              w: 'auto',
              h: 'auto',
              _hover: {
                background: 'transparent',
              },
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

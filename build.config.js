import { build } from 'esbuild';

// Build the server with proper external dependencies
await build({
  entryPoints: ['server/index.ts'],
  bundle: true,
  platform: 'node',
  format: 'esm',
  outdir: 'dist',
  external: [
    // Node.js built-in modules
    'fs', 'path', 'url', 'crypto', 'stream', 'util', 'events', 'buffer',
    'querystring', 'http', 'https', 'net', 'tls', 'zlib', 'os', 'child_process',
    // All npm packages should be external for production
    'express', 'ws', 'openai', '@twilio/voice-sdk', 'drizzle-orm',
    'zod', 'zod-validation-error', 'passport', 'passport-local',
    'express-session', 'connect-pg-simple', 'memorystore',
    'class-variance-authority', 'clsx', 'cmdk', 'date-fns',
    'embla-carousel-react', 'framer-motion', 'input-otp', 'lucide-react',
    'next-themes', 'react', 'react-dom', 'react-hook-form', 'react-icons',
    'react-resizable-panels', 'recharts', 'tailwind-merge', 'tailwindcss-animate',
    'tw-animate-css', 'vaul', 'wouter', '@hookform/resolvers', '@tanstack/react-query',
    '@radix-ui/react-accordion', '@radix-ui/react-alert-dialog', '@radix-ui/react-aspect-ratio',
    '@radix-ui/react-avatar', '@radix-ui/react-checkbox', '@radix-ui/react-collapsible',
    '@radix-ui/react-context-menu', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu',
    '@radix-ui/react-hover-card', '@radix-ui/react-label', '@radix-ui/react-menubar',
    '@radix-ui/react-navigation-menu', '@radix-ui/react-popover', '@radix-ui/react-progress',
    '@radix-ui/react-radio-group', '@radix-ui/react-scroll-area', '@radix-ui/react-select',
    '@radix-ui/react-separator', '@radix-ui/react-slider', '@radix-ui/react-slot',
    '@radix-ui/react-switch', '@radix-ui/react-tabs', '@radix-ui/react-toast',
    '@radix-ui/react-toggle', '@radix-ui/react-toggle-group', '@radix-ui/react-tooltip',
    'react-day-picker', '@neondatabase/serverless', 'drizzle-kit',
    // Development dependencies that should never be bundled
    'vite', '@vitejs/plugin-react', 'typescript', 'tsx', 'esbuild',
    'tailwindcss', 'autoprefixer', 'postcss', '@types/node',
    '@types/express', '@types/react', '@types/react-dom', '@types/ws',
    '@replit/vite-plugin-cartographer', '@replit/vite-plugin-runtime-error-modal'
  ],
  define: {
    'process.env.NODE_ENV': '"production"'
  },
  banner: {
    js: `
// Production build - disable Vite imports
const originalImport = globalThis.__import || globalThis.import;
globalThis.__import = function(specifier) {
  if (specifier === 'vite' || specifier.includes('vite')) {
    return Promise.resolve({
      createServer: () => { throw new Error('Vite not available in production'); },
      createLogger: () => ({ error: console.error, warn: console.warn, info: console.info }),
      default: {}
    });
  }
  return originalImport(specifier);
};
`
  }
});

console.log('Server build completed');
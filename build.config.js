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
    // Runtime dependencies that should be available
    'express', 'ws', 'openai', '@twilio/voice-sdk', 'drizzle-orm',
    'zod', 'zod-validation-error', 'passport', 'passport-local',
    'express-session', 'connect-pg-simple', 'memorystore',
    // Development dependencies that should be excluded
    'vite', '@vitejs/plugin-react', 'typescript', 'tsx'
  ],
  define: {
    'process.env.NODE_ENV': '"production"'
  }
});

console.log('Server build completed');
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouterVite({ target: 'react', autoCodeSplitting: false }),
    react(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-dom/client',
      'axios',
      'mobx',
      'mobx-react-lite',
      '@tanstack/react-query',
      '@tanstack/react-router',
      'recharts',
      'lucide-react',
      'clsx',
      'tailwind-merge',
      'class-variance-authority',
      'zod',
      'react-hook-form',
      '@hookform/resolvers/zod',
      'sonner',
      'date-fns',
      'js-cookie',
      'store2'
    ]
  },
  server: {
    port: 5000,
    host: '0.0.0.0',
    allowedHosts: true,
    watch: {
      ignored: ['**/.cache/**', '**/node_modules/**', '**/server/**']
    },
    warmup: {
      clientFiles: [
        './src/main.tsx',
        './src/app.tsx',
        './src/routes/__root.tsx',
        './src/routes/_authenticated/**/*.tsx',
        './src/features/dashboard/**/*.tsx',
        './src/components/layout/**/*.tsx',
        './src/store/**/*.ts'
      ]
    },
    proxy: {
      '/api/local': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false
      }
    }
  }
});

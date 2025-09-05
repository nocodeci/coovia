import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouterVite({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
  ],
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components/ui': path.resolve(__dirname, './components/ui'),
      '@/config': path.resolve(__dirname, './config'),
      '@/docs': path.resolve(__dirname, './docs'),
      '@/scripts': path.resolve(__dirname, './scripts'),
      // fix loading all icon chunks in dev mode
      '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs',
    },
  },
  
  // Optimisations de build
  build: {
    target: 'esnext',
    minify: 'terser',
    sourcemap: false,
    
    // Code splitting optimisé
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendors séparés
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-select'],
          'query-vendor': ['@tanstack/react-query', '@tanstack/react-query-devtools'],
          'router-vendor': ['@tanstack/react-router'],
          'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
          'animation-vendor': ['framer-motion'],
          'icons-vendor': ['lucide-react', '@tabler/icons-react'],
          
          // Features par domaine
          'product-features': [
            '@/components/ui/optimized/product-card',
          ],
          'media-features': [
            '@/components/MediaSelectorDialog',
          ],
          'cart-features': [
            '@/hooks/use-optimized-products',
          ],
        },
        
        // Optimisation des assets
        assetFileNames: (assetInfo) => {
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name || '')) {
            return `assets/images/[name]-[hash][extname]`
          }
          if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name || '')) {
            return `assets/fonts/[name]-[hash][extname]`
          }
          return `assets/[name]-[hash][extname]`
        },
      },
    },
    
    // Optimisations Terser
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
      },
    },
    
    // Chunk size warnings
    chunkSizeWarningLimit: 1000,
  },
  
  // Optimisations de développement
  server: {
    watch: {
      ignored: [
        '**/routeTree.gen.ts',
        '**/node_modules/**',
        '**/.git/**',
      ],
    },
    
    // Préchargement des modules critiques
    hmr: {
      overlay: false,
    },
  },
  
  // Optimisations CSS
  css: {
    devSourcemap: false,
  },
  
  // Optimisations d'assets
  assetsInclude: ['**/*.webp', '**/*.avif'],
})

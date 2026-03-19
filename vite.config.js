import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      inlineRegisterType: 'inline',
      
      manifest: {
        name: 'Pedido Rápido - Sistema de Pedidos',
        short_name: 'Pedido Rápido',
        description: 'Sistema completo de pedidos para lanchonetes com cardápio digital, integração WhatsApp e painel administrativo',
        theme_color: '#f97316',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        orientation: 'portrait-primary',
        
        icons: [
          {
            src: '/logo-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/logo-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/logo-maskable.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          }
        ],
        
        categories: ['business', 'productivity', 'shopping'],
        
        shortcuts: [
          {
            name: 'Ver Cardápio',
            short_name: 'Cardápio',
            description: 'Acesse o cardápio da sua lanchonete',
            url: '/?view=cardapio',
            icons: [{ 
              src: '/logo-192.png', 
              sizes: '192x192',
              type: 'image/png'
            }]
          },
          {
            name: 'Painel Admin',
            short_name: 'Admin',
            description: 'Acesse o painel administrativo',
            url: '/?view=admin',
            icons: [{ 
              src: '/logo-192.png', 
              sizes: '192x192',
              type: 'image/png'
            }]
          }
        ],
        
        screenshots: [
          {
            src: '/screenshot-mobile.png',
            sizes: '540x720',
            form_factor: 'narrow',
            type: 'image/png'
          },
          {
            src: '/screenshot-desktop.png',
            sizes: '1280x720',
            form_factor: 'wide',
            type: 'image/png'
          }
        ]
      },

      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,gif,webp}'],
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        
        runtimeCaching: [
          // Cache Supabase - Network First (tenta internet, se não tiver usa cache)
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-api',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 24 * 60 * 60 // 24 horas
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          
          // Cache WhatsApp - Network First
          {
            urlPattern: /^https:\/\/wa\.me\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'whatsapp-api'
            }
          },
          
          // Cache Google Fonts - Cache First (offline first)
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts'
            }
          },
          
          // Cache CDN Tailwind - Cache First
          {
            urlPattern: /^https:\/\/cdn\.tailwindcss\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'tailwind-cdn'
            }
          },
          
          // Cache imagens - Cache First com limite
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 7 * 24 * 60 * 60 // 7 dias
              }
            }
          }
        ]
      },

      devOptions: {
        enabled: true,
        suppressWarnings: true
      }
    })
  ],
  
  server: {
    port: 3000,
    strictPort: false,
    host: true
  },
  
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    chunkSizeWarningLimit: 1000
  }
})

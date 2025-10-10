import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    legacy({
      targets: [
        'defaults',
        'iOS >= 12',
        'Safari >= 12',
        'Android >= 5',
        'Chrome >= 49'
      ],
      modernPolyfills: true,
      additionalLegacyPolyfills: ['regenerator-runtime/runtime']
    })
  ],
  build: {
    // Raise the warning threshold to reflect realistic modern bundle sizes
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        // Create better vendor chunking to avoid one giant bundle
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'vendor_react'
            if (id.includes('antd')) return 'vendor_antd'
            if (id.includes('@ant-design')) return 'vendor_ant_icons'
            if (id.includes('dayjs')) return 'vendor_dayjs'
            return 'vendor_misc'
          }
        }
      }
    }
  }
})

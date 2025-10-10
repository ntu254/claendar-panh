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
})

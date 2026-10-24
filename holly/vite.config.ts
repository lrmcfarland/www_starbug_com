import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

// Read string from environment, split by commas, or default to localhost
const allowedHostsEnv = process.env.VITE_ALLOWED_HOSTS
  ? process.env.VITE_ALLOWED_HOSTS.split(',')
  : ['localhost'];

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: allowedHostsEnv
  },
  // If running "vite preview" on your deployment server, configure this too
  preview: {
    allowedHosts: allowedHostsEnv
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    alias: {
      'primereact/select': path.resolve(__dirname, './src/__mocks__/primereact/select.ts'),
      'primereact/api': path.resolve(__dirname, './src/__mocks__/primereact/api.ts'),
      'primereact/cascadeselect': path.resolve(__dirname, './src/__mocks__/primereact/cascadeselect.ts'),
    }
  }
});

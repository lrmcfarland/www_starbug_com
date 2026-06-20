import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

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
  }
});

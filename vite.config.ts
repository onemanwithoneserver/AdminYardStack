import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  base: '/AdminYardStack/',
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      'lucide-react': path.resolve(__dirname, 'src/components/MuiIcons.tsx'),
    },
  },
})


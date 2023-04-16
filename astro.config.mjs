import { defineConfig } from 'astro/config'
import vercel from '@astrojs/vercel/serverless'

// https://astro.build/config
import solidJs from '@astrojs/solid-js'

// https://astro.build/config
import mdx from '@astrojs/mdx'
import suidPlugin from '@suid/vite-plugin'

// https://astro.build/config
export default defineConfig({
  integrations: [solidJs(), mdx()],
  output: 'server',
  adapter: vercel(),
  vite: {
    plugins: [suidPlugin()],
    build: {
      target: 'esnext',
    },
  },
})

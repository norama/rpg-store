import { defineConfig } from 'astro/config'
import firebase from 'astro-firebase'

// https://astro.build/config
import solidJs from '@astrojs/solid-js'

// https://astro.build/config
import mdx from '@astrojs/mdx'
import suidPlugin from '@suid/vite-plugin'

// https://astro.build/config
export default defineConfig({
  integrations: [solidJs(), mdx()],
  output: 'server',
  adapter: firebase(),
  vite: {
    plugins: [suidPlugin()],
    build: {
      target: 'esnext',
    },
  },
})

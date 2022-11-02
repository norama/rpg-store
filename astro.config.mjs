import { defineConfig } from 'astro/config';

// https://astro.build/config
import solidJs from '@astrojs/solid-js';

// https://astro.build/config
import netlify from "@astrojs/netlify/functions";

// https://astro.build/config
export default defineConfig({
  integrations: [solidJs()],
  output: 'server',
  adapter: netlify()
});
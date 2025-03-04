import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import node from '@astrojs/node';

import GeoTaggerPlugin from '@recogito/plugin-geotagging';

export default defineConfig({
  integrations: [
    react(),
    GeoTaggerPlugin()
  ],
  devToolbar: {
    enabled: false
  },
  adapter: node({
    mode: 'standalone'
  })
});
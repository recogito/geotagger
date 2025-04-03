# Recogito GeoTagger Plugin

A geo-tagging plugin for Recogito.

## Installation: Recogito Studio 1.5

Since Recogito Studio v1.5, plugins are implemented as [Astro Integrations](https://astro.build/integrations/). Therefore, the installation process has changed! For Recogito Studio 1.5, use the latest published version
of this plugin (v0.3).

1. Install the plugin package via npm

```
npm install @recogito/plugin-geotagging
```

2. Configure the plugin in the `astro.config.mjs` file:

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import netlify from '@astrojs/netlify';

// Import the plugin
import GeoTaggingPlugin from '@recogito/plugin-geotagging';

export default defineConfig({
  integrations: [
    react(),
    // Add the plugin to the integrations list
    GeoTaggingPlugin()
  ],
  output: 'server',
  adapter: netlify(),
  vite: {
    ssr: {
      noExternal: ['clsx', '@phosphor-icons/*', '@radix-ui/*']
    },
    optimizeDeps: {
      esbuildOptions: {
        target: 'esnext'
      }
    }
  }
});
```

3. Restart the Recogito Studio client.

## Installation: Recogito Studio 1.4

For Recogito Studio 1.4 or older, you **must use v0.1 of this plugin**. Newer versions of the plugin
require at least Recogito Studio 1.5. 

- Go to the folder where your `recogito-client` is installed.
- Go into the `/plugins` folder.
- Clone the source code for v0.1 of this plugin into the current folder.

```
git clone --branch v0.1 https://github.com/recogito/geotagger.git
```

- Go back to the root folder of your `recogito-client` installation 
- Run `npm install`
- Restart the Recogito Studio client.

## Acknowledgements

Development of the geo-tagging plugin was supported by the Open University's [Open Societal Challenges](https://societal-challenges.open.ac.uk/) Programme and the [ATRIUM](https://atrium-research.eu/) research project.
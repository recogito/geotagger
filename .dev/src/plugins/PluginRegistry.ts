import type { Extension, Plugin } from '@recogito/studio-sdk';

let registry: Plugin[] = [];

try {
  const mod = await import('./generated/registered.json', { assert: { type: 'json' } });
  registry = mod.default;
} catch {
  // File doesn't exist yet, use empty registry
  registry = [];
}

export const PluginRegistry = {

  listPlugins: (): Plugin[] => {
    return [...registry];
  },

  enumerateExtensions: (): { extension: Extension, plugin: Plugin }[] => {
    return registry.reduce<{extension: Extension, plugin: Plugin}[]>((all, plugin) => 
      ([...all, ...(plugin.extensions || []).map(extension => ({ extension, plugin }))]), []);
  }
  
}
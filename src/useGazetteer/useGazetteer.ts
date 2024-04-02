import { useEffect } from 'react';
import { useSharedPluginState, type PluginInstallationConfig } from '@components/Plugins';
import type { Gazetteer } from '../Types';
import { createGeoJSONGazetteer, createWHGazetteer, createWikidataGazetteer } from './gazetteers';

export const useGazetteer = (plugin: PluginInstallationConfig): Gazetteer | undefined => {

  const { state, setState } = useSharedPluginState<{ gazetteer?: Gazetteer }>(plugin.meta.id);

  const datasource = plugin.settings.plugin_settings?.datasource?.type || 'wikidata';

  useEffect(() => {
    const gazetteer = state?.gazetteer;

    // Gazetteer already cached
    if (gazetteer) return;

    // No cached gazetteer - create new instance
    if (datasource === 'geojson') {
      createGeoJSONGazetteer(plugin).then(gazetteer => setState({ gazetteer }));
    } else if (datasource === 'whg') {
      setState({ gazetteer: createWHGazetteer() });
    } else /* Wikidata default */ {
      setState({ gazetteer: createWikidataGazetteer() });
    }
  }, []);

  return state?.gazetteer;

}
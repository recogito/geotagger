import { useEffect } from 'react';
import { Plugin, useSharedPluginState } from '@recogito/studio-sdk';
import type { Gazetteer } from '../Types';
import { createCoreDataGazetteer, createGeoJSONGazetteer, createWHGazetteer, createWikidataGazetteer } from './gazetteers';

export const useGazetteer = (plugin: Plugin, settings: any): Gazetteer | undefined => {

  const { state, setState } = useSharedPluginState<{ gazetteer?: Gazetteer }>(plugin.name);

  const datasource = settings.plugin_settings?.datasource?.type || 'wikidata';

  useEffect(() => {
    const gazetteer = state?.gazetteer;

    // Gazetteer already cached
    if (gazetteer) return;

    // No cached gazetteer - create new instance
    if (datasource === 'geojson') {
      createGeoJSONGazetteer(settings).then(gazetteer => setState({ gazetteer }));
    } else if (datasource === 'whg') {
      setState({ gazetteer: createWHGazetteer() });
    } else if (datasource === 'coredata') {
      setState({ gazetteer: createCoreDataGazetteer(plugin) });
    } else /* Wikidata default */ {
      setState({ gazetteer: createWikidataGazetteer() });
    }
  }, []);

  return state?.gazetteer;

}
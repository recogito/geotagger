import { useEffect } from 'react';
import Fuse from 'fuse.js';
import { Plugin, useSharedPluginState } from '@recogito/studio-sdk';
import { 
  createCoreDataGazetteer, 
  createGeoJSONGazetteer, 
  createWHGazetteer, 
  createWikidataGazetteer 
} from './connectors';
import type { 
  CrossGazetteerSearchable, 
  GazetteerDefinition, 
  GazetteerSearchable, 
  GeoJSONFeature, 
  GeoTaggerInstanceSettings 
} from 'src/Types';

const rerankResults = (features: GeoJSONFeature[], query: string) => {
  const fuse = new Fuse<GeoJSONFeature>(features, { 
    keys: [ '@id', 'properties.title', 'properties.description' ],
    shouldSort: true,
    includeScore: true,
    threshold: 0.9,
    useExtendedSearch: true
  });

  return fuse.search(query).map(r => r.item);
}

export const useGazetteerSearch = (
  plugin: Plugin, 
  settings?: GeoTaggerInstanceSettings
): CrossGazetteerSearchable | undefined => {

  const { state, setState } = useSharedPluginState<CrossGazetteerSearchable | undefined>(plugin.name);

  const datasources = settings?.gazetteers || [{ type: 'wikidata' }];

  useEffect(() => {
    const search = state?.search;

    // Gazetteer search already cached
    if (search) return;

    // No cached gazetteer search - create new instance
    const gazetteers = Promise.all(datasources.map(source => {
      if (source.type === 'geojson')
        // Must download GeoJSON file first
        return createGeoJSONGazetteer(source).then(gazetteer => ({ source, gazetteer }));
      else if (source.type === 'whg')
        // No need to download - resolve instantly
        return Promise.resolve({ source, gazetteer: createWHGazetteer() });
      else if (source.type === 'coredata')
        return Promise.resolve({ source, gazetteer: createCoreDataGazetteer(plugin) });
      else if (source.type === 'wikidata')
        return Promise.resolve({ source, gazetteer: createWikidataGazetteer() });
    })).then(g => g.filter(Boolean)) as Promise<{ source: GazetteerDefinition, gazetteer: GazetteerSearchable }[]>;

    gazetteers.then(gazetteers => {
      // Cross-gazetteer search
      const crossSearch = (query: string, limitPerSource?: number, searchIn?: string[]) => {
        const toSearch = searchIn ? gazetteers.filter(({ source, gazetteer }) =>
          searchIn.includes(source.id)
        ) : gazetteers;

        return Promise.all(toSearch.map(({ gazetteer }) => gazetteer.search(query, limitPerSource)))
          // Flatten and re-rank search results into a more sensible order
          .then(responses => rerankResults(responses.flat(), query))
      }

      setState({ search: crossSearch });
    });
  }, []);

  return state;

}
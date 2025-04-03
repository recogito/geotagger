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
  CrossGazetteerSearchResult,
  CrossGazetteerSearchable, 
  GazetteerDefinition, 
  GazetteerSearchable, 
  GeoTaggerInstanceSettings 
} from 'src/Types';

const rerankResults = (results: CrossGazetteerSearchResult[], query: string) => {
  const fuse = new Fuse<CrossGazetteerSearchResult>(results, { 
    keys: [ 'feature.id', 'feature.properties.title', 'feature.properties.description' ],
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
        const toSearch = searchIn 
          ? gazetteers.filter(({ source }) => searchIn.includes(source.id)) 
          : gazetteers;

        return Promise.all(toSearch.map(({ gazetteer }) => gazetteer.search(query, limitPerSource)))
          // Flatten and re-rank search results into a more sensible order
          .then(responses => { 
            // Retain relation result -> source gazetteer
            const flattened = responses.reduce<CrossGazetteerSearchResult[]>((results, batch, idx) => {
              const gazetteer = toSearch[idx]!.source.id;
              return [...results, ...batch.map(feature => ({ gazetteer, feature }))];
            }, []);

            return rerankResults(flattened, query)
          })
      }

      setState({ search: crossSearch });
    });
  }, []);

  return state;

}
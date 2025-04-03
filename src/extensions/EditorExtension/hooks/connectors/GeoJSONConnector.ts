import Fuse from 'fuse.js';
import type { GazetteerDefinition, GazetteerSearchable, GeoJSONFeature } from 'src/Types';

export const createGeoJSONGazetteer = (source: GazetteerDefinition): Promise<GazetteerSearchable> => 
  fetch(source.url!)
    .then(res => res.json())
    .then(data => {
      const features = data.features.map((f: any) => {
        // Sigh... Linked Places IDs
        const { '@id' : lpId, id, ...rest } = f;
        const identifier = id || lpId;

        return {
          ...rest,
          id: identifier
        };
      }) as GeoJSONFeature[];

      const fuse = new Fuse<GeoJSONFeature>(features, { 
        keys: [ 'id', 'properties.title', 'properties.description' ],
        shouldSort: true,
        includeScore: true,
        threshold: 0.2,
        useExtendedSearch: true
      });

      const search = (query: string, limit?: number) => {    
        const results = fuse.search(query, { limit: limit || 10 })
          .filter(r => r.score && r.score < 0.2)
          .map(r => r.item);
    
        return Promise.resolve(results);
      }

      return { search };
    });
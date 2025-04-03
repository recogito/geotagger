import { WBK } from 'wikibase-sdk';
import type { GazetteerSearchable, GeoJSONFeature } from 'src/Types';

// Simple LRU cache for memo-izing search results
const cache = new Map<string, GeoJSONFeature[]>();

const parseWKTPoint = (wkt?: string) => {
  if (!wkt) return;

  const regex = /Point\((-?\d+\.\d+) (-?\d+\.\d+)\)/;
  
  const match = wkt.match(regex);

  if (match && match.length === 3) {
    const lon = parseFloat(match[1]);
    const lat = parseFloat(match[2]);
    return [lon, lat];
  }
}
 
export const createWikidataGazetteer = (): GazetteerSearchable => {

  const wd = WBK({
    instance: 'https://www.wikidata.org',
    sparqlEndpoint: 'https://query.wikidata.org/sparql'
  });

  const search = (query: string, _?: number): Promise<GeoJSONFeature[]> => {
    // Bit of a hack, for UX purposes. Wikidata is slow, and limit doesn't really matter,
    // so we always fetch 100. This way, the "Quicksearch" query will alread popuplate
    // the cache for the actual search.
    const limit = 100;

    const cached = cache.get(query);
    if (cached && cached.length >= limit)
      return Promise.resolve(cached);

    const lang = 'en'; // Could make this configurable in the future
    
    /**
     * List of types suggested by Claude, and then manually verified to remove
     * and correct hallucinations...
     */
    const sparql = `
      SELECT DISTINCT ?item ?itemLabel ?description ?coordinates WHERE {
        VALUES ?plabel { "${query.toLowerCase()}" }
        
        SERVICE wikibase:mwapi {
          bd:serviceParam wikibase:api "EntitySearch" .
          bd:serviceParam wikibase:endpoint "www.wikidata.org" .
          bd:serviceParam mwapi:search ?plabel .
          bd:serviceParam mwapi:language "${lang}" .
          ?item wikibase:apiOutputItem mwapi:item .
        }
        
        ?item schema:description ?description .

        ?item wdt:P31/wdt:P279* ?type .
        VALUES ?type {
          wd:Q486972    # human settlement
          wd:Q515       # city
          wd:Q6256      # country
          wd:Q3624078   # sovereign state
          wd:Q82794     # geographic region
          wd:Q23442     # island
          wd:Q8502      # mountain
          wd:Q46831     # mountain system
          wd:Q165       # sea
          wd:Q34763     # peninsula
          wd:Q39816     # valley
          wd:Q34876     # province
          wd:Q5119      # capital city
          wd:Q56061     # administrative territorial entity
          wd:Q3624078   # sovereign state
          wd:Q15642541  # human-geographic territorial entity
          wd:Q107390    # federated state
          wd:Q23397     # lake
          wd:Q4022      # river
          wd:Q34038     # waterfall
          wd:Q355304    # watercourse
          wd:Q15324     # body of water
          wd:Q2221906   # geographic location
          wd:Q149621    # district
          wd:Q123705    # neighbourhood
        }

        OPTIONAL {
          ?item wdt:P625 ?coordinates .
        }
          
        SERVICE wikibase:label { 
          bd:serviceParam wikibase:language "${lang}".
        }
        
        FILTER(LANG(?description) = "${lang}") .
      } LIMIT ${limit}
      `;

    const url = wd.sparqlQuery(sparql);

    return fetch(url)
      .then(response => response.json())
      .then(data => { 
        const results = (data.results.bindings as any[])
          .reduce<any[]>((distinct, result) => {
            // For reasons beyond comprehension, Wikidata results can include
            // duplicates. (Despite the DISTINCT clause.) This filters them out.
            const exists = distinct.some(a => a.item.value === result.item.value);
            return exists ? distinct : [...distinct, result];
          }, []).map(result => {
            const { item, itemLabel, description } = result;
            
            const coordinates = parseWKTPoint(result.coordinates?.value);

            return {
              id: item.value,
              properties: {
                title: itemLabel.value,
                description: description.value
              },
              geometry: coordinates ? {
                type: 'Point',
                coordinates
              } : undefined
            } as GeoJSONFeature;
          });

        // Just clear the cache if it's larger than 10
        if (cache.size > 10) cache.clear();

        cache.set(query, results);

        return results;
      });
  }

  return { search };

}
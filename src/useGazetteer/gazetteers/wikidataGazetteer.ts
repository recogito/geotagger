import { WBK } from 'wikibase-sdk';
import type { Gazetteer, GeoJSONFeature } from '../../Types';

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
 
export const createWikidataGazetteer = (): Gazetteer => {

  const wd = WBK({
    instance: 'https://www.wikidata.org',
    sparqlEndpoint: 'https://query.wikidata.org/sparql'
  });

  const search = (query: string, limit: number = 10): Promise<GeoJSONFeature[]> => {
    const lang = 'en'; // Could make this configurable in the future
    
    const sparql = `
      SELECT ?item ?itemLabel ?description ?coordinates WHERE {
        VALUES ?plabel { "${query.toLowerCase()}" }
        
        SERVICE wikibase:mwapi {
          bd:serviceParam wikibase:api "EntitySearch" .
          bd:serviceParam wikibase:endpoint "www.wikidata.org" .
          bd:serviceParam mwapi:search ?plabel .
          bd:serviceParam mwapi:language "${lang}" .
          ?item wikibase:apiOutputItem mwapi:item .
        }
        
        ?item schema:description ?description .

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
      // @ts-ignore
      .then(data => data.results.bindings.map(result => {
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
        }
      }));
  }

  return { search };

}
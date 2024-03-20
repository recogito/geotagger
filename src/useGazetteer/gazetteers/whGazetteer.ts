import type { Gazetteer, GeoJSONFeature } from '../../Types';

export const createWHGazetteer = (): Gazetteer => {

  const search = (query: string): Promise<GeoJSONFeature[]> =>
    fetch(`https://whgazetteer.org/api/index/?name=${query}`)
      .then(res => res.json())
      .then(results => results.features.map((f: GeoJSONFeature) => ({
        ...f,
        // @ts-ignore
        id: `https://whgazetteer.org/places/${f.properties['index_id']}/portal`
      })));

  return { search };

}
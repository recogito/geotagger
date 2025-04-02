import type { GazetteerSearchable, GeoJSONFeature } from 'src/Types';

export const createWHGazetteer = (): GazetteerSearchable => {

  const search = (query: string): Promise<GeoJSONFeature[]> =>
    fetch(`https://whgazetteer.org/api/index/?name=${query}`)
      .then(res => res.json())
      .then(results => 
        results.features.map((f: GeoJSONFeature) => {
          return {
            ...f,
            // @ts-ignore
            id: `https://whgazetteer.org/places/${f.properties['index_id']}/portal`
          };
        }).filter((f: GeoJSONFeature) => {
          // Only support point geometries for now
          return Boolean(f.geometry) && f.geometry.type === 'Point'
        })
      );

  return { search };

}
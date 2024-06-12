import { SearchClient } from 'typesense';
import type { PluginInstallationConfig } from '@components/Plugins';
import type { Gazetteer, GeoJSONFeature } from '../../Types';

export const createCoreDataGazetteer = (
  plugin: PluginInstallationConfig
): Gazetteer => {
  const config = {
    nodes: [
      {
        host: plugin.meta.options.core_data_config.host,
        port: plugin.meta.options.core_data_config.port,
        protocol: 'https'
      },
    ],
    apiKey: plugin.meta.options.core_data_config.api_key
  };

  const client = new SearchClient(config);

  const search = (query: string): Promise<GeoJSONFeature[]> => 
    client
      .collections(plugin.meta.options.core_data_config.collection_name)
      .documents()
      .search({ q: query, query_by: plugin.meta.options.core_data_config.query_by }, {})
      .then(results => (results.hits || []).map(hit => {
        const document = hit.document as any;
        return {
          id: document.uuid,
          type: 'Feature',
          properties: {
            title: document.name
          },
          geometry: {
            type: 'Point',
            coordinates: [...document.coordinates.reverse()]
          }
        }
      }));

  return { search };

}
import type { User } from '@annotorious/react';

export interface Gazetteer {

  search(query: string, limit?: number): Promise<GeoJSONFeature[]>;

}

export interface GeoJSONFeature {

  id: string;

  properties: {

    title: string;

    description?: string;

  },

  geometry: {

    type: 'Point',

    coordinates: number[];

  }

}

export interface GeoTag {

  feature: GeoJSONFeature;

  confirmed?: {

    by?: User;

    at?: Date;

  }

}

export interface DataSource {

  id: string;

  name?: string;

  type: 'geojson' | 'whg' | 'wikidata';

  url?: string;

}

export interface GeoJSONGazetteerPreset {

  preset_id: string;

  preset_name: string;

  file_url: string;

}
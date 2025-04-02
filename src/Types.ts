import type { User } from '@annotorious/react';

export interface GeoJSONGazetteerPreset {

  preset_id: string;

  preset_name: string;

  file_url: string;

}

export interface BasemapConfig {

  name?: string;
  
  attribution?: string; 

  url: string;

}

export interface GeoTaggerInstanceSettings {

  gazetteers: GazetteerDefinition[];

  basemap: BasemapConfig;

}

export interface GazetteerDefinition {

  id: string;

  name?: string;

  type: 'coredata' | 'geojson' | 'whg' | 'wikidata';

  url?: string;

}

export interface GazetteerSearchable {

  search(query: string, limit?: number): Promise<GeoJSONFeature[]>;

}

export interface CrossGazetteerSearchable {

  search(query: string, limitPerSource?: number, searchIn?: string[]): Promise<GeoJSONFeature[]>;

}

export interface GeoJSONFeature {

  id: string;

  type: 'Feature',

  properties: {

    title: string;

    description?: string;

  }

  geometry: {

    type: 'Point',

    coordinates: number[];

  }

}

export interface GeoTag {

  feature?: GeoJSONFeature;

  confirmed?: {

    by?: User;

    at?: Date;

  }

}
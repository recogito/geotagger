import { useAnnotations } from '@annotorious/react';
import type { SupabaseAnnotation } from '@recogito/annotorious-supabase';
import { useMemo } from 'react';
import type { GeoJSONFeature } from './Types';

export interface GeoTagFeature extends GeoJSONFeature {

  properties: {

    title: string;

    description?: string;

    quote?: string;
    
  }

}

// Utility hook based on useAnnotations that returns all annotations with geotags
export const useGeoAnnotations = () => {
  const annotations = useAnnotations<SupabaseAnnotation>();

  const geoannotations = useMemo(() => 
    annotations.filter(a => a.bodies.some(b => b.purpose === 'geotagging')), [annotations]);

  return geoannotations;
}

// Utility hook based on useAnnotations that returns all geotag bodies
export const useGeotagFeatures = () => {

  const annotations = useAnnotations<SupabaseAnnotation>();

  const geotags = useMemo(() => annotations
    .reduce<GeoTagFeature[]>((all, annotation) => {
      const selectors = Array.isArray(annotation.target.selector) 
        ? annotation.target.selector : [annotation.target.selector];

      const quote = selectors[0].quote;

      const features = annotation.bodies
        .filter(b => b.purpose === 'geotagging' && b.value)
        .map(b => {
          const value = JSON.parse(b.value!) as GeoJSONFeature;
          return {
            ...value,
            properties: {
              ...value.properties,
              quote
            }
          }
        });

      return [...all, ...features];
    }, [])
  , [annotations]);

  return geotags;

}
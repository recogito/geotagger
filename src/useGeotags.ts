import { useAnnotations } from '@annotorious/react';
import type { SupabaseAnnotation, SupabaseAnnotationBody } from '@recogito/annotorious-supabase';
import { useMemo } from 'react';

// Utility hook based on useAnnotations that returns all annotations with geotags
export const useGeoAnnotations = () => {
  const annotations = useAnnotations<SupabaseAnnotation>();

  const geoannotations = useMemo(() => 
    annotations.filter(a => a.bodies.some(b => b.purpose === 'geotagging')), [annotations]);

  return geoannotations;
}

// Utility hook based on useAnnotations that returns all geotag bodies
export const useGeotags = () => {

  const annotations = useAnnotations<SupabaseAnnotation>();

  const geotags = useMemo(() => annotations
    .reduce<SupabaseAnnotationBody[]>((all, annotation) => {
      const bodies = annotation.bodies.filter(b => b.purpose === 'geotagging' && b.value);
      return [...all, ...bodies];
    }, [])
  , [annotations]);

  return geotags;

}
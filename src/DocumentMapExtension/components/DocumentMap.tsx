import { useMemo, useEffect } from 'react';
import type { SupabaseAnnotation, SupabaseAnnotationBody } from '@recogito/annotorious-supabase';
import { useAnnotations } from '@annotorious/react';
import type { PluginInstallationConfig } from '@components/Plugins';
import { useLeaflet } from '../../useLeaflet';

import './DocumentMap.css';

interface DocumentMapProps {

  plugin: PluginInstallationConfig;

}

export const DocumentMap = (props: DocumentMapProps) => {

  const annotations = useAnnotations<SupabaseAnnotation>();

  const geotags = useMemo(() => annotations
    .reduce<SupabaseAnnotationBody[]>((all, annotation) => {
      const bodies = annotation.bodies.filter(b => b.purpose === 'geotagging' && b.value);
      return [...all, ...bodies];
    }, [])
  , [annotations]);

  const { basemap } = props.plugin.meta.options;

  const { ref, map } = useLeaflet({ basemap, initialCenter: [0, 0], initialZoom: 2 });

  useEffect(() => {
    if (!map || !geotags || geotags.length === 0) return;

    const features = geotags
      .map(b => JSON.parse(b.value!))
      .filter(f => f.geometry?.coordinates);

    const markers = features.map(feature => {
      const [lon, lat] = feature.geometry.coordinates; 

      // TODO popup
      
      return L.marker([lat, lon]);
    });

    const layer = L.layerGroup(markers).addTo(map);

    return () => {
      map.removeLayer(layer);
    }
  }, [geotags, map]);

  return (
    <div ref={ref} className="ou-gtp-document-map">
    </div>
  )

}
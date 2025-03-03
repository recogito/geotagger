import { useEffect } from 'react';
import L from 'leaflet';
import bbox from '@turf/bbox';
import { Plugin } from '@recogito/studio-sdk';
import { DocumentMapPopup } from './DocumentMapPopup';
import { createPopup } from '../../utils';
import { useGeotagFeatures, type GeoTagFeature } from '../../useGeotags';
import { useLeaflet } from '../../useLeaflet';

import './DocumentMap.css';

interface DocumentMapProps {

  plugin: Plugin;

  settings: any;

}

export const DocumentMap = (props: DocumentMapProps) => {

  const geotags = useGeotagFeatures();

  const { ref, map } = useLeaflet({ 
    plugin: props.plugin, 
    settings: props.settings, 
    initialCenter: [0, 0], 
    initialZoom: 2 
  });

  useEffect(() => {
    if (!map || !geotags || geotags.length === 0) return;

    const features = geotags
      .filter(f => f.geometry?.coordinates);

    const [minLon, minLat, maxLon, maxLat] = bbox({ 
      type: 'FeatureCollection',
      features
    });

    if ([minLon, minLat, maxLon, maxLat].every(n => !isNaN(n) && isFinite(n))) {
      map.fitBounds([
        [minLat, minLon],
        [maxLat, maxLon]
      ], { maxZoom: 12, animate: false });
    }

    const byPlace = 
      // Group features by place
      features.reduce<[string, GeoTagFeature[]][]>((entries, feature) => {
        const existing = entries.find(([id, _]) => id === feature.id);
        return existing 
          ? entries.map(([id, entries]) => id === feature.id ? [id, [...entries, feature]] : [id, entries]) 
          : [...entries, [feature.id, [feature]]];
      }, []);

    const markers = byPlace.map(([_, features]) => {
      const [lon, lat] = features[0].geometry!.coordinates; 

      const popup = createPopup(
        <DocumentMapPopup
          plugin={props.plugin} 
          features={features} 
          onClose={() => popup.close()} />
      );
      
      return L.marker([lat, lon]).bindPopup(popup);
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
import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import L from 'leaflet';
import type { Map } from 'leaflet';
import bbox from '@turf/bbox';
import type { PluginInstallationConfig } from '@components/Plugins';
import { ResultMapPopup } from './ResultMapPopup';
import type { GeoJSONFeature } from '../../Types';

import './ResultMap.css';

interface ResultMapProps {

  config: PluginInstallationConfig;

  results: GeoJSONFeature[];

  onConfirm(result: GeoJSONFeature): void;

}

export const ResultMap = (props: ResultMapProps) => {

  const { basemap} = props.config.meta.options;

  const el = useRef<HTMLDivElement>(null);

  const [map, setMap] = useState<Map | undefined>();

  useEffect(() => {
    if (!map) return;

    const located = props.results.filter(f => f.geometry?.coordinates);

    const [minLon, minLat, maxLon, maxLat] = bbox({ 
      type: 'FeatureCollection',
      features: located
    });

    if ([minLon, minLat, maxLon, maxLat].every(n => !isNaN(n) && isFinite(n))) {
      map.fitBounds([
        [minLat, minLon],
        [maxLat, maxLon]
      ], { maxZoom: 12 });
    }

    const markers = located.map(feature => {
      const [lon, lat] = feature.geometry.coordinates; 

      const container = document.createElement('div');

      createRoot(container).render(
        <ResultMapPopup 
          config={props.config} 
          result={feature} 
          onClose={() => popup.close()}
          onConfirm={() => props.onConfirm(feature)} />
      );

      const popup = 
        L.popup({ content: container, closeButton: false });

      return L.marker([lat, lon]).bindPopup(popup);
    });

    const layer = L.layerGroup(markers).addTo(map);

    return () => {
      map.removeLayer(layer);
    }
  }, [props.results, map]);

  useEffect(() => {
    if (!el.current) return;

    const map = L.map(el.current, { zoomControl: false });
    setMap(map);

    // Set map to default position if there are no initial
    // located results. Otherwise, the [props.result, map] effect
    // will handle map location.
    const locatedResults = props.results.filter(f => f.geometry?.coordinates);
    if (locatedResults.length === 0) map.setView([0, 0], 2);

    L.control.zoom({
      position: 'topright'
    }).addTo(map);

    L.tileLayer(basemap, {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    return () => {
      setMap(undefined);
      map.remove();
    };
  }, []);

  return (
    <div className="ou-gtp-search-result-map" ref={el} />
  )

}
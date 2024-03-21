import { useEffect, useMemo } from 'react';
import L from 'leaflet';
import bbox from '@turf/bbox';
import type { PluginInstallationConfig } from '@components/Plugins';
import { ResultMapPopup } from './ResultMapPopup';
import { useLeaflet } from '../../useLeaflet';
import { createPopup } from '../../utils';
import type { GeoJSONFeature } from '../../Types';

import './ResultMap.css';

interface ResultMapProps {

  config: PluginInstallationConfig;

  results: GeoJSONFeature[];

  onConfirm(result: GeoJSONFeature): void;

}

export const ResultMap = (props: ResultMapProps) => {

  const { basemap} = props.config.meta.options;

  // Set map to default position if there are no initial
  // located results. Otherwise, the [props.result, map] effect
  // will handle map location.
  const [ initialCenter, initialZoom ] = useMemo(() => {
    const locatedResults = props.results.filter(f => f.geometry?.coordinates);
    return (locatedResults.length === 0) ? [ [0, 0], 2 ] : [ undefined, undefined ];
  }, []);

  const { ref, map } = useLeaflet({
    basemap,
    initialCenter,
    initialZoom
  });

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

      const popup = createPopup(
        <ResultMapPopup 
          config={props.config} 
          result={feature} 
          onClose={() => popup.close()}
          onConfirm={() => props.onConfirm(feature)} />
      );

      return L.marker([lat, lon]).bindPopup(popup);
    });

    const layer = L.layerGroup(markers).addTo(map);

    return () => {
      map.removeLayer(layer);
    }
  }, [props.results, map]);

  return (
    <div className="ou-gtp-search-result-map" ref={ref} />
  )

}
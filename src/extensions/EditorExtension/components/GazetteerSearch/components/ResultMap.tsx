import { useEffect, useMemo } from 'react';
import L from 'leaflet';
import bbox from '@turf/bbox';
import { Plugin } from '@recogito/studio-sdk';
import { ResultMapPopup } from './ResultMapPopup';
import { useLeaflet } from '../../../../../shared/useLeaflet';
import { createPopup } from '../../../../../shared/utils';
import type { CrossGazetteerSearchResult } from 'src/Types';

import './ResultMap.css';

interface ResultMapProps {

  plugin: Plugin;

  settings: any;

  results: CrossGazetteerSearchResult[];

  onConfirm(result: CrossGazetteerSearchResult): void;

}

export const ResultMap = (props: ResultMapProps) => {
  // Set map to default position if there are no initial
  // located results. Otherwise, the [props.result, map] effect
  // will handle map location.
  const [ initialCenter, initialZoom ] = useMemo(() => {
    const locatedResults = props.results.filter(f => f.feature.geometry?.coordinates);
    return (locatedResults.length === 0) ? [ [0, 0], 2 ] : [ undefined, undefined ];
  }, []);

  const { ref, map } = useLeaflet({
    plugin: props.plugin,
    settings: props.settings,
    initialCenter,
    initialZoom
  });

  useEffect(() => {
    if (!map) return;

    const located = props.results.filter(f => f.feature.geometry?.coordinates);

    const [minLon, minLat, maxLon, maxLat] = bbox({ 
      type: 'FeatureCollection',
      features: located.map(r => r.feature)
    });

    if ([minLon, minLat, maxLon, maxLat].every(n => !isNaN(n) && isFinite(n))) {
      map.fitBounds([
        [minLat, minLon],
        [maxLat, maxLon]
      ], { maxZoom: 12 });
    }

    const markers = located.map(r => {
      const [lon, lat] = r.feature.geometry.coordinates; 

      const popup = createPopup(
        <ResultMapPopup 
          plugin={props.plugin} 
          result={r.feature} 
          onClose={() => popup.close()}
          onConfirm={() => props.onConfirm(r)} />
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
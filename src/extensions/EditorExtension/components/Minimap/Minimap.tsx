import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Plugin } from '@recogito/studio-sdk';
import type { GeoTag } from 'src/Types';

import './Minimap.css';

interface MinimapProps {

  geotag?: GeoTag;

  plugin: Plugin;

  settings: any;

}

export const Minimap = (props: MinimapProps) => {

  const el = useRef<HTMLDivElement>(null);

  const feature = props.geotag?.feature;

  useEffect(() => {
    if (!el.current) return;

    // Shift map center to align with visible area
    const containerWidth = el.current.clientWidth;
    const offsetX = containerWidth * 0.33;
    
    const hasLocation = Boolean(feature?.geometry?.coordinates);

    const [lon, lat] = hasLocation ? 
      feature!.geometry.coordinates : [0, 12];

    const zoom = hasLocation ? 4 : 1;

    const map = L.map(el.current, { 
      attributionControl: false,
      zoomControl: false 
    }).setView([lat, lon], zoom);

    map.panBy([-offsetX, 0], { animate: false });

    const basemap = props.settings.plugin_settings?.basemap?.url 
      || props.plugin.options.basemap_presets[0].url;

    L.tileLayer(basemap)
      .addTo(map);

    return () => {
      map.remove();
    };
  }, [feature?.id]);

  return (
    <div className="ou-gtp-minimap" ref={el} />
  )

} 
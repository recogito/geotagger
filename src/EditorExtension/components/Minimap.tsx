import { useEffect, useRef } from 'react';
import L from 'leaflet';
import type { PluginInstallationConfig } from '@components/Plugins';
import type { GeoTag } from '../../Types';

import './Minimap.css';

interface MinimapProps {

  geotag?: GeoTag;

  plugin: PluginInstallationConfig;

}

export const Minimap = (props: MinimapProps) => {

  const el = useRef<HTMLDivElement>(null);

  const feature = props.geotag?.feature;

  useEffect(() => {
    if (!el.current) return;

    const hasLocation = Boolean(feature?.geometry?.coordinates);

    const [lon, lat] = hasLocation ? 
      feature!.geometry.coordinates : [-175, 12];

    const zoom = hasLocation ? 4 : 0;

    const map = L.map(el.current, { 
      attributionControl: false,
      zoomControl: false 
    }).setView([lat, lon], zoom);

    map.panBy([-108, -15], { animate: false });

    const basemap = props.plugin.settings.plugin_settings?.basemap?.url 
      || props.plugin.meta.options.basemap_presets[0].url;

    L.tileLayer(basemap)
      .addTo(map);

    if (hasLocation)
      L.marker([lat, lon]).addTo(map);

    return () => {
      map.remove();
    };
  }, [feature?.id]);

  return (
    <div className="ou-gtp-minimap" ref={el} />
  )

} 
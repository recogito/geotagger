import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import type { Map } from 'leaflet';
import type { PluginInstallationConfig } from '@components/Plugins';

interface LeafletProps {

  plugin: PluginInstallationConfig;

  initialCenter?: number[];

  initialZoom?: number;

}

export const useLeaflet = (props: LeafletProps) => {

  const ref = useRef<HTMLDivElement>(null);

  const [map, setMap] = useState<Map | undefined>();

  useEffect(() => {
    if (!ref.current) return;

    const map = L.map(ref.current, { zoomControl: false });
    setMap(map);

    if (props.initialCenter && props.initialZoom) 
      map.setView(props.initialCenter as [number, number], props.initialZoom);

    L.control.zoom({
      position: 'topright'
    }).addTo(map);

    const basemap = 
      props.plugin.settings.plugin_settings?.basemap ||
      props.plugin.meta.options.basemap_presets[0];

    L.tileLayer(basemap.url, {
      crossOrigin: 'anonymous',
      attribution: basemap.attribution
    }).addTo(map);

    return () => {
      setMap(undefined);
      map.remove();
    };
  }, []);

  return { map, ref }

}
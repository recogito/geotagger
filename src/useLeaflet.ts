import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import type { Map } from 'leaflet';
import { Plugin } from '@recogito/studio-sdk';

interface LeafletProps {

  plugin: Plugin;

  settings: any;

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
      props.settings.plugin_settings?.basemap ||
      props.plugin.options.basemap_presets[0];

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
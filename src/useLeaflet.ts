import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import type { Map } from 'leaflet';

interface LeafletProps {

  basemap: string;

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

    L.tileLayer(props.basemap, {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    return () => {
      setMap(undefined);
      map.remove();
    };
  }, []);

  return { map, ref }

}
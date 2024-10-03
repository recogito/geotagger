import { useEffect, useState } from 'react'; 
import { DownloadSimple } from '@phosphor-icons/react';
import { type GeoTagFeature, useGeotagFeatures } from '../../useGeotags';
import type { DocumentWithContext } from 'src/Types';

import './GeoJSONDownload.css';

interface GeoJSONDownloadProps {

  document: DocumentWithContext;

}

export const GeoJSONDownload = (props: GeoJSONDownloadProps) => {

  const geotags = useGeotagFeatures();

  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    if (!geotags || geotags.length === 0) return;

    setDisabled(false);
  }, [geotags]);

  const onDownload = () => {
    // Group features by place
    const byPlace = geotags
      .reduce<[string, GeoTagFeature[]][]>((entries, feature) => {
        const existing = entries.find(([id, _]) => id === feature.id);
        return existing 
          ? entries.map(([id, entries]) => id === feature.id ? [id, [...entries, feature]] : [id, entries]) 
          : [...entries, [feature.id, [feature]]];
      }, [])
      .map(([_, features]) => {
        const quotes = features.map(f => f.properties.quote).filter(Boolean) as string[];

        // Use first feature as a 'blueprint', but discard its quote
        const { quote, ...properties } = features[0].properties;

        return {
          ...features[0],
          properties: {
            ...properties,
            quotes
          }
        }
      });

    const geojson = {
      type: 'FeatureCollection',
      features: byPlace
    };

    const data = new TextEncoder().encode(JSON.stringify(geojson));
    const blob = new Blob([data], {
      type: 'application/json;charset=utf-8'
    });

    const anchor = document.createElement('a');
    anchor.href = URL.createObjectURL(blob);
    anchor.download = `${props.document.name}.geojson`;
    anchor.click();
  }

  return (
    <button
      disabled={disabled}
      className="unstyled download-geojson"
      onClick={onDownload}>
      <DownloadSimple size={20} /> GeoJSON
    </button>
  )

}
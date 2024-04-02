import { useEffect, useState } from 'react'; 
import { DownloadSimple } from '@phosphor-icons/react';
import { useGeotags } from '../../useGeotags';
import type { DocumentInTaggedContext } from 'src/Types';

import './GeoJSONDownload.css';

interface GeoJSONDownloadProps {

  document: DocumentInTaggedContext;

}

export const GeoJSONDownload = (props: GeoJSONDownloadProps) => {

  const geotags = useGeotags();

  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    if (!geotags || geotags.length === 0) return;

    setDisabled(false);
  }, [geotags]);

  const onDownload = () => {
    const geojson = {
      type: 'FeatureCollection',
      features: geotags
        .map(b => JSON.parse(b.value!))
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
      <DownloadSimple size={20} /> Download GeoJSON
    </button>
  )

}
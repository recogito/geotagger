import { Trash } from '@phosphor-icons/react';
import { GazetteerDefinition } from 'src/Types';

import './ConfigGeoJSON.css';

interface ConfigGeoJSONProps {

  gazetteer: GazetteerDefinition;

  onChange(gazetteer: GazetteerDefinition): void;

  onRemove(): void;

}

export const ConfigGeoJSON = (props: ConfigGeoJSONProps) => {

  const { gazetteer } = props;

  const onChangeURL = (url: string) => {
    props.onChange({ ...gazetteer, url });
  }

  return (
    <div className="ou-gtp-admin-gazetteer-config-geojson">
      <div className="geojson-url">
        <label>GeoJSON File URL</label>
        <input
          type="text"
          disabled={Boolean(gazetteer.name)}
          value={gazetteer.url || ''} 
          placeholder="Paste URL to GeoJSON file..."
          onChange={evt => onChangeURL(evt.target.value)} />
      </div>

      {!gazetteer.name && (
        <p className="hint">
          GeoJSON file must adhere to 
          the <a 
            href="https://github.com/LinkedPasts/linked-places-format" 
            target="_blank">Linked Places format</a>. Please keep 
          size below 5 MB and 40.000 places. Larger 
          files will load slowly and may negatively impact user experience.
        </p>
      )}

      <button 
        className="danger small"
        onClick={props.onRemove}>
        <Trash size={18} /> Remove from project
      </button>
    </div>
  )

}
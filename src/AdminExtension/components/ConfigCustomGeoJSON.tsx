import { DataSource } from 'src/Types';

interface ConfigCustomGeoJSONProps {

  gazetteer: DataSource;

  onChange(gazetteer: DataSource): void;

}

export const ConfigCustomGeoJSON = (props: ConfigCustomGeoJSONProps) => {

  const { gazetteer } = props;

  const onChangeURL = (url: string) => {
    props.onChange({ ...gazetteer, url });
  }

  return (
    <div className="out-gtp-admin-gazetteer-config-none">
      <label>GeoJSON File URL</label>

      <div>
        <input
          type="text"
          disabled={Boolean(gazetteer.name)}
          value={gazetteer.url || ''} 
          onChange={evt => onChangeURL(evt.target.value)} />
      </div>

      <p className="hint">
        GeoJSON file must adhere to 
        the <a 
          href="https://github.com/LinkedPasts/linked-places-format" 
          target="_blank">Linked Places format</a>. Please keep 
        size below 5 MB and 40.000 places. Larger 
        files will load slowly and may negatively impact user experience.
      </p>
    </div>
  )

}
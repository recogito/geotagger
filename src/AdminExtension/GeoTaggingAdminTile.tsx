import { useEffect, useRef, useState } from 'react';
import type { AdminExtensionProps } from '@components/Plugins';
import { DataSourceSelector } from './components/DataSourceSelector';
import type { BasemapConfig, DataSource } from '../Types';

import './GeoTaggingAdminTile.css';

export const GeoTaggingAdminTile = (props: AdminExtensionProps) => {

  const { plugin_settings } = props.plugin.settings;

  const basemapURL = useRef<HTMLInputElement>(null);

  const [datasource, setDatasource] = useState<DataSource | undefined>(plugin_settings.datasource);

  const [basemap, setBasemap] = useState<BasemapConfig>(
    plugin_settings.basemap ||
    props.plugin.meta.options.basemap_presets[0]
  );

  useEffect(() => {
    if (!basemap.name)
      basemapURL.current?.focus();
  }, [basemap]);

  const hasChanges =
    datasource?.id !== plugin_settings?.datasource?.id ||
    datasource?.url !== plugin_settings?.datasource?.url ||
    basemap.url !== plugin_settings?.basemap?.url; 

  const onSave = () => {
    if (datasource)
      props.onChangeUserSettings({ datasource, basemap });
  }

  return (
    <div className="ou-gtp-admin">
      <div className="out-gtp-setting">
        <label>
          Select a data source
        </label>

        <div>
          <DataSourceSelector
            config={props.plugin.meta}
            value={datasource}
            onChange={setDatasource} /> 
        </div>
      </div>

      {datasource?.type === 'geojson' && (
        <div className="out-gtp-setting">
          <label>GeoJSON File URL</label>

          <div>
            <input
              type="text"
              disabled={Boolean(datasource.name)}
              value={datasource.url || ''} 
              onChange={evt => setDatasource(source => ({ ...source!, url: evt.target.value }))} />
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
      )}

      <div className="out-gtp-setting basemap-setting">
        <p>Basemap</p>

        <ul>
          {(props.plugin.meta.options.basemap_presets || []).map((preset: BasemapConfig) => (
            <li key={preset.name}>
              <input 
                type="radio" 
                id={preset.name} 
                name="basemap" 
                value={preset.name} 
                checked={basemap.name === preset.name} 
                onChange={() => setBasemap(preset)} />

              <label htmlFor={preset.name}>{preset.name}</label>
            </li>
          ))}

          <li>
            <input 
              type="radio" 
              id="custom"
              name="basemap" 
              value="custom" 
              checked={!basemap.name} 
              onChange={() => setBasemap({ url: '' })} />

            <label htmlFor="custom">Custom X/Y/Z tileset</label>

            <input 
              ref={basemapURL}
              value={basemap.name ? '' : basemap.url} 
              type="text"
              disabled={Boolean(basemap.name)} />
          </li>
        </ul>
      </div>

      <div>
        <button 
          disabled={!hasChanges}
          className="primary" 
          type="button"
          onClick={onSave}>
          Save Settings
        </button>
      </div>
    </div>
  )

}
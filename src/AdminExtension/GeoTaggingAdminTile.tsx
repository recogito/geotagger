import { useState } from 'react';
import type { FormEvent } from 'react';
import type { AdminExtensionProps } from '@components/Plugins';
import { DataSourceSelector } from './components/DataSourceSelector';
import type { DataSource } from '../Types';

import './GeoTaggingAdminTile.css';

export const GeoTaggingAdminTile = (props: AdminExtensionProps) => {

  const { plugin_settings } = props.plugin.settings;

  const [datasource, setDatasource] = useState<DataSource | undefined>(plugin_settings);

  const hasChanges =
    datasource?.id !== plugin_settings?.id ||
    datasource?.url !== plugin_settings?.url;

  const onSave = () => {
    if (datasource)
      props.onChangeUserSettings(datasource);
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
import type { PluginInstallationConfig } from '@components/Plugins';
import { X } from '@phosphor-icons/react';
import { formatId } from '../../utils';
import type { GeoTagFeature } from '../../useGeotags';

import './DocumentMapPopup.css';

interface DocumentMapPopupProps {

  plugin: PluginInstallationConfig;

  features: GeoTagFeature[]

  onClose(): void;

}

export const DocumentMapPopup = (props: DocumentMapPopupProps) => {

  const first = props.features[0];

  const quotes = props.features.map(f => f.properties.quote).filter(Boolean);

  return (
    <div className="ou-gtp-document-map-popup">
      <div className="close">
        <button 
          className="unstyled icon-only"
          onClick={props.onClose}>
          <X />
        </button>
      </div>

      <p className="title">{first.properties.title}</p>

      <p className="identifier">
        <a className="source-link" href={first.id} target="_blank">
          {formatId(first.id, props.plugin)}
        </a>
      </p>
      
      <p className="description">
        {first.properties.description}
      </p>

      {quotes.length > 0 && (
        <p className="quotes">
          {quotes.map(str => `«${str}»`).join(' · ')}
        </p>
      )}
    </div>
  )

}
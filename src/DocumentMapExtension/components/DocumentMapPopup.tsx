import type { PluginInstallationConfig } from '@components/Plugins';
import { X } from '@phosphor-icons/react';
import { formatId } from '../../utils';
import type { GeoJSONFeature } from '../../Types';

import './DocumentMapPopup.css';

interface DocumentMapPopupProps {

  plugin: PluginInstallationConfig;

  feature: GeoJSONFeature;

  onClose(): void;

}

export const DocumentMapPopup = (props: DocumentMapPopupProps) => {

  const { properties } = props.feature;

  return (
    <div className="ou-gtp-document-map-popup">
      <div className="close">
        <button 
          className="unstyled icon-only"
          onClick={props.onClose}>
          <X />
        </button>
      </div>

      <p className="title">{properties.title}</p>

      <p className="identifier">
        <a className="source-link" href={props.feature.id} target="_blank">
          {formatId(props.feature.id, props.plugin)}
        </a>
      </p>
      
      <p className="description">
        {properties.description}
      </p>
    </div>
  )

}
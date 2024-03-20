import type { PluginInstallationConfig } from '@components/Plugins';
import { formatId } from '../../utils';
import type { GeoJSONFeature } from '../../Types';

import './ResultMapPopup.css';
import { X } from '@phosphor-icons/react';

interface ResultMapPopupProps {

  config: PluginInstallationConfig;

  result: GeoJSONFeature;

  onClose(): void;

  onConfirm(): void;

}

export const ResultMapPopup = (props: ResultMapPopupProps) => {

  const { properties } = props.result;

  return (
    <div className="ou-gtp-resultmap-popup">
      <div className="close">
        <button 
          className="unstyled icon-only"
          onClick={props.onClose}>
          <X />
        </button>
      </div>

      <p className="title">{properties.title}</p>

      <p className="identifier">
        <a className="source-link" href={props.result.id} target="_blank">
          {formatId(props.result.id, props.config)}
        </a>
      </p>
      
      <p className="description">
        {properties.description}
      </p>
      
      <button 
        className="confirm primary sm flat"
        onClick={props.onConfirm}>Confirm</button>
    </div>
  )

}
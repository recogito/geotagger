import { Plugin } from '@recogito/studio-sdk';
import { X } from '@phosphor-icons/react';
import { formatId } from '../../../../../shared/utils';
import type { GeoJSONFeature } from 'src/Types';

import './ResultMapPopup.css';

interface ResultMapPopupProps {

  plugin: Plugin;

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
          {formatId(props.result.id, props.plugin)}
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
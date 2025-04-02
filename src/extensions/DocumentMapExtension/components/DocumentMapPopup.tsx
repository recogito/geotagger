import { X } from '@phosphor-icons/react';
import { Plugin } from '@recogito/studio-sdk';
import { formatId } from '../../../shared/utils';
import type { GeoTagFeature } from '../../../shared/useGeotags';

import './DocumentMapPopup.css';

interface DocumentMapPopupProps {

  plugin: Plugin;

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
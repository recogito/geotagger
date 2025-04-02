import { Warning } from '@phosphor-icons/react';
import { Plugin } from '@recogito/studio-sdk';
import { formatId } from '../../../../../shared/utils';
import type { GeoJSONFeature } from 'src/Types';

import './ResultCard.css';

interface ResultCardProps {

  plugin: Plugin;

  result: GeoJSONFeature;

  onClick(): void;

}

export const ResultCard = (props: ResultCardProps) => {

  const { properties } = props.result;

  const isUnlocated = !props.result.geometry?.coordinates;

  return (
    <div className="ou-gtp-result-card">
      <button className="ou-gtp-result-card" onClick={props.onClick}>
        <span className="title">
          {properties.title}
        </span>
      </button>

      <span className="identifier">
        <a className="source-link" href={props.result.id} target="_blank">
          {formatId(props.result.id, props.plugin)}
        </a>
      </span>
      
      <span className="description">
        {properties.description}
      </span>

      {isUnlocated && (
        <span className="unlocated">
          <Warning size={14} /> Unlocated
        </span>
      )}
    </div>
  )

}
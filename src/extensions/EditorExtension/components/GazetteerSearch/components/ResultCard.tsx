import { Warning } from '@phosphor-icons/react';
import chroma from 'chroma-js';
import { Plugin } from '@recogito/studio-sdk';
import { formatId } from '../../../../../shared/utils';
import type { CrossGazetteerSearchResult, GeoJSONFeature } from 'src/Types';

import './ResultCard.css';

interface ResultCardProps {

  color?: string;

  plugin: Plugin;

  result: CrossGazetteerSearchResult;

  onClick(): void;

}

export const ResultCard = (props: ResultCardProps) => {

  const { properties } = props.result.feature;

  const id = props.result.feature.id;

  const isUnlocated = !props.result.feature.geometry?.coordinates;

  return (
    <div className="ou-gtp-result-card">
      <button className="ou-gtp-result-card" onClick={props.onClick}>
        <span className="title">
          {properties.title}
        </span>
      </button>

      <span className="identifier">
        {props.color && (
          <span 
            className="pip" 
            style={{ 
              backgroundColor: props.color,
              borderColor: chroma(props.color).darken().hex()
            }} />
          )}

        <a className="source-link" href={id} target="_blank">
          {formatId(id, props.plugin)}
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
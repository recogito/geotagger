import { Warning } from '@phosphor-icons/react';
import type { PluginInstallationConfig } from '@components/Plugins';
import type { GeoJSONFeature } from '../../Types';
import { formatId } from '../../utils';

import './ResultCard.css';

interface ResultCardProps {

  config: PluginInstallationConfig;

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
          {formatId(props.result.id, props.config)}
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
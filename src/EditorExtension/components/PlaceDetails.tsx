import type { PluginInstallationConfig } from '@components/Plugins';
import { Question } from '@phosphor-icons/react';
import { PlaceDetailsFooter } from './PlaceDetailsFooter';
import { PlaceDetailsActions } from './PlaceDetailsActions';
import type { Gazetteer, GeoTag } from '../../Types';

import './PlaceDetails.css';
import { formatId } from '../../utils';

interface PlaceDetailsProps {

  config: PluginInstallationConfig;

  geotag?: GeoTag;

  onConfirm(): void;

  onDelete(): void;

  onEdit(): void;

}

export const PlaceDetails = (props: PlaceDetailsProps) => {

  const { feature, confirmed } = props.geotag || {};

  const isUnlocated = !feature?.geometry?.coordinates;

  return feature ? (
    <article className="ou-gtp-placedetails">
      {isUnlocated && (
        <div className="unlocated-overlay">
          <Question size={54} weight="light" />
        </div>
      )}

      <div className="place-details">
        {confirmed && (
          <PlaceDetailsActions 
            onDelete={props.onDelete}
            onEdit={props.onEdit} />
        )}

        <div className="wrapper">
          <h3>{feature.properties.title}</h3>
          <p>
            <a className="source-link" href={feature.id} target="_blank">
              {formatId(feature.id, props.config)}
            </a>
          </p>
          <p className="description">
            {feature.properties.description}
          </p>
        </div>

        {props.geotag && (
          <PlaceDetailsFooter 
            geotag={props.geotag}
            onConfirm={props.onConfirm} 
            onEdit={props.onEdit} />
        )}
      </div>
    </article>
  ) : (
    <article className="ou-gtp-placedetails no-match">
      <div>No match</div>
    </article>
  )

}
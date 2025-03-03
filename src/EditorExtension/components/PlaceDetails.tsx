import { Flag, Question, Trash } from '@phosphor-icons/react';
import { Plugin } from '@recogito/studio-sdk';
import type { User } from '@annotorious/react';
import { PlaceDetailsFooter } from './PlaceDetailsFooter';
import { PlaceDetailsActions } from './PlaceDetailsActions';
import type { GeoTag } from '../../Types';
import { formatId } from '../../utils';

import './PlaceDetails.css';

interface PlaceDetailsProps {

  plugin: Plugin;

  geotag?: GeoTag;

  me: User;

  onConfirm(): void;

  onDelete(): void;

  onEdit(): void;

  onFlag(): void;

}

export const PlaceDetails = (props: PlaceDetailsProps) => {

  const { feature, confirmed } = props.geotag || {};

  const isUnlocated = !feature?.geometry?.coordinates;

  const isMine = props.geotag?.confirmed?.by?.id === props.me.id;

  return feature ? (
    <article className="ou-gtp-placedetails">
      {isUnlocated && (
        <div className="unlocated-overlay">
          <Question size={54} weight="light" />
        </div>
      )}

      <div className="place-details">
        {confirmed && isMine && (
          <PlaceDetailsActions 
            onDelete={props.onDelete}
            onEdit={props.onEdit} />
        )}

        <div className="wrapper">
          <h3>{feature.properties.title}</h3>
          <p>
            <a className="source-link" href={feature.id} target="_blank">
              {formatId(feature.id, props.plugin)}
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
  ) : confirmed ? (
    <article className="ou-gtp-placedetails flagged">
      <div>
        An unidentified place
      </div>

      <div>
        <button onClick={props.onEdit}>Change</button>
        <button onClick={props.onDelete}>
          <Trash size={18} />
        </button>
      </div>
    </article>
  ) : (
    <article className="ou-gtp-placedetails no-match">
      <div>No match</div>

      <button 
        className="flag-unidentified sm unstyled"
        onClick={props.onFlag}>
        <Flag size={15} /> Flag as an unidentified place
      </button>
    </article>
  )

}
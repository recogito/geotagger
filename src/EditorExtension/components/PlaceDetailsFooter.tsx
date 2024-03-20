import { Avatar } from '@components/Avatar';
import { Timestamp } from '@components/Timestamp';
import type { GeoTag } from '../../Types';

import './PlaceDetailsFooter.css';

interface PlaceDetailsFooterProps {

  geotag: GeoTag;

  onConfirm(): void;

  onEdit(): void;

}

export const PlaceDetailsFooter = (props: PlaceDetailsFooterProps) => {

  const { geotag } = props;

  return geotag.confirmed?.by ? (
    <div className="ou-gtp-placedetails-footer confirmed">
      <div className="created-by">
        <Avatar
          id={geotag.confirmed.by.id!}
          name={geotag.confirmed.by.name || 'Anonymous'}
          avatar={geotag.confirmed.by.avatar} />

        <span>{geotag.confirmed.by.name || 'Anonymous'}</span>
      </div>

      {geotag.confirmed.at && (
        <div className="created-at">
          <Timestamp datetime={geotag.confirmed.at} />
        </div>
      )}
    </div>
  ) : (
    <div className="ou-gtp-placedetails-footer unconfirmed">
      <div>
        <button onClick={props.onConfirm}>
          Confirm
        </button>

        <button onClick={props.onEdit}>
          Change
        </button>
      </div>
    </div>
  )

}
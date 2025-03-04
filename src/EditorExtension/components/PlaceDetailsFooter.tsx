import type { GeoTag } from '../../Types';

import './PlaceDetailsFooter.css';

interface PlaceDetailsFooterProps {

  geotag: GeoTag;

  onConfirm(): void;

  onEdit(): void;

}

export const PlaceDetailsFooter = (props: PlaceDetailsFooterProps) => {

  const { geotag } = props;

  return !geotag.confirmed?.by && (
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
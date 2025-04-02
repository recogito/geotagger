import { MapPin } from '@phosphor-icons/react';

import './AddGeoTag.css';

interface AddGeoTagProps {

  initializing?: boolean;

  disabled?: boolean;

  onClick(): void;

}

export const AddGeoTag = (props: AddGeoTagProps) => {

  return (
    <div className="ou-gtp-add">
      <button 
        disabled={props.disabled || props.initializing}
        className="unstyled" 
        onClick={props.onClick}>
        <MapPin size={16} />
        {props.initializing ? (
          <div>Loading Gazetteer...</div>
        ) : (
          <div>Add Geo-Tag</div>
        )}
      </button>
    </div>
  )

}
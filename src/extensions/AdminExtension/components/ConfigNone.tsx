import { Trash } from '@phosphor-icons/react';

import './ConfigNone.css';

interface ConfigNoneProps {

  onRemove(): void;

}

export const ConfigNone = (props: ConfigNoneProps) => {

  return (
    <div className="out-gtp-admin-gazetteer-config-none">
      <p>
        There are no additional configuration options for this gazetteer.
      </p>

      <button 
        className="danger small"
        onClick={props.onRemove}>
        <Trash size={18} /> Remove from project
      </button>
    </div>
  )

}
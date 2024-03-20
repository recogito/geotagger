import { DotsThreeVertical, Pencil, Trash } from '@phosphor-icons/react';
import * as Dropdown from '@radix-ui/react-dropdown-menu';

import './PlaceDetailsActions.css';

interface PlaceDetailsActionsProps {

  onDelete(): void;

  onEdit(): void;

}

export const PlaceDetailsActions = (props: PlaceDetailsActionsProps) => {

  return (
    <Dropdown.Root>
      <Dropdown.Trigger asChild>
        <button className="ou-gtp-placedetails-actions-trigger unstyled icon-only">
          <DotsThreeVertical size={20} weight="bold" />
        </button>
      </Dropdown.Trigger>

      <Dropdown.Portal>
        <Dropdown.Content 
          className="dropdown-content" 
          sideOffset={5} align="start">

          <Dropdown.Item 
            className="dropdown-item"
            onSelect={props.onEdit}>
            <Pencil size={16} />  Edit Geotag
          </Dropdown.Item>

          <Dropdown.Item 
            className="dropdown-item"
            onSelect={props.onDelete}>
            <Trash size={16} /> Delete Geotag
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Portal>
    </Dropdown.Root>
  )

}
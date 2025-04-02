import { Check, FunnelSimple } from '@phosphor-icons/react';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as Popover from '@radix-ui/react-popover';
import { GazetteerDefinition } from 'src/Types';

import './ResultListFilter.css';

interface ResultListFilterProps {

  gazetteers: GazetteerDefinition[];

}

export const ResultListFilter = (props: ResultListFilterProps) => {

  return (
    <div className="result-list-filter">
      <Popover.Root>
        <Popover.Trigger 
          asChild
          className="popover-trigger">
          <button className="unstyled icon-only">
            <FunnelSimple />
          </button>
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content className="ou-gtp-result-list-filter-popover popover-content">
            <ul>
              {props.gazetteers.map(g => (
                <li key={g.id}>
                  <Checkbox.Root
                    id={g.id}
                    className="checkbox-root">
                    <Checkbox.Indicator>
                      <Check size={15} weight="bold" />
                    </Checkbox.Indicator>
                  </Checkbox.Root>

                  <label htmlFor={g.id}>
                    {g.name || 'Custom GeoJSON'}
                  </label>
                </li>
              ))}
            </ul>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  )

}
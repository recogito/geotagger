import { Check, FunnelSimple } from '@phosphor-icons/react';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as Popover from '@radix-ui/react-popover';
import { COLORS } from '../Colors';
import { GazetteerDefinition } from 'src/Types';

import './ResultListFilter.css';

interface ResultListFilterProps {

  gazetteers: GazetteerDefinition[];

  filter: GazetteerDefinition[];

  onSetFilter(gazetteers: GazetteerDefinition[]): void;

}

export const ResultListFilter = (props: ResultListFilterProps) => {

  const isChecked = (gazetteer: GazetteerDefinition) => 
    props.filter.some(g => g.id === gazetteer.id);

  const onCheckedChange = (gazetteer: GazetteerDefinition, checked: boolean) => {
    if (checked && props.filter.every(g => g.id !== gazetteer.id)) {
      props.onSetFilter([...props.filter, gazetteer]);
    } else {
      props.onSetFilter(props.filter.filter(g => g.id !== gazetteer.id));
    }
  }

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
          <Popover.Content 
            className="ou-gtp-result-list-filter-popover popover-content"
            align="start">
            <p className="hint">
              Filter gazetteers
            </p>
            <ul>
              {props.gazetteers.map((g, idx) => (
                <li key={g.id}>
                  <Checkbox.Root
                    id={g.id}
                    style={{ 
                      '--color': COLORS[idx % COLORS.length]
                    } as React.CSSProperties}
                    className="checkbox-root"
                    checked={isChecked(g)}
                    onCheckedChange={checked => onCheckedChange(g, checked as boolean)}>
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
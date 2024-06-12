import { forwardRef } from 'react';
import { CaretDown, Check } from '@phosphor-icons/react';
import * as Select from '@radix-ui/react-select';
import type { PluginMetadata } from '@components/Plugins';
import type { DataSource, GeoJSONGazetteerPreset } from '../../Types';

import './DataSourceSelector.css';

interface DataSourceSelectorProps {

  config: PluginMetadata;

  value?: DataSource;

  onChange(value: DataSource): void;

}

const SelectItem = forwardRef<HTMLDivElement, Select.SelectItemProps>(
  (props, forwardedRef) => (
    <Select.Item className='select-item' {...props} ref={forwardedRef}>
      <Select.ItemIndicator className='select-item-indicator'>
        <Check />
      </Select.ItemIndicator>
      <Select.ItemText>{props.children}</Select.ItemText>
    </Select.Item>
  )
);

export const DataSourceSelector = (props: DataSourceSelectorProps) => {

  const presets: GeoJSONGazetteerPreset[] = props.config.options.geojson_presets;

  const onValueChange = (value: string) => {
    const preset = presets.find(p => p.preset_id === value);
    if (preset) {
      props.onChange({
        id: value,
        name: preset.preset_name,
        type: 'geojson',
        url: preset.file_url
      });
    } else {
      props.onChange({
        id: value,
        type: value as 'coredata' | 'wikidata' | 'whg' | 'geojson'
      });
    }
  } 

  return (
    <Select.Root defaultValue={props.value?.id} onValueChange={onValueChange}>
      <Select.Trigger className="sm ou-gtp-admin-sources">
        <Select.Value />

        <Select.Icon className="select-icon">
          <CaretDown />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content className='select-content'>
          <Select.Viewport className='select-viewport'>
            <SelectItem value="wikidata">
              Wikidata
            </SelectItem>

            <SelectItem value="whg">
              World Historical Gazetteer
            </SelectItem>

            <SelectItem value="coredata">
              Core Data Cloud
            </SelectItem>

            {presets.map((preset: any) => (
              <SelectItem 
                key={preset.preset_id} 
                value={preset.preset_id}>
                {preset.preset_name}
              </SelectItem>
            ))}

            <SelectItem value="geojson">
              Custom GeoJSON source
            </SelectItem>
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  )

}
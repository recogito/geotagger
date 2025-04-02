import { useState } from 'react';
import { Command } from 'cmdk';
import { Plugin } from '@recogito/studio-sdk';
import { PlusCircle } from '@phosphor-icons/react';
import * as Dialog from '@radix-ui/react-dialog';
import { DataSource, GeoJSONGazetteerPreset } from 'src/Types';

import './GazetteerSelector.css';

interface GazetteerSelectorProps {

  plugin: Plugin;

  onSelect(value: DataSource): void;

}

const TITLES: { [key: string]: string } = {
  wikidata: 'Wikidata',
  whg: 'World Historical Gazetteer',
  coredata: 'Core Data'
}

export const GazetteerSelector = (props: GazetteerSelectorProps) => {

  const [open, setOpen] = useState(false);

  const presets: GeoJSONGazetteerPreset[] = props.plugin.options.geojson_presets;

  const onSelect = (value: string) => () => {
    const preset = presets.find(p => p.preset_id === value);
    if (preset) {
      props.onSelect({
        id: value,
        name: preset.preset_name,
        type: 'geojson',
        url: preset.file_url
      });
    } else {
      props.onSelect({
        id: value,
        name: TITLES[value],
        type: value as 'coredata' | 'wikidata' | 'whg' | 'geojson'
      });
    }

    setOpen(false);
  }

  return (
    <Dialog.Root
      open={open}
      onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="add-gazetteer unstyled">
          <PlusCircle size={18} /> <span>Add Gazetteer</span>
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />

        <Dialog.Content className="dialog-content ou-gtp-gazetteer-selector" >
          <Dialog.Title className="sr-only">
            Select Gazetteer
          </Dialog.Title>

          <Dialog.Description className="sr-only">
            Select a gazetteer for this project from the list.
          </Dialog.Description>

          <Command>
            <Command.Input 
              placeholder="Search..." />

            <Command.List>
              <Command.Group heading="Online Services">
                <Command.Item onSelect={onSelect('wikidata')}>
                  Wikidata
                </Command.Item>

                <Command.Item onSelect={onSelect('whg')}>
                  World Historical Gazetteer
                </Command.Item>

                <Command.Item onSelect={onSelect('coredata')}>
                  Core Data Cloud
                </Command.Item>
              </Command.Group>

              <Command.Group heading="GeoJSON File">
                {presets.map(preset => (
                  <Command.Item 
                    key={preset.preset_id}
                    onSelect={onSelect(preset.preset_id)}>
                    {preset.preset_name}
                  </Command.Item>
                ))}
                <Command.Separator />

                <Command.Item onSelect={onSelect('geojson')}>
                  Custom Onlin GeoJSON File
                </Command.Item>
              </Command.Group>
            </Command.List>
          </Command>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )

}
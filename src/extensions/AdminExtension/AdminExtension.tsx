import { forwardRef, HTMLAttributes, useEffect, useRef, useState } from 'react';
import { Gear } from '@phosphor-icons/react';
import { AdminExtensionProps } from '@recogito/studio-sdk';
import * as Accordion from '@radix-ui/react-accordion';
import { ConfigGeoJSON, ConfigNone, GazetteerSelector } from './components';
import type { BasemapConfig, DataSource, GeoTaggerInstanceSettings } from '../../Types';

import './AdminExtension.css';

const AccordionTrigger = forwardRef<HTMLButtonElement, HTMLAttributes<HTMLButtonElement>>((props, forwardedRef) => (
		<Accordion.Header className="accordion-header">
			<Accordion.Trigger
				className="accordion-trigger"
				{...props}
				ref={forwardedRef}>
				{props.children}
				<Gear 
          className="accordion-chevron" 
          aria-hidden 
          size={19} />
			</Accordion.Trigger>
		</Accordion.Header>
	)
)

export const AdminExtension = (props: AdminExtensionProps<GeoTaggerInstanceSettings>) => {

  const { settings } = props;

  const basemapURL = useRef<HTMLInputElement>(null);

  const [gazetteers, setGazetteers] = useState<DataSource[]>(settings?.gazetteers || []);

  const [basemap, setBasemap] = useState<BasemapConfig>(
    settings?.basemap ||
    props.plugin.options.basemap_presets[0]
  );

  useEffect(() => {
    if (!basemap.name)
      basemapURL.current?.focus();
  }, [basemap]);

  const hasChanges =
    gazetteers.map(g => g.id).join(':') !== (settings?.gazetteers || []).map((g: DataSource) => g.id).join(':') ||
    basemap.url !== settings?.basemap?.url; 

  const onAddGazetteer = (gazetteer: DataSource) => 
    setGazetteers(current => current.some(g => g.id === gazetteer.id) ? current : ([...current, gazetteer]));

  const onUpdateConfig = (gazetteer: DataSource) => 
    setGazetteers(current => current.map(g => g.id === gazetteer.id ? gazetteer : g));

  const onRemoveGazetteer = (gazetteer: DataSource) => 
    setGazetteers(current => current.filter(g => g.id !== gazetteer.id));

  const onSave = () => {
    if (gazetteers.length > 0) {
      console.log({ gazetteers, basemap });
      props.onChangeUserSettings({ gazetteers, basemap });
    }
  }

  const getName = (g: DataSource) => {
    if (g.name) return g.name;
    // Simple for now...
    else return 'Custom GeoJSON';
  }

  return (
    <div className="ou-gtp-admin">
      <section className="ou-gtp-admin-gazetteers">
        <h3>
          Gazetteers
        </h3>

        {gazetteers.length === 0 ? (
          <p className="error">
            You must add at least one gazetteer.
          </p>
        ) : (
          <Accordion.Root
            className="accordion-root"
            type="multiple">
            {gazetteers.map(g => (
              <Accordion.AccordionItem 
                key={g.id}
                value={g.id}
                className="accordion-item">
                <AccordionTrigger>
                  {getName(g)}
                </AccordionTrigger>

                <Accordion.AccordionContent className="accordion-content">
                  {g.type === 'geojson' ? (
                    <ConfigGeoJSON 
                      gazetteer={g} 
                      onChange={onUpdateConfig} 
                      onRemove={() => onRemoveGazetteer(g)} />
                  ) : (
                    <ConfigNone 
                      onRemove={() => onRemoveGazetteer(g)} />
                  )}
                </Accordion.AccordionContent>
              </Accordion.AccordionItem>
            ))}
          </Accordion.Root>
        )}

        <GazetteerSelector 
          plugin={props.plugin}
          onSelect={onAddGazetteer} />
      </section>

      <section className="ou-gtp-admin-basemap">
        <h3>
          Basemap
        </h3>
        
        <p>
          Select a basemap for the annotation widget, search and overview map.
        </p>

        <ul>
          {(props.plugin.options.basemap_presets || []).map((preset: BasemapConfig) => (
            <li key={preset.name}>
              <input 
                type="radio" 
                id={preset.name} 
                name="basemap" 
                value={preset.name} 
                checked={basemap.name === preset.name} 
                onChange={() => setBasemap(preset)} />

              <label htmlFor={preset.name}>{preset.name}</label>
            </li>
          ))}

          <li>
            <input 
              type="radio" 
              id="custom"
              name="basemap" 
              value="custom" 
              checked={!basemap.name} 
              onChange={() => setBasemap({ url: '' })} />

            <label htmlFor="custom">Custom X/Y/Z tileset</label>

            <input 
              ref={basemapURL}
              value={basemap.name ? '' : basemap.url} 
              type="text"
              disabled={Boolean(basemap.name)} />
          </li>
        </ul>
      </section>

      <div>
        <button 
          disabled={!hasChanges}
          className="primary" 
          type="button"
          onClick={onSave}>
          Save Settings
        </button>
      </div>
    </div>
  )

}
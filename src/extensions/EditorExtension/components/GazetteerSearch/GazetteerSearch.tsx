import { FormEvent, useState } from 'react';
import centroid from '@turf/centroid';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Plugin } from '@recogito/studio-sdk';
import { Spinner } from '@recogito/studio-sdk/components';
import { ListDashes, MagnifyingGlass, X } from '@phosphor-icons/react';
import * as Dialog from '@radix-ui/react-dialog';
import { ResultCard } from './components/ResultCard';
import { ResultMap } from './components/ResultMap';
import type { CrossGazetteerSearchable, GeoJSONFeature } from '../../../../Types';

import './GazetteerSearch.css';

interface GazetteerSearchProps {

  plugin: Plugin;
  
  settings: any;

  gazetteers: CrossGazetteerSearchable;

  initialQuery?: string;

  onClose(): void;

  onSelect(result: GeoJSONFeature): void;

}

export const GazetteerSearch = (props: GazetteerSearchProps) => {

  const { search } = props.gazetteers;

  const [query, setQuery] = useState(props.initialQuery || '');

  const [searching, setSearching] = useState(false);

  const [results, setResults] = useState<GeoJSONFeature[] | undefined>();

  const onSelect = (result: GeoJSONFeature) => {
    props.onSelect(result);
    props.onClose();
  }

  const onSearch = (evt: FormEvent) => {
    evt.preventDefault();

    setSearching(true);
    setResults(undefined);

    search(query, 100)
      .then(results => {
        const pointFeatures = results.map(f => {
          if (!f.geometry || f.geometry.type === 'Point') {
            // Pass through point & unlocated features
            return f;
          } else {
            // Anything else: reduce to centroid
            const { geometry } = centroid(f);
            return { ...f, geometry };
          }
        });

        setSearching(false);
        setResults(pointFeatures);
      })
      .catch(error => {
        console.error(error);
        setSearching(false);
      })
  }

  return (
    <Dialog.Root open={true} onOpenChange={props.onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />

        <Dialog.Content 
          className="dialog-content ou-gtp-gazetteer-search not-annotatable">
          <VisuallyHidden>
            <Dialog.Title>Gazetteer Search</Dialog.Title>
            <Dialog.Description>Search for a place.</Dialog.Description>
          </VisuallyHidden>
          <div className="header">
            <div className="searchbox">
              <form onSubmit={onSearch}>
                <input
                  type="text" 
                  placeholder="Search for a place..." 
                  value={query} 
                  onChange={evt => setQuery(evt.target.value)} />

                {(searching && query)  ? (
                  <Spinner className="search-icon spinner" size={14} />
                ) : (
                  <MagnifyingGlass className="search-icon" size={24} />
                )}
              </form>
            </div>

            <Dialog.Close className="unstyled icon-only">
              <X size={36} />
            </Dialog.Close>
          </div>
        
          <div className="results">
            <div className="results-list">
              <div className="totals">
                <ListDashes size={16}   /> {results && (
                  <>{results.length} Results</>
                )}
              </div>
              <ul>
                {(!searching && results) && results.map(result => (
                  <li key={result.id}>
                    <ResultCard
                      plugin={props.plugin}
                      result={result}
                      onClick={() => onSelect(result)} />
                  </li>
                ))}
              </ul>
            </div>

            <div className="results-map">
              <ResultMap 
                plugin={props.plugin}
                settings={props.settings}
                results={results || []} 
                onConfirm={onSelect} />
            </div>
          </div>    
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )

}
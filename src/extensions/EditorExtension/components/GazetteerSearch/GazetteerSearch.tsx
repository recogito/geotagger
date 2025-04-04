import { FormEvent, useEffect, useState } from 'react';
import centroid from '@turf/centroid';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Plugin } from '@recogito/studio-sdk';
import { Spinner } from '@recogito/studio-sdk/components';
import { ListDashes, MagnifyingGlass, X } from '@phosphor-icons/react';
import * as Dialog from '@radix-ui/react-dialog';
import { ResultCard } from './components/ResultCard';
import { ResultMap } from './components/ResultMap';
import { ResultListFilter } from './components/ResultListFilter';
import { COLORS } from './Colors';
import type { 
  CrossGazetteerSearchable, 
  CrossGazetteerSearchResult, 
  GeoJSONFeature, 
  GeoTaggerInstanceSettings 
} from 'src/Types';

import './GazetteerSearch.css';

interface GazetteerSearchProps {

  plugin: Plugin;
  
  settings: GeoTaggerInstanceSettings;

  gazetteers: CrossGazetteerSearchable;

  initialQuery?: string;

  onClose(): void;

  onSelect(result: GeoJSONFeature): void;

}

export const GazetteerSearch = (props: GazetteerSearchProps) => {

  const { search } = props.gazetteers;

  const [query, setQuery] = useState(props.initialQuery || '');

  const [activeGazetteers, setActiveGazetteers] = useState(props.settings.gazetteers);

  const [searching, setSearching] = useState(false);

  const [results, setResults] = useState<CrossGazetteerSearchResult[] | undefined>();

  const onSelect = (result: CrossGazetteerSearchResult) => {
    props.onSelect(result.feature);
    props.onClose();
  }

  const getGazetteerColor = (result: CrossGazetteerSearchResult) => {
    // Don't color-code if there's only one gazetteer
    if (props.settings.gazetteers.length === 1) return;
    const idx = props.settings.gazetteers.findIndex(g => g.id === result.gazetteer);
    return COLORS[idx % COLORS.length];
  }

  const onSearch = (evt?: FormEvent) => {
    evt?.preventDefault();

    setSearching(true);
    setResults(undefined);

    const searchIn = activeGazetteers.length === props.settings.gazetteers.length
      ? undefined
      : activeGazetteers.map(g => g.id);

    search(query, 100, searchIn)
      .then(results => {
        const pointFeatures = results.map(result => {
          if (!result.feature.geometry || result.feature.geometry.type === 'Point') {
            // Pass through point & unlocated features
            return result;
          } else {
            // Anything else: reduce to centroid
            return { 
              ...result,
              feature: {
                ...result.feature, 
                geometry: centroid(result.feature)
              } as unknown as GeoJSONFeature
            };
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

  useEffect(() => onSearch(), [activeGazetteers]);

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
                  <button className="search-icon" >
                    <MagnifyingGlass size={24} />
                  </button>
                )}
              </form>
            </div>

            <Dialog.Close className="unstyled icon-only">
              <X size={36} />
            </Dialog.Close>
          </div>
        
          <section className="results">
            <aside className="results-list">
              <header className="results-list-header">
                <div className="totals">
                  <ListDashes size={16}   /> {results && (
                    <>{results.length} Results</>
                  )}
                </div>
                
                {props.settings.gazetteers.length > 1 && (
                  <ResultListFilter 
                    gazetteers={props.settings.gazetteers} 
                    filter={activeGazetteers} 
                    onSetFilter={setActiveGazetteers} />
                )}
              </header>

              <ul>
                {(!searching && results) && results.map(result => (
                  <li key={result.feature.id}>
                    <ResultCard
                      plugin={props.plugin}
                      result={result}
                      color={getGazetteerColor(result)}
                      onClick={() => onSelect(result)} />
                  </li>
                ))}
              </ul>
            </aside>

            <div className="results-map">
              <ResultMap 
                plugin={props.plugin}
                settings={props.settings}
                results={results || []} 
                onConfirm={onSelect} />
            </div>
          </section>    
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )

}
import { useEffect, useState } from 'react';
import centroid from '@turf/centroid';
import { ListDashes, MagnifyingGlass, X } from '@phosphor-icons/react';
import * as Dialog from '@radix-ui/react-dialog';
import { useDebounce } from 'use-debounce';
import type { PluginInstallationConfig } from '@components/Plugins';
import { Spinner } from '@components/Spinner';
import { ResultCard } from './components/ResultCard';
import { ResultMap } from './components/ResultMap';
import type { Gazetteer, GeoJSONFeature } from '../Types';

import './GazetteerSearch.css';

interface GazetteerSearchProps {

  config: PluginInstallationConfig;

  gazetteer: Gazetteer;

  initialQuery?: string;

  onClose(): void;

  onSelect(result: GeoJSONFeature): void;

}

export const GazetteerSearch = (props: GazetteerSearchProps) => {

  const { search } = props.gazetteer;

  const [query, setQuery] = useState(props.initialQuery || '');

  const [debounced] = useDebounce(query, 500);

  const [searching, setSearching] = useState(false);

  const [results, setResults] = useState<GeoJSONFeature[]>([]);

  const onSelect = (result: GeoJSONFeature) => {
    props.onSelect(result);
    props.onClose();
  }

  useEffect(() => {
    setSearching(true);
  }, [query]);

  useEffect(() => {
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
  }, [debounced]);

  return (
    <Dialog.Root open={true} onOpenChange={props.onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />

        <Dialog.Content 
          className="dialog-content ou-gtp-gazetteer-search not-annotatable">
          <div className="header">
            <div className="searchbox">
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
            </div>

            <Dialog.Close className="unstyled icon-only">
              <X size={36} />
            </Dialog.Close>
          </div>
        
          <div className="results">
            <div className="results-list">
              <div className="totals">
                <ListDashes size={16}   /> {results.length} Results
              </div>
              <ul>
                {!searching && results.map(result => (
                  <li key={result.id}>
                    <ResultCard
                      config={props.config}
                      result={result}
                      onClick={() => onSelect(result)} />
                  </li>
                ))}
              </ul>
            </div>

            <div className="results-map">
              <ResultMap 
                config={props.config}
                results={results} 
                onConfirm={onSelect} />
            </div>
          </div>    
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )

}
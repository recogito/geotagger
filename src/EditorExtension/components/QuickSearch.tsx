import { useEffect, useMemo, useRef, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { MagnifyingGlass, Trash } from '@phosphor-icons/react';
import { Spinner } from '@components/Spinner';
import type { Gazetteer, GeoJSONFeature } from '../../Types';
import { useGeoAnnotations } from '../../useGeotags';

import './QuickSearch.css';

interface QuickSearchProps {

  gazetteer: Gazetteer;

  quote?: string;

  onChangeQuery(query?: string): void;

  onDelete(): void;

  onSearchResponse(feature?: GeoJSONFeature): void;

}

export const QuickSearch = (props: QuickSearchProps) => {

  const [query, setQuery] = useState<string | undefined>(props.quote);

  const [searching, setSearching] = useState(false);

  const [debounced] = useDebounce(query, 500);

  const el = useRef<HTMLDivElement>(null);

  const annotations = useGeoAnnotations();

  const findPreviousMatch = (query: string) => {
    const previous = annotations.find(a => { 
      const selector = Array.isArray(a.target.selector) ? a.target.selector[0] : a.target.selector;
      return query === selector.quote;
    });

    // There is an annotation with a matching quote - use its geotagging body as suggestion!
    if (previous) {
      const value = previous.bodies.find(b => b.purpose === 'geotagging')?.value;
      return value ? JSON.parse(value) : undefined;
    }
  }

  useEffect(() => {
    if (query)
      setSearching(true);
  }, [query]);

  useEffect(() => {
    props.onChangeQuery(debounced);

    if (debounced) {
      // Look for the same query in previously tagged annotations
      const previous = findPreviousMatch(debounced);

      if (previous) {
        setSearching(false);
        props.onSearchResponse(previous);
      } else {
        props.gazetteer.search(debounced, 1)
          .then(results => {
            setSearching(false);

            const first = results.length > 0 ? results[0] : undefined;
            props.onSearchResponse(first);
          })
          .catch(error => {
            console.error(error);
            setSearching(false);
          });
      }      
    } else {
      props.onSearchResponse(undefined);
    }
  }, [debounced]);

  useEffect(() => {
    const input = el.current?.querySelector('input');
    if (input?.value)
      input.select();
  }, []);

  return (
    <div 
      ref={el}
      className="ou-gtp-quicksearch">
      <div className="searchbox">
        <input
          autoFocus
          value={query || ''} 
          onChange={evt => setQuery(evt.target.value)} />

        {searching ? (
          <Spinner className="search-icon spinner" size={14} />
        ) : (
          <MagnifyingGlass className="search-icon" size={20} />
        )}
      </div>

      <button 
        className="unstyled icon-only delete"
        onClick={props.onDelete}>
        <Trash size={16} />
      </button>
    </div>
  )

}
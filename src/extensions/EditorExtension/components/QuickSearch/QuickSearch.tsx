import { useEffect, useRef, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { SupabaseAnnotation } from '@recogito/studio-sdk';
import { Spinner } from '@recogito/studio-sdk/components';
import { MagnifyingGlass, Trash } from '@phosphor-icons/react';
import { useGeoAnnotations } from '../../../../shared/useGeotags';
import type { CrossGazetteerSearchable, GeoJSONFeature } from 'src/Types';

import './QuickSearch.css';

interface QuickSearchProps {

  gazetteers: CrossGazetteerSearchable;

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
    const previous: SupabaseAnnotation | undefined = annotations.find(a => { 
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
        props.gazetteers.search(debounced, 1)
          .then(results => {
            setSearching(false);

            const first = results.length > 0 ? results[0] : undefined;
            props.onSearchResponse(first?.feature);
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
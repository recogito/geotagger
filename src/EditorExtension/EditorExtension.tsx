import { useEffect, useMemo, useState } from 'react';
import { createBody } from '@annotorious/react';
import L from 'leaflet';
import type { SupabaseAnnotation } from '@recogito/annotorious-supabase';
import type { AnnotationEditorExtensionProps } from '@components/Plugins/ExtensionProps';
import { AddGeoTag } from './components/AddGeoTag';
import { Minimap } from './components/Minimap';
import { QuickSearch } from './components/QuickSearch';
import { PlaceDetails } from './components/PlaceDetails';
import { GazetteerSearch } from '../GazetteerSearch';
import type { GeoTag, GeoJSONFeature } from '../Types';
import { useGazetteer } from '../useGazetteer';

import './EditorExtension.css';
import 'leaflet/dist/leaflet.css';

import iconRetinaUrl from '../../assets/marker-icon-2x.png';
import iconUrl from '../../assets/marker-icon.png';
import shadowUrl from '../../assets/marker-shadow.png';

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetinaUrl.src,
  iconUrl: iconUrl.src,
  shadowUrl: shadowUrl.src
});

const getQuote = (a: SupabaseAnnotation): string | undefined => {
  const selector = Array.isArray(a.target?.selector) ? 
    a.target.selector[0] : a.target?.selector;

  return selector?.quote;
}

export const EditorExtension = (props: AnnotationEditorExtensionProps) => {

  const { annotation, plugin } = props;

  const quote = getQuote(annotation);

  const [query, setQuery] = useState(quote);

  const gazetteer = useGazetteer(plugin);
  
  const [geotag, setGeotag] = useState<GeoTag | undefined>();

  const [showQuickSearch, setShowQuickSearch] = useState(false);

  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

  const isNewAnnotation = useMemo(() => annotation.bodies.length === 0, [annotation.id]);

  const saveGeoTag = (feature: GeoJSONFeature) => {
    const next = {
      ...annotation,
      bodies: [
        ...annotation.bodies.filter(b => b.purpose !== 'geotagging'),
        createBody(annotation, {
          purpose: 'geotagging',
          value: JSON.stringify(feature)
        }, new Date(), props.me)
      ]
    };

    props.onUpdateAnnotation(next);
  }

  const onConfirm = () => {
    if (!geotag?.feature) return; 
    saveGeoTag(geotag.feature);
  }

  const onFlag = () => {
    const next = {
      ...annotation,
      bodies: [
        ...annotation.bodies.filter(b => b.purpose !== 'geotagging'),
        createBody(annotation, {
          purpose: 'geotagging'
        }, new Date(), props.me)
      ]
    };

    props.onUpdateAnnotation(next);
  }

  const onQuickSearchResponse = (feature?: GeoJSONFeature) => {
    if (feature)
      setGeotag({ feature });
    else 
      setGeotag(undefined);
  }

  const onChange = (feature: GeoJSONFeature) => {
    setGeotag({ feature });
    saveGeoTag(feature);
  }

  const onDelete = () => {
    const next = {
      ...annotation,
      bodies: annotation.bodies.filter(b => b.purpose !== 'geotagging')
    };

    props.onUpdateAnnotation(next);

    setShowQuickSearch(false);
  }

  useEffect(() => {
    const geotag = annotation.bodies.find(b => b.purpose === 'geotagging');

    if (geotag) {
      const parsed: GeoTag = {
        feature: geotag.value ? JSON.parse(geotag.value) : undefined,
        confirmed: {
          by: geotag.updatedBy || geotag.creator,
          at: geotag.updated || geotag.created
        }
      };

      setGeotag(parsed);
    } else {
      setGeotag(undefined);
    }
  }, [annotation]);

  return (geotag || (showQuickSearch && gazetteer)) ? (
    <div className="ou-gtp-editor-ext">
      {(showQuickSearch && !geotag) && (
        <QuickSearch 
          gazetteer={gazetteer!} 
          quote={quote} 
          onChangeQuery={setQuery}
          onDelete={onDelete}
          onSearchResponse={onQuickSearchResponse} />
      )}

      {(geotag || query !== undefined) && (
        <div className="place-details-wrapper">
          <Minimap 
            geotag={geotag}
            plugin={plugin} />

          <PlaceDetails 
            config={plugin}
            geotag={geotag} 
            me={props.me}
            onConfirm={onConfirm}
            onDelete={onDelete} 
            onEdit={() => setShowAdvancedSearch(true)} 
            onFlag={onFlag} />
        </div>
      )}

      {showAdvancedSearch && (
        <GazetteerSearch 
          config={plugin}
          gazetteer={gazetteer!}
          initialQuery={query}
          onClose={() => setShowAdvancedSearch(false)} 
          onSelect={onChange}/>
      )}
    </div>
  ) : (isNewAnnotation || props.isEditable) ? (
    <AddGeoTag 
      initializing={!gazetteer}
      onClick={() => setShowQuickSearch(true)} />
  ) : null;

}
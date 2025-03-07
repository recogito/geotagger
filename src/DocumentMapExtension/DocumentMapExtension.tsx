import * as Dialog from '@radix-ui/react-dialog';
import { Globe, X } from '@phosphor-icons/react';
import L from 'leaflet';
import { AnnotationToolbarExtensionProps } from '@recogito/studio-sdk';
import { DocumentMap } from './components/DocumentMap';
import { GeoJSONDownload } from './components/GeoJSONDownload';
import { PNGDownload } from './components/PNGDownload';

import './DocumentMapExtension.css';
import 'leaflet/dist/leaflet.css';

import iconRetinaUrl from '../assets/marker-icon-2x.png';
import iconUrl from '../assets/marker-icon.png';
import shadowUrl from '../assets/marker-shadow.png';

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  // @ts-ignore
  iconRetinaUrl: iconRetinaUrl.src,
  // @ts-ignore
  iconUrl: iconUrl.src,
  // @ts-ignore
  shadowUrl: shadowUrl.src
});

export const DocumentMapExtension = (props: AnnotationToolbarExtensionProps) => {

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Globe size={18} />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="ou-gtp-document-map-overlay dialog-overlay" />

        <Dialog.Content 
          className="dialog-content ou-gtp-document-map-container not-annotatable">

          <Dialog.Title className="dialog-title">
            <div>{props.document.name}</div>

            <div className="titlebar-right">
              <PNGDownload
                document={props.document} />

              <GeoJSONDownload
                document={props.document} />
            </div>
          </Dialog.Title>

          <DocumentMap 
            plugin={props.plugin} 
            settings={props.settings} />

          <Dialog.Close className="dialog-close" asChild>
            <button className="unstyled icon-only">
              <X size={17} />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )

}
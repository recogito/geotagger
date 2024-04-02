import * as Dialog from '@radix-ui/react-dialog';
import { Globe, X } from '@phosphor-icons/react';
import L from 'leaflet';
import type { AnnotationToolbarExtensionProps } from '@components/Plugins';
import { DocumentMap } from './components/DocumentMap';
import { GeoJSONDownload } from './components/GeoJSONDownload';

import './DocumentMapExtension.css';

import 'leaflet/dist/leaflet.css';

import iconRetinaUrl from './assets/marker-icon-2x.png';
import iconUrl from './assets/marker-icon.png';
import shadowUrl from './assets/marker-shadow.png';

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl
});

export const DocumentMapExtension = (props: AnnotationToolbarExtensionProps) => {

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Globe size={18} />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />

        <Dialog.Content 
          className="dialog-content ou-gtp-document-map-container not-annotatable">

          <Dialog.Title className="dialog-title">
            {props.document.name}

            <div className="titlebar-right">
              <GeoJSONDownload document={props.document} />
            </div>
          </Dialog.Title>

          <DocumentMap plugin={props.plugin} />

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
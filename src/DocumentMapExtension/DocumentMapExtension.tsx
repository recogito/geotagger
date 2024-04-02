import * as Dialog from '@radix-ui/react-dialog';
import { Globe, X } from '@phosphor-icons/react';
import type { AnnotationToolbarExtensionProps } from '@components/Plugins';
import { DocumentMap } from './components/DocumentMap';
import { GeoJSONDownload } from './components/GeoJSONDownload';

import './DocumentMapExtension.css';

import 'leaflet/dist/leaflet.css';

export const DocumentMapExtension = (props: AnnotationToolbarExtensionProps) => {

  const foo = props.document

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
import * as Dialog from '@radix-ui/react-dialog';
import { Globe } from '@phosphor-icons/react';
import { DocumentMap } from './components/DocumentMap';
import type { ExtensionProps } from '@components/Plugins';

import './DocumentMapExtension.css';

import 'leaflet/dist/leaflet.css';

export const DocumentMapExtension = (props: ExtensionProps) => {

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Globe size={18} />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />

        <Dialog.Content 
          className="dialog-content ou-gtp-document-map-container not-annotatable">

          <DocumentMap plugin={props.plugin} />
         
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )

}